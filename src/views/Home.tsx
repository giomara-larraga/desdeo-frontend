import React from "react";

import { Container,Row,Col,Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import landing from '../images/g18.png';

function Home() {
  return  (
    <Row className="g-0">
    <Col lg={12} style={{ height: "100vh", backgroundColor:"black"}} className="d-flex align-items-center">
      <Container>
        <Row>
          <Col lg={6} className="d-flex flex-column" style={{alignContent:"left"}}>
            <h1 style={{fontSize:"48px", fontWeight:700, fontFamily:"Lato", textAlign:"left", color:"white"}}>Enabling better decision making</h1>
            <p style={{fontSize:"20px", marginTop:"25px", textAlign:"left", color:"white",  fontWeight:100, fontFamily:"Lato"}}> 
                  DESDEO brings interactive methods closer to researchers and practitioners worldwide by providing them with implementations of interactive methods.
                  It is a free and open-source Python-based framework for developing and experimenting with interactive multiobjective optimization. 
                  We welcome you to utilize DESDEO and develop it further with us.</p>
            <div style={{textAlign:"left", color:"white"}}>
              <Link to={"/login"}>
              <Button >
              Login
              </Button>
              </Link>
              <Link to={"/register"}>
              <Button className="mx-5">
              Sign up
              </Button>
              </Link>

              
            </div>
          </Col>
          <Col style={{maxWidth:"100%", height: "auto"}}>
            <img src={landing}  style={{maxWidth:"75%", height: "auto"}} alt=""></img>
          </Col>
        </Row>
      </Container>
    </Col>
    </Row>
  );
}

export default Home;





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