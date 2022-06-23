import React from "react";

import { Container,Row,Col,Button, Accordion} from "react-bootstrap";
import { Link } from "react-router-dom";
import landing from '../images/g18.png';

function Help() {
  return  (
    <Container className="py-4 py-xl-5">
    <Row className="mb-5">
      <Col lg={8} className="text-center mx-auto">
        <h5>Frequently Asked Questions</h5>
        <p>Got a question? We are here to answer! If you don't see your question here, contact us at optim@jyu.fi</p>
      </Col>
    </Row>
    <Row className="gy-4">
      
    <Accordion defaultActiveKey="0" flush>
  <Accordion.Item eventKey="0">
    <Accordion.Header>How can I define a new test problem?</Accordion.Header>
    <Accordion.Body style={{textAlign:"left"}}>
      To define a new test problem you need to go to the "Solve" section. 
      At the bottom of the first column, there is a box in which you can drag 
      a file or to click that area to open a new window to select the file.
      The file must have the following format: the objectives must be on the first columns,
      followed by the decision variables. The first row contains the name of each objective and variable,
      while the second row can contain one of the following values:
      <ul>
        <li>min: minimization</li>
        <li>max: maximization</li>
        <li>var: decision variable</li>
      </ul>
      After submiting the file, a "Save" button will appear at the bottom. Click it to store the problem. 
      The table with the list of problems will be updated automatically.
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>Can I define a new analytical problem</Accordion.Header>
    <Accordion.Body style={{textAlign:"left"}}>
      Currently this option is not available. If you want an analytical problem to be available on DESDEO, 
      please contact us at optim@jyu.fi.
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Header>Why my solution is not shown in the "History" section</Accordion.Header>
    <Accordion.Body style={{textAlign:"left"}}>
      The history section only stores the final solutions obtained after finishing a solution process. 
      If you continued iterating but did not pressed the "Stop" button, the solution will not be stored.
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="3">
    <Accordion.Header>Why the method that I want to use is not listed after selecting the problem that I defined</Accordion.Header>
    <Accordion.Body style={{textAlign:"left"}}>
     As the user-defined problems are all "Discrete", only the methods that work for that type of problems are listed.
    </Accordion.Body>
  </Accordion.Item>
</Accordion>

    </Row>

  </Container>

  );
}

export default Help;





{/* <Container className="d-flex h-100" style={{display:"flex", alignItems:"center"}}>
  <Row className="justify-content-center align-self-center">
    <Col md={12} lg={12} xl ={12}>
          <Row className="align-items-center h-100">
            <Col lg={7}>
                  <h1 style={{color: "rgb(0,0,0)", fontSize:50, marginBottom:'2rem'}}>Enabling better decision making</h1>
                  <p style={{textAlign: "left", transformOrigin: "bottom", marginTop:'1rem', marginBottom:'1rem'}}>
                  DESDEO brings interactive methods closer to researchers and practitioners worldwide by providing them with implementations of interactive methods.
                  It is a free and open-source Python-based framework for developing and experimenting with interactive multiobjective optimization. 
                  We welcome you to utilize DESDEO and develop it further with us.
                  </p>
            </Col>
            <Col lg={5} className='p-5'>
              nfkv
            </Col>
          </Row>

    </Col>
  </Row>
</Container> */}