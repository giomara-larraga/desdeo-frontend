import React from "react";

import { Container,Row,Col,Button, Card} from "react-bootstrap";
import landing from '../images/g18.png';
import { Link } from "react-router-dom";
import { Tokens } from "../types/AppTypes";

interface LandingPageProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
}

function LandingPage({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
}:LandingPageProps) {
  return  (
    <Container className="py-4 py-xl-5">
      <Row className="mb-5">
        <Col lg={8} className="text-center mx-auto">
          <h2>Welcome to DESDEO!</h2>
          <p className="w-lg-50">Solve a multiobjective optimization problem utilizing one of the methods available. You can also explore the problems available in DESDEO or to define a new one.</p>
        </Col>
      </Row>
      <Row className="gy-4">
        <Col lg={4}>
          <Card>
            <Card.Title>
              Start a solution process
            </Card.Title>
            <Card.Body>
              <div>
              <p>Select the problem to solve and the method to utilize and start a new solution process.</p>
              <Link to={"/method/create"}>
              <Button>Start</Button>
              </Link>

              </div>

            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Title>
              Access solutions obtained previously
            </Card.Title>
            <Card.Body>
              <div>
              <p>If you have utilized DESDEO before, we store the final solutions found for each problem.</p>
              <Link to={"/problem/explore"}>
              <Button>Explore</Button>
              </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Title>
              Do you need help?
            </Card.Title>
            <Card.Body>
              <div>
                <p>Try to find your question in the FAQ section, visit our website, or contact us.</p>
                <Link to={"/help"}>
              <Button>Learn more</Button>
              </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>



      </Row>
    </Container>

  );
}

export default LandingPage;





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