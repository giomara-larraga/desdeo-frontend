
import { Container, Navbar, Nav, NavDropdown, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faRocket, faBrain, faSignOut, faCircleQuestion, faCircleUser, faClockRotateLeft, faDatabase, faLightbulb, faPenToSquare, faFlask } from '@fortawesome/free-solid-svg-icons';

import logo from '../images/desdeo_logo.png';

interface LayoutProps {
  title: string,
  children: React.ReactNode;
}

export default function PrivateLayout({title, children}:LayoutProps) {
  return (
    <Container fluid={true} className='bg-light p-0'>
    
        <Navbar className='sidebar flex-sm-column flex-md-column d-flex bg-dark align-items-center shadow'>
        <Navbar.Brand href="#home" className='nav-brand'as={Link} to="/main">
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
            <Nav.Link as={Link} to="/method/create" eventKey="1">
              <FontAwesomeIcon icon={faRocket} size="lg"/> 
              <span>Solve</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/problem/explore" eventKey="2">
              <FontAwesomeIcon icon={faClockRotateLeft} size="lg"/> 
              <span>History</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/help" eventKey="4">
              <FontAwesomeIcon icon={faCircleQuestion} size="lg"/> 
              <span>Help</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link  as={Link} to="/logout" eventKey="5">
              <FontAwesomeIcon icon={faSignOut} size="lg"/> 
              <span>Logout</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        </Navbar>
     
      <Container fluid style={{maxWidth:"100%", height: "auto", padding:"0px", margin:"0px"}}>
        <Row className="g-0">
          <Col sm={12}>
          <Navbar className="topbar" expand="lg">
          <Nav>
            <Nav.Item>
              {title}
            </Nav.Item>
          </Nav>
        </Navbar>
          </Col>

        </Row>
        <Row className="g-0">
          <Col sm={12}>
          { children }
          </Col>
        
        </Row>
      
      </Container>
  </Container>
  )
}
