import React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Tokens } from "../types/AppTypes";

import { Container, ListGroup, Tab, Row, Col, Table, Button, Form } from "react-bootstrap";

import { useDropzone } from 'react-dropzone';
import { useCallback } from "react";
import parse from "csv-parse";
import Dropzone from "react-dropzone";
import { timeStamp } from "console";

interface ProblemExploreProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface LogProps{
  id:number;
  entry_type: string;
  data: string;
  info: string;
  decision_variables: string;
  objective_values: string;
  timestamp:string;
}



function ProblemExplore({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  setCurrentPage,
}: ProblemExploreProps) {
  setCurrentPage("");
  const [key, SetKey] = useState<string | null>("0");
  const [logs, SetLogs] = useState<LogProps[]>([
    {
      id: 0,
      entry_type: "empty",
      data: "empty",
      info: "empty",
      decision_variables: "empty",
      objective_values: "empty",
      timestamp:"empty",
    },
  ]);

  /*const onSubmit = async (data: LogProps) => {
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
  };*/

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${apiUrl}/log/create`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();
          SetLogs(body.logs);
          // problems set!
        } else {
          console.log(
            `Got return code ${res.status}. Could not fetch logs.`
          );
          // do nothing
        }
      } catch (e) {
        console.log("not ok");
        console.log(e);
        //do nothing
      }
    };

    fetchLogs();
  }, []);

  return (
    <>
      {isLoggedIn && (
        <Container className="py-4 py-xl-5">
            <Row>
              <Col lg={12}>
                {/* <Button className="mt-1" onClick={() => { onSubmit({id:0,entry_type:"test", data:"testi", info:"estaaa", decision_variables:"[0,0,0]", objective_values:"1,1,1"}) }}>Create dummy log</Button> */}
              <Table hover style={{background:"white", tableLayout:"fixed"}}>
                  <thead>
                    <tr>
                      <th>Problem name</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Decision variables</th>
                      <th>Objective values</th>
                      
                    </tr>
                  </thead>
                <tbody>
                  {logs.map((entry, index) => {
                    return (
                      <tr key={entry.id}>
                        <td>{entry.info}</td>
                        <td>{entry.data}</td>
                        <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
                        <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                        <td>{entry.decision_variables.split(",").map((item, i)=>parseFloat(item).toFixed(3).toString()).join(", ")}</td>
                        <td>{entry.objective_values.split(",").map((item, i)=>parseFloat(item).toFixed(3).toString()).join(", ")}</td>
{/*                         <td><div>{entry.decision_variables.split(',').map((item, i) => <p key={i}>{parseFloat(item).toFixed(4)}</p>)}</div></td>
                        <td><div>{entry.objective_values.split(",").map((item, i) => <p key={i}>{parseFloat(item).toFixed(4)}</p>)}</div></td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              </Col>
            </Row>
        </Container>
      )}
      {!isLoggedIn && <Container>Please login first.</Container>}
    </>
  );
}

export default ProblemExplore;
