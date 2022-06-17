import { Button, Container, Col, Form, FormControl, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { appendErrors, useForm } from "react-hook-form";
import { formatDiagnosticsWithColorAndContext } from "typescript";
import { useState } from "react";
import landing from '../images/values-1.png';

interface FormData {
  username: string;
  password: string;
  passwordConfirm: string;
}

function Register({ apiUrl }: { apiUrl: string }) {
  const { register, handleSubmit, errors, getValues } = useForm<FormData>({ mode: "all" });
  const [registered, SetRegistered] = useState<boolean>(false);
  const [badUsername, SetBadUsername] = useState<boolean>(false);
  const [errorMessage, SetErrorMessage] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    const credentials = { username: data.username, password: data.password }
    try {
      const res = await fetch(`${apiUrl}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.status == 200) {
        // OK
        SetRegistered(true);
        SetBadUsername(false);
      }

      else if (res.status == 400) {
        // Username invalid or taken
        // try another one
        const body = await res.json();
        SetErrorMessage(body.message);
        SetBadUsername(true);
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
  };

  return (
    <Row className="g-0">
    <Col lg={12} style={{ height: "calc(100vh - 57px)"}} className="d-flex align-items-center">
    
  <Container>
    <Row style={{ height: "calc(100vh - 57px)"}} className="d-flex align-items-center">
      <Col lg={6} className="p-5" style={{textAlign: "left"}}>
        
        <h1 style={{paddingBottom: "1rem"}}>Create a new account</h1>
        <p style={{paddingBottom: "1rem"}}>Welcome to DESDEO! Enter the required information to create an account.</p>
          {badUsername && <p className="text-danger">{`${errorMessage}`}</p>}
          {!registered && <Form
            className="mb-3"
            action=""
            onSubmit={handleSubmit(onSubmit)}
          >
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter an username"
                name="username"
                ref={register({ required: { value: true, message: "The username is required." } })}
                isInvalid={errors.username !== undefined}
              />
              {errors.username &&
                <Form.Control.Feedback type="invalid">{`${errors.username.message}`}</Form.Control.Feedback>}
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                ref={register({ required: { value: true, message: "Password required." }, validate: value => value.length > 5 || "Password too short. Password must be at least 6 characters long." })}
                isInvalid={errors.password !== undefined}
              />
              {errors.password &&
                <Form.Control.Feedback type="invalid">{`${errors.password.message}`}</Form.Control.Feedback>}
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat your password"
                name="passwordConfirm"
                ref={register({ required: { value: true, message: "Password confirmation required." }, validate: value => value === getValues("password") || "Passwords do not match!" })}
                isInvalid={errors.passwordConfirm !== undefined}
              />
              {errors.passwordConfirm &&
                <Form.Control.Feedback type="invalid">{`${errors.passwordConfirm.message}`}</Form.Control.Feedback>}
            </Form.Group>
            <Button className="mt-1" type="submit">Register</Button>
          </Form>}
          {registered && <Link to="/Login">Proceed to login</Link>}
          </Col>
            <Col lg={6}>
              <Row>
              <h2>Already have an account?</h2>

              <div style={{textAlign:"center", color:"white"}}>
              
              <Link to={"/login"}>
              <Button>
              Login
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
  );
}

export default Register;
