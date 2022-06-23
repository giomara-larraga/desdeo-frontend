
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
    <div className="main">
    <Navbar className="d-flex flex-column flex-shrink-0 bg-dark" style={{width: "4.5rem", height: "100vh"}}>
      <Navbar.Brand href="#home" className='nav-brand'as={Link} to="/main">
        <img
          src={logo}
          width="30"
          height="30"
          alt="DESDEO"
        />
        <h6 className=''>DESDEO</h6>
      </Navbar.Brand>
      <Nav variant="pills" className='nav nav-pills nav-flush flex-column mb-auto text-center'>
        <Nav.Item>
            <Nav.Link as={Link} to="/method/create" eventKey="1" className="nav-link py-3 " aria-current="page" title="Solve" data-bs-toggle="tooltip" data-bs-placement="right">
              <FontAwesomeIcon icon={faRocket} size="lg"/> 
              <span>Solve</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/problem/explore" eventKey="2" className="nav-link py-3 " aria-current="page" title="History" data-bs-toggle="tooltip" data-bs-placement="right">
              <FontAwesomeIcon icon={faClockRotateLeft} size="lg"/> 
              <span>History</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/help" eventKey="4" className="nav-link py-3 " aria-current="page" title="Help" data-bs-toggle="tooltip" data-bs-placement="right">
              <FontAwesomeIcon icon={faCircleQuestion} size="lg"/> 
              <span>Help</span>
            </Nav.Link>
          </Nav.Item>
    </Nav>
    <Nav>
    <Nav.Item>
            <Nav.Link  as={Link} to="/logout" eventKey="5" className="nav-link py-3 " aria-current="page" title="Logout" data-bs-toggle="tooltip" data-bs-placement="right">
              <FontAwesomeIcon icon={faSignOut} size="lg"/> 
              <span>Logout</span>
            </Nav.Link>
          </Nav.Item>
    </Nav>


  </Navbar>
 <div style={{width:"100%", overflowY:"auto"}}>
 <Navbar className="topbar" expand="lg">
    <Nav>
      <Nav.Item>
        {title}
      </Nav.Item>
    </Nav>
  </Navbar> 
  { children }
 </div>
      
{/*         <Row className="g-0">
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
          <Col sm={12}> */}
         
{/*           </Col>
        
        </Row> */}
      
      </div>
      
  )
}
