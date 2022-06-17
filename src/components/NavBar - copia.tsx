import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

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
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid="xl">
          <Navbar.Brand as={Link} to="/">
            <img
              alt=""
              src="desdeo_logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            DESDEO
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="p-0 justify-content-end">
              {!isLoggedIn && (
                <>
                  <Nav.Item>
                    <Link to="/login" className="nav-link"> Login </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/register" className="nav-link"> Register </Link>
                  </Nav.Item>
                </>
              )}
              {isLoggedIn && (
                <>
                  <Nav.Item>
                    <Link to="/main" className="nav-link"> Home </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/problem/explore" className="nav-link"> Problems </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/method/create" className="nav-link"> Solve </Link>
                  </Nav.Item>
                  <NavDropdown title= {`Logged in as: ${loggedAs}`} id="basic-nav-dropdown">
                    <NavDropdown.Item>
                    <Link to="/logout" className="text-decoration-none">
                    Logout
                    </Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>
  );
}

export default NavigationBar;
