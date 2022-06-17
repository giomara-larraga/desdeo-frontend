import React from "react";
import "./App.css";

import Login from "./views/Login";
import Home from "./views/Home";
import LandingPage from "./views/LandingPage";
import NavigationBar from "./components/NavBar";
import Logout from "./views/Logout";
import Register from "./views/Register";
import ProblemDefinition from "./views/ProblemDefinition";
import ProblemExplore from "./views/ProblemExplore";
import ReferencePointMethod from "./views/ReferencePointMethod";
import NimbusMethod from "./views/NimbusMethod";
import NautilusNavigatorMethod from "./views/NautilusNavigatorMethod";
import MethodCreate from "./views/MethodCreate";
import Questionnaire from "./views/Questionnaire";
import { Tokens } from "./types/AppTypes";
import { useState } from "react";
import PrivateLayout from "./components/PrivateLayout"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//import "bootstrap/dist/css/bootstrap.min.css";

import './style/desdeo_template.scss'

import { Container } from "react-bootstrap";

interface DataModal{
  showModal: boolean;
  onClose: any;
}

function App() {
  const [isLoggedIn, SetIsLoggedIn] = useState<boolean>(false);
  const [loggedAs, SetLoggedAs] = useState<string>("");
  const [methodCreated, SetMethodCreated] = useState<boolean>(false);
  const [activeProblemId, SetActiveProblemId] = useState<number | null>(null);
  const [tokens, SetTokens] = useState<Tokens>({ access: "", refresh: "" });
  const [chosenMethod, SetChosenMethod] = useState("");
  const [loginShow, setLoginShow] = React.useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const API_URL: string = "http://127.0.0.1:5000";

  /*
  const MethodSwitch = (methodName: string) => {
    switch (methodName) {
      case "reference_point_method": {
        return ReferencePointMethod;
      }
      case "synchronous_nimbus": {
        return ReferencePointMethod;
      }
      default: {
        throw Error(
          `Selected method with name ${methodName} is not supported.`
        );
      }
    }
  };
  */

  return (
    <div className="App">
      <Container fluid style={{padding:"0px"}}>
      <Router>
        
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/login" exact>

            <Login
              apiUrl={API_URL}
              setIsLoggedIn={SetIsLoggedIn}
              setLoggedAs={SetLoggedAs}
              setTokens={SetTokens}
              />
          </Route>
          <Route path="/logout" exact>
            <Logout
              apiUrl={API_URL}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={SetIsLoggedIn}
              setLoggedAs={SetLoggedAs}
              tokens={tokens}
              setTokens={SetTokens}
            />
          </Route>
          <Route path="/register" exact>
            <Register
              apiUrl={API_URL}
            />
          </Route>
         
            <Route path="/main" exact>
            <PrivateLayout title="Welcome">
            <LandingPage />
            </PrivateLayout>
          </Route>
          
          <Route path="/problem/create" exact>
          <PrivateLayout title="Optimization problems">
            <ProblemDefinition
              apiUrl={API_URL}
              isLoggedIn={isLoggedIn}
              loggedAs={loggedAs}
              tokens={tokens}
            />
            </PrivateLayout>
          </Route>
          <Route path="/problem/explore" exact>
            <PrivateLayout title="Optimization problems">
            <ProblemExplore
              apiUrl={API_URL}
              isLoggedIn={isLoggedIn}
              loggedAs={loggedAs}
              tokens={tokens}
              setCurrentPage={setCurrentPage}
            />
            </PrivateLayout>
          </Route>
          <Route path="/method/create" exact>
          <PrivateLayout title="Start a new solution process">
            <MethodCreate
              apiUrl={API_URL}
              isLoggedIn={isLoggedIn}
              loggedAs={loggedAs}
              tokens={tokens}
              setMethodCreated={SetMethodCreated}
              setChosenMethod={SetChosenMethod}
              setActiveProblemId={SetActiveProblemId}
              setCurrentPage={setCurrentPage}
            />
            </PrivateLayout>
          </Route>
          <Route path="/method/optimize" exact>
            {chosenMethod === "reference_point_method" && (
              <PrivateLayout title="Reference point method">
              <ReferencePointMethod
                apiUrl={API_URL}
                isLoggedIn={isLoggedIn}
                loggedAs={loggedAs}
                tokens={tokens}
                methodCreated={methodCreated}
                activeProblemId={activeProblemId}
              />
              </PrivateLayout>
            )}
            {chosenMethod === "synchronous_nimbus" && (
              <PrivateLayout title="Synchronous NIMBUS">
              <NimbusMethod
                apiUrl={API_URL}
                isLoggedIn={isLoggedIn}
                loggedAs={loggedAs}
                tokens={tokens}
                methodCreated={methodCreated}
                activeProblemId={activeProblemId}
              />
              </PrivateLayout>
            )}
            {chosenMethod === "nautilus_navigator" && (
              <PrivateLayout title="NAUTILUS navigator">
              <NautilusNavigatorMethod
                apiUrl={API_URL}
                isLoggedIn={isLoggedIn}
                loggedAs={loggedAs}
                tokens={tokens}
                methodCreated={methodCreated}
                activeProblemId={activeProblemId}
              />
              </PrivateLayout>
            )}
          </Route>
          <Route path="/questionnaire" exact>
            <PrivateLayout title="Questionnaire">
            <Questionnaire
              apiUrl={API_URL}
              isLoggedIn={isLoggedIn}
              loggedAs={loggedAs}
              tokens={tokens}
            />
            </PrivateLayout>
          </Route>
  
          
        </Switch>
      </Router>
      </Container>
    </div>
  );
}

export default App;
