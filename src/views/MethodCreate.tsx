import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Tokens } from "../types/AppTypes";
import { Container, Form, Row, Col, Button, Card, Table } from "react-bootstrap";
import { useHistory  } from 'react-router-dom';
import methodslist from "../types/methods.json";
import { useDropzone } from 'react-dropzone';
import { useForm } from "react-hook-form";
import parse from "csv-parse";

interface MethodCreateProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  setMethodCreated: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenMethod: React.Dispatch<React.SetStateAction<string>>;
  setActiveProblemId: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface Problem {
  id: number;
  name: string;
  problem_type: string;
  n_variables: number;
  n_objectives: number;
  constraints: number;
}

interface ProblemData {
  problem_type: string;
  name: string;
  objective_functions: string[];
  objective_names: string[];
  variables: string[];
  variable_initial_values: number[];
  variable_bounds: number[][];
  variable_names: string[];
  ideal: number[];
  nadir: number[];
  minimize: number[];
}

interface DiscreteProblemData {
  problem_type: string;
  name: string;
  objectives: number[][];
  objective_names: string[];
  variables: number[][];
  variable_names: string[];
  minimize: number[];
}

interface ProblemNameAndType {
  name: string;
  type: string;
}


function MethodCreate({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  setMethodCreated,
  setChosenMethod,
  setActiveProblemId,
  setCurrentPage,
}: MethodCreateProps) {
  const [problems, SetProblems] = useState<Problem[]>([
    {
      id: 0,
      name: "placeholder",
      problem_type: "test",
      n_variables: 0,
      n_objectives: 0,
      constraints: 0,
    },
  ]);
  const [currentProblem, SetCurrentProblem] = useState<Problem>(
    {
      id: -1,
      name: "none",
      problem_type: "All",
      n_variables: 0,
      n_objectives: 0,
      constraints: 0,
    }
  );
  const [methodKey, SetMethodKey] = useState<number>(-1);

  const [problemDefined, SetProblemDefined] = useState<boolean>(false);

  const [updatedTable, SetUpdatedTable] = useState<boolean>(false);
  const [
    problemNameAndType,
    SetProblemNameAndType,
  ] = useState<ProblemNameAndType>({ name: "", type: "" });
  const { register, handleSubmit, errors } = useForm<ProblemData>();
  const [message, SetMessage] = useState<string>("");
  const [discreteData, SetDiscreteData] = useState<DiscreteProblemData>({
    problem_type: "",
    name: "",
    objectives: [[]],
    objective_names: [],
    variables: [[]],
    variable_names: [],
    minimize: []
  });
  const [discreteProblemLoaded, SetDiscretePoblemLoaded] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // only single files are handled
    const name = file.name;
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      const textStr = reader.result as string
      parse(textStr, { comment: '#', trim: true, skipEmptyLines: true }, (err, output) => {
        if (err != undefined) {
          SetMessage(`Error parsing csv file: ${err.message}`);
          return;
        } else {
          // Output should contain at least 3 rows
          if (output.length < 3) {
            SetMessage("The csv data should contain at least three rows. Less than three rows provided.");
            return;
          }
          try {
            // First row should be names
            const names = output[0];
            // Second row directions: 'min' or 'max' for objectives, 'var' for variables
            const objOrVar = output[1];
            const nObjectives = objOrVar.filter((x: string) => x.toLowerCase() === "min" || x.toLowerCase() === "max").length
            const nVars = objOrVar.filter((x: string) => x.toLowerCase() === "var").length
            // Check for proper number of symbols on second row
            if (nObjectives + nVars !== objOrVar.length) {
              SetMessage("The second row in the csv file contains unsupported symbols. Supported symbols are 'min', 'max', and 'var'.")
              return;
            }
            // Get directions: 1 == minimize, -1 == maximize
            const directions = objOrVar.slice(0, nObjectives).map((x: string) => x === "min" ? 1 : -1);
            const objNames = names.slice(0, nObjectives);
            const varNames = names.slice(nObjectives);

            // Rest should be the data
            const data = output.slice(2);
            // When parsing the objectives, also check the direction and convert maximization objectives to minimization by multiplying
            // them with -1.
            const objData = data.map((x: string[]) => x.slice(0, nObjectives).map((y: string, i) => directions[i] === 1 ? parseFloat(y) : -1.0 * parseFloat(y)));
            const varData = data.map((x: string[]) => x.slice(nObjectives).map((y: string) => parseFloat(y)));

            // Set the data
            const problemData: DiscreteProblemData = {
              problem_type: "Discrete",
              name: name,
              objectives: objData,
              objective_names: objNames,
              variables: varData,
              variable_names: varNames,
              minimize: directions
            }

            SetDiscreteData(problemData);
            SetDiscretePoblemLoaded(true);
            return;
          } catch (err) {
            SetMessage("Something went wrong when parsing the csv file.")
            return;
          }

        }
      })
    }
    reader.readAsText(file)
  }, [SetMessage, SetDiscreteData, SetDiscretePoblemLoaded])

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    maxFiles: 1,
    onDropRejected: (fileRejection, event) => alert("File not accepted!"),
    onDrop: onDrop
  });

  let history = useHistory();
  useEffect(() => {
    if (!isLoggedIn) {
      // do nothing
      return;
    }
    const fetchProblems = async () => {
      try {
        const res = await fetch(`${apiUrl}/problem/access`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();
          SetProblems(body.problems);
          // problems fetched!
        } else {
          console.log(
            `Got return code ${res.status}. Could not fetch problems.`
          );
          // do nothing
        }
      } catch (e) {
        console.log("not ok");
        console.log(e);
        //do nothing
      }
    };

    fetchProblems();
    SetUpdatedTable(true);
  }, [updatedTable]);

  const dummyProblem: ProblemData = {
    problem_type: "Analytical",
    name: "River pollution problem (correct)",
    objective_functions: [
      "-4.07 - 2.27*x",
      "-2.60 - 0.03*x - 0.02*y - 0.01/(1.39 - x**2) - 0.30/(1.39 + y**2)",
      "-8.21 + 0.71 / (1.09 - x**2)",
      "-0.96 - 0.96/(1.09 - y**2)",
    ],
    objective_names: ["WQ City", "WQ Border", "ROI City", "Tax City"],
    variables: ["x", "y"],
    variable_initial_values: [0.5, 0.5],
    variable_bounds: [
      [0.3, 1.0],
      [0.3, 1.0],
    ],
    variable_names: ["x_1", "x_2"],
    ideal: [-6.339, -2.864, -7.499, -11.626],
    nadir: [-4.751, -2.767, -0.321, -1.92],
    minimize: [1, 1, 1, 1],
  };

  const onSubmit = async (data: ProblemData | DiscreteProblemData) => {
    console.log((data));
   
    function isDiscreteProblemData(data: ProblemData | DiscreteProblemData): data is ProblemData {
      return (data as DiscreteProblemData).objectives !== undefined;
    }

    if (!isDiscreteProblemData(data)) {
      data = dummyProblem;
    }

    try {
      const res = await fetch(`${apiUrl}/problem/create`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(data),
      });
      if (res.status == 201) {
        //status ok
        const body = await res.json();
        SetProblemNameAndType({ name: body.name, type: body.problem_type });
        SetProblemDefined(true);
        SetUpdatedTable(false);
        
      }
    } catch (e) {
      console.log("not ok");
      console.log(e);
      // do nothing
    }
  };


  const handleSubmitMethod = async () => {
    
    console.log(`selected: problem ${currentProblem.id} method ${methodKey}`);
    try {
      let methodName: string = "";
      switch (methodKey) {
        case 0: {
          methodName = "reference_point_method";
          setCurrentPage("Reference point method");
          break;
        }
        case 1: {
          methodName = "synchronous_nimbus";
          setCurrentPage("Synchronous NIMBUS");
          break;
        }
        case 2: {
          methodName = "nautilus_navigator";
          setCurrentPage("Nautilus navigator");
          break;
        }
        default: {
          throw Error(`Invalid methodKey: ${methodKey}`);
        }
      }

      const data = { problem_id: currentProblem.id, method: methodName };
      const res = await fetch(`${apiUrl}/method/create`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(data),
      });

      if (res.status == 201) {
        const body = await res.json();
        console.log(body);
        setMethodCreated(true);
        setActiveProblemId(currentProblem.id);
        setChosenMethod(methodName);
        history.push("/method/optimize");
        // created!
      } else {
        console.log(`Got return code ${res.status}. Could not create method.`);
        // do nothing
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <p>You need to login first before setting up a new method.</p>
      </>
    );
  }

  return (
    <>
      <Container className="py-4 py-xl-5">
        <Row>
          <Col sm={6}>
            <Card style={{minHeight:"16rem", padding:"2rem"}}>
              <Card.Title>
                1) Select the problem to solve
              </Card.Title>
              <Card.Body>
                <p className="description-card">To start a solution process, you need to first select the optimization problem that you want to solve. The following problems are available.</p>
              <Table hover>
                  <thead>
                    <tr>
                      <th>Problem name</th>
                      <th>Objectives</th>
                      <th>Variables</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                <tbody>
                  {problems.map((problem, index) => {
                    return (
                      <tr key={index} data-item={problem} onClick={() => SetCurrentProblem(problem)} className={currentProblem.id === problem.id ? 'selected' : ''}>
                        <td>{problem.name}</td>
                        <td>{problem.n_objectives}</td>
                        <td>{problem.n_variables}</td>
                        <td>{problem.problem_type}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
          
              <Container>
                    <section className="container border border-dark mt-5 rounded-pill">
                      <div {...getRootProps()} className="align-middle">
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop files here, or click to select files to define a discrete problem</p>
                      </div>
                    </section>
                    {discreteProblemLoaded && (
                      <>
                        <p>Discrete problem loaded!</p>
                        <Button onClick={() => { onSubmit(discreteData) }}>Send</Button>
                      </>
                    )}
                    <p>{`${message}`}</p>
                  </Container>
                  
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6}>
            <Card style={{minHeight:"16rem", padding:"2rem"}}>
              <Card.Title>
                2) Select the method to utilize
              </Card.Title>
              <Card.Body>
              <p className="description-card">The following methods can be utilized to solve the selected problem. This list is updated according to the type of problem selected.</p>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Method name</th>
                      <th>Type of preferences</th>
                    </tr>
                  </thead>
                <tbody>
                  {currentProblem.problem_type === "All" &&(
                    methodslist.map((method, index) => {
                      return (
                        <tr  key={index} data-item={method} onClick={() => SetMethodKey(index) } className={methodKey === method.id ? 'selected' : ''}>
                          <td>{method.name}</td>
                          <td>{method.preferences_type}</td>
                        </tr>
                      );
                    })
                  )}
                  {!(currentProblem.problem_type === "All") &&(
                    methodslist.map((method, index) => {
                      if (method.type ==currentProblem.problem_type){
                      return (
                        <tr  key={index} data-item={method} onClick={() => SetMethodKey(index)} className={methodKey === method.id ? 'selected' : ''}>
                          <td>{method.name}</td>
                          <td>{method.preferences_type}</td>
                        </tr>
                      );}
                    })
                  )}
                  
                </tbody>
              </Table>
              </Card.Body>
              <Card.Footer>
              <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmitMethod();
                    }}
                  >
                    Start
                  </Button>  
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MethodCreate;
