import React from "react";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Tokens } from "../types/AppTypes";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import landing from '../images/values-1.png';

interface FormData {
  username: string;
  password: string;
}

export const Login = ({
  apiUrl,
  setIsLoggedIn,
  setLoggedAs,
  setTokens,
}: {
  apiUrl: string;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedAs: React.Dispatch<React.SetStateAction<string>>;
  setTokens: React.Dispatch<React.SetStateAction<Tokens>>;
}) => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [loginOk, SetLoginOk] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status == 200) {
        // Status is ok
        setLoggedAs(data.username);
        setIsLoggedIn(true);
        SetLoginOk(true);

        const body = await res.json();
        setTokens({ access: body.access_token, refresh: body.refresh_token });
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
  };

  return (
    <>
      {!loginOk && (
        <Row className="g-0">
          <Col lg={12} style={{ height: "calc(100vh - 57px)"}} className="d-flex align-items-center">
          
        <Container className="g-0 p-0">
          <Row style={{ height: "calc(100vh - 57px)"}} className="d-flex align-items-center g-0">
            <Col lg={6} className="p-5" style={{textAlign: "left"}}>
              
              <h1 style={{paddingBottom: "1rem"}}>Login to your account</h1>
              <p style={{paddingBottom: "1rem"}}>Welcome back! Log in to start using DESDEO.</p>
              <Form
                className="align-content-left"
                action=""
                onSubmit={handleSubmit(onSubmit)}
              >
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    className="mb-3"
                    type="username"
                    placeholder="Enter your username"
                    name="username"
                    ref={register({ required: { value: true, message: "Username is required." } })}
                    isInvalid={errors.username !== undefined}
                  />
                  {errors.username &&
                    <Form.Control.Feedback type="invalid">{`${errors.username.message}`}</Form.Control.Feedback>}
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="mb-3"
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    ref={register({ required: { value: true, message: "Password is required." } })}
                    isInvalid={errors.password !== undefined}
                  />
                  {errors.password &&
                    <Form.Control.Feedback type="invalid">{`${errors.password.message}`}</Form.Control.Feedback>}
                </Form.Group>
                <Button className="mt-5" type="submit">Submit</Button>
              </Form>
            </Col>
            <Col lg={6}>
              <Row>
              <h2>New here?</h2>
              <p>Sign up and start using DESDEO. It's free!</p>
              <div style={{textAlign:"center", color:"white"}}>
              
              <Link to={"/register"}>
              <Button>
              Sign up
              </Button>
              </Link>
                
              </div>
              
              </Row>
              <Row>
              <div style={{textAlign:"center", color:"white"}}>
              <img src={landing}  style={{maxWidth:"70%", height: "auto"}} alt=""></img>
              </div>
              </Row>
              
             
        
            </Col>
          </Row>
        </Container>
        </Col>
        </Row>
      )}
      {loginOk && (
        <Container>
          {`Logged in`}
          <Redirect to="/main" />
        </Container>
      )}
    </>
  );
};

export default Login;
