import { useEffect, useState } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../types/ProblemTypes";
import { Tokens } from "../types/AppTypes";
import ReferencePointInputForm from "../components/ReferencePointInputForm";
import { Table, Container, Row, Col, Button, Form } from "react-bootstrap";
import ReactLoading from "react-loading";
import { ParseSolutions, ToTrueValues} from "../utils/DataHandling";
import { ParallelAxes } from "desdeo-components";
import HorizontalBars from "../components/HorizontalBars";
import SolutionTable from "../components/SolutionTable";
import { Link } from "react-router-dom";

interface ReferencePointMethodProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  methodCreated: boolean;
  activeProblemId: number | null;
}

function ReferencePointMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  methodCreated,
  activeProblemId
}: ReferencePointMethodProps) {
  const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();
  const [methodStarted, SetMethodStarted] = useState<boolean>(false);
  const [data, SetData] = useState<ObjectiveData>();
  const [helpMessage, SetHelpMessage] = useState<string>(
    "Method not started yet."
  );
  const [referencePoint, SetReferencePoint] = useState<number[]>([]);
  const [currentPoint, SetCurrentPoint] = useState<number[]>([]);
  const [fetchedInfo, SetFetchedInfo] = useState<boolean>(false);
  const [loading, SetLoading] = useState<boolean>(false);
  const [alternatives, SetAlternatives] = useState<ObjectiveData>();
  const [indexCurrentPoint, SetIndexCurrentPoint] = useState<number>(0);
  const [satisfied, SetSatisfied] = useState<boolean>(false);
  const [showFinal, SetShowFinal] = useState<boolean>(false);
  const [finalObjectives, SetFinalObjectives] = useState<number[]>([]);
  const [finalVariables, SetFinalVariables] = useState<number[]>([]);

  interface LogProps{
    id:number;
    entry_type: string;
    data: string;
    info: string;
    decision_variables: string;
    objective_values: string;
  }

  useEffect(() => {
    if (alternatives !== undefined) {
      SetCurrentPoint(alternatives.values[indexCurrentPoint].value);
    }
  }, [indexCurrentPoint]);

  useEffect(() => {
    if (alternatives === undefined) {
      SetHelpMessage(
        `Provide a reference point. The current reference point is [${referencePoint.map(
          (v, i) =>
            activeProblemInfo?.minimize[i] === 1 ? v.toFixed(3) : -v.toFixed(3)
        )}]`
      );
    } else if (!satisfied) {
      SetHelpMessage(
        `Provide a new reference point or select a final solution and stop. The current reference point is [${referencePoint.map(
          (v, i) =>
            activeProblemInfo?.minimize[i] === 1 ? v.toFixed(3) : -v.toFixed(3)
        )}]`
      );
    } else {
      SetHelpMessage(
        `Final solution is set to [${referencePoint.map((v, i) =>
          activeProblemInfo?.minimize[i] === 1 ? v.toFixed(3) : -v.toFixed(3)
        )}]. If you are happy with the solution, click on 'stop'`
      );
    }
  }, [referencePoint, alternatives, satisfied, activeProblemInfo]);

  // fetch current problem info
  useEffect(() => {
    if (!methodCreated) {
      // method not defined yet, do nothing
      console.log("useEffect: method not defined");
      return;
    }
    if (activeProblemId === null) {
      // no active problem, do nothing
      console.log("useEffect: active problem is null");
      return;
    }

    const fetchProblemInfo = async () => {
      try {
        const res = await fetch(`${apiUrl}/problem/access`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ problem_id: activeProblemId }),
        });

        if (res.status == 200) {
          // ok!
          const body = await res.json();
          SetActiveProblemInfo({
            problemId: body.problem_id,
            problemName: body.problem_name,
            problemType: body.problem_type,
            objectiveNames: body.objective_names,
            variableNames: body.variable_names,
            nObjectives: body.n_objectives,
            ideal: body.ideal,
            nadir: body.nadir,
            minimize: body.minimize,
          });
          SetReferencePoint(body.ideal);
          SetCurrentPoint(body.ideal);
          SetFetchedInfo(true);
        } else {
          //some other code
          console.log(`could not fetch problem, got status code ${res.status}`);
        }
      } catch (e) {
        console.log("not ok");
        console.log(e);
        // do nothing
      }
    };

    fetchProblemInfo();
  }, []);

  // start the method
  useEffect(() => {
    if (activeProblemInfo === undefined) {
      // no active problem, do nothing
      console.log("Active problem not defined yet.");
      return;
    }

    if (methodStarted) {
      // method already started, do nothing
      return;
    }
    // start the method
    const startMethod = async () => {
      try {
        const res = await fetch(`${apiUrl}/method/control`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();

          // To begin, just show something neutral
          const datum: ObjectiveDatum = {
            selected: false,
            value: activeProblemInfo.minimize.map((_, i) => {
              return (
                (activeProblemInfo.nadir[i] + activeProblemInfo.ideal[i]) / 2
              );
            }),
          };
          const data: ObjectiveData = {
            values: [datum],
            names: activeProblemInfo.objectiveNames,
            directions: activeProblemInfo.minimize,
            ideal: activeProblemInfo.ideal,
            nadir: activeProblemInfo.nadir,
          };

          SetData(data);
          SetMethodStarted(true);
          SetReferencePoint(datum.value);
          SetHelpMessage(
            `Provide a reference point. The current reference point is [${datum.value.map(
              (v) => v.toFixed(3)
            )}]`
          );
        }
      } catch (e) {
        console.log("not ok, could not start the method");
        console.log(`${e}`);
      }
    };

    startMethod();
  }, [activeProblemInfo, methodStarted]);

  const saveLog = async (data: LogProps) => {
    const log = { entry_type: data.entry_type, data: data.data, info:data.info, decision_variables:data.decision_variables, objective_values:data.objective_values }
    try {
      const res = await fetch(`${apiUrl}/log/create`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(log),
      });

      if (res.status == 201) {
        // OK
        console.log("OK")
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
  };


  const stop = async () => {
    SetLoading(true);
    console.log("loading...");
    try {
      const res = await fetch(`${apiUrl}/method/control`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: { satisfied: true, solution_index: indexCurrentPoint },
        }),
      });

      if (res.status === 200) {
        // ok
        const body = await res.json();
        const response = body.response;
        SetFinalObjectives(response.objective_vector);
        SetFinalVariables(response.solution);
        saveLog({id:0, entry_type:"Final solution", info:activeProblemInfo!.problemName, data: "Reference point method", decision_variables: response.solution.join(","), objective_values: response.objective_vector.join(",")})
        SetShowFinal(true);
      } else {
        console.log("Got a response which is not 200");
      }
    } catch (e) {
      console.log("Could not iterate RFP");
      console.log(e);
      // do nothing
    }
    SetLoading(false);
    console.log("done!");
    
  }
  const iterate = async () => {
    // Attempt to iterate
    SetLoading(true);
    console.log("loading...");
      try {
        console.log(`Trying to iterate with ${referencePoint}`);
        const res = await fetch(`${apiUrl}/method/control`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response: { reference_point: referencePoint },
          }),
        });

        if (res.status === 200) {
          // ok
          const body = await res.json();
          const response = body.response;
          SetHelpMessage(response.message);
          SetReferencePoint(response.current_solution);
          SetCurrentPoint(response.current_solution);
          SetAlternatives(
            ParseSolutions(
              [response.current_solution].concat(response.additional_solutions),
              activeProblemInfo!
            )
          );
          console.log(response.additional_solutions);
        } else {
          console.log("Got a response which is not 200");
        }
      } catch (e) {
        console.log("Could not iterate RFP");
        console.log(e);
        // do nothing
      }
    SetIndexCurrentPoint(0)
    SetLoading(false);
    console.log("done!");
  };

  if (
    !methodCreated ||
    activeProblemId === null ||
    activeProblemInfo === undefined
  ) {
    return <>Please define a method first.</>;
  }

  return (
    <Container>
      {!showFinal && (
        <>
          <Row>
            <Col sm={4}>
              <div className={"mt-5"} style={{paddingTop: "40px"}}>
              {fetchedInfo && (
                <>
                  <ReferencePointInputForm
                    setReferencePoint={SetReferencePoint}
                    referencePoint={referencePoint}
                    nObjectives={activeProblemInfo.nObjectives}
                    objectiveNames={activeProblemInfo.objectiveNames}
                    ideal={activeProblemInfo.ideal}
                    nadir={activeProblemInfo.nadir}
                    directions={activeProblemInfo.minimize}
                  />
                </>
              )}
              </div>
            </Col>
            <Col sm={8}>
              {fetchedInfo && (
                <div className={"mt-5"}>
                  <HorizontalBars
                    objectiveData={ToTrueValues(
                      ParseSolutions([referencePoint], activeProblemInfo)
                    )}
                    referencePoint={referencePoint.map((v, i) =>
                      activeProblemInfo.minimize[i] === 1 ? v : -v
                    )}
                    currentPoint={currentPoint.map((v, i) =>
                      activeProblemInfo.minimize[i] === 1 ? v : -v
                    )}
                    setReferencePoint={(ref: number[]) =>
                      SetReferencePoint(
                        ref.map((v, i) =>
                          activeProblemInfo.minimize[i] === 1 ? v : -v
                        )
                      )
                    }
                  /> 
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
            
                <Button size={"lg"} onClick={iterate} disabled={(loading  || satisfied)?true:false}>
                  Iterate
                </Button>
        
             
                <Button size={"lg"} disabled={(((indexCurrentPoint)===0)||loading)?true:false} onClick={stop}>
                  Stop
                </Button>
              
              {loading && (
                <Button
                  disabled={true}
                  size={"lg"}
                  variant={"info"}
                >
                  {"Working... "}
                  <ReactLoading
                    type={"bubbles"}
                    color={"#ffffff"}
                    className={"loading-icon"}
                    height={28}
                    width={32}
                  />
                </Button>
              )}
            </Col>
            <Col sm={8}></Col>
          </Row>
          {!(alternatives === undefined) && (
            <>
              <Row>
                <Col sm={2}></Col>
                <Col>
                  <h4 className="mt-3">Alternative solutions</h4>
                </Col>
                <Col sm={2}></Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <div className={"mt-2"}>
                    <SolutionTable
                      objectiveData={alternatives!}
                      setIndex={SetIndexCurrentPoint}
                      selectedIndex={indexCurrentPoint}
                      tableTitle={""}
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className={"mt-3"}>
                    <ParallelAxes
                      objectiveData={ToTrueValues(alternatives!)}
                      selectedIndices={[indexCurrentPoint]}
                      handleSelection={(x: number[]) => {
                        x.length > 0
                          ? SetIndexCurrentPoint(x.pop()!)
                          : SetIndexCurrentPoint(indexCurrentPoint);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
      {showFinal && (
        <>
          <SolutionTable
            objectiveData={ParseSolutions([finalObjectives], activeProblemInfo)}
            setIndex={() => console.log("nothing happens...")}
            selectedIndex={0}
            tableTitle={"Final objective values"}
          />
          <p>{"Final decision variable values:"}</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                {finalVariables.map((_, i) => {
                  return <th>{`x${i + 1}`}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                {finalVariables.map((v) => {
                  return <td>{`${v.toFixed(4)}`}</td>;
                })}
              </tr>
            </tbody>
          </Table>
          
          <Link to={{ pathname: "/main", state: { isLoggedIn, loggedAs, tokens, apiUrl } }}>
              <Button>Back to index</Button>
          </Link>
        </>
      )}
    </Container>
  );
}

export default ReferencePointMethod;
