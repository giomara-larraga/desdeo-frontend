import { Container, Navbar, Nav, NavDropdown, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faRocket, faBrain, faSignOut, faCircleQuestion, faCircleUser, faClockRotateLeft, faDatabase, faLightbulb, faPenToSquare, faFlask } from '@fortawesome/free-solid-svg-icons';

import logo from '../images/desdeo_logo.png';

function NavigationBar({
  isLoggedIn,
  loggedAs,
  currentPage,
}: {
  isLoggedIn: boolean;
  loggedAs: string;
  currentPage:string;
}) {
  return (
    <Container fluid style={{padding:"0px", margin:"0px"}}>
      <Row>
          <Col sm={'auto'} xs={12} md={'auto'}>
     <Navbar className='flex-sm-column flex-md-column d-flex bg-dark align-items-center h-100 shadow'>
            <Navbar.Brand href="#home" className='nav-brand'>
              <img
                src={logo}
                width="30"
                height="30"
                alt="DESDEO"
              />
              <h6 className=''>DESDEO</h6>
            </Navbar.Brand>
            <Nav variant="pills" className='nav-item d-flex flex-sm-column flex-md-column bg-dark align-items-center'>
              <Nav.Item>
                <Nav.Link as={Link} to="/solve" eventKey="1">
                  <FontAwesomeIcon icon={faRocket} size="lg"/> 
                  <span>Solve</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/problem/explore" eventKey="2">
                  <FontAwesomeIcon icon={faBrain} size="lg"/> 
                  <span>Problems</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/problem/create" eventKey="3">
                  <FontAwesomeIcon icon={faClockRotateLeft} size="lg"/> 
                  <span>History</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/method/optimize/nautilus_navigator" eventKey="4">
                  <FontAwesomeIcon icon={faCircleQuestion} size="lg"/> 
                  <span>FAQ</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="5">
                  <FontAwesomeIcon icon={faSignOut} size="lg"/> 
                  <span>Logout</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            </Navbar>
            </Col>
            </Row>
    </Container>
  );
}

export default NavigationBar;
