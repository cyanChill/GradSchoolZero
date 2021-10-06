import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";

/* For routing */
import { Link } from "react-router-dom";

/* Reduce the amount of code sent to client */
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

const NavBar = () => {
  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <Navbar bg="primary" expand="md" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          GradSchoolZero
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/classes">
              Classes
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            {!isLoggedIn ? null : (
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/">
                  Login-Only Item 2
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
