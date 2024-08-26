import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Nav, Navbar, NavDropdown, Button, Container } from "react-bootstrap";
import logo from "../assets/brand_logo.png";

/* For routing */
import { Link } from "react-router-dom";

const NavBar = () => {
  const { userHook } = useContext(GlobalContext);
  const { isLoggedIn } = userHook;

  return (
    <Navbar bg="primary" variant="dark" expand="md" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            height="30"
            className="d-inline-block align-top"
            alt="GradSchoolZero Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" className="m-1">
              Home
            </Nav.Link>

            <NavDropdown title="Classes" className="m-1">
              <NavDropdown.Item as={Link} to="/allcourses">
                All Courses
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/courses">
                Semester Courses
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Users" className="m-1">
              <NavDropdown.Item as={Link} to="/students">
                Student
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/instructors">
                Instructor
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/about" className="m-1">
              About
            </Nav.Link>

            <UserInteract isLoggedIn={isLoggedIn} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const UserInteract = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    /* Displayed for Outside Users / Users not logged in */
    return (
      <>
        <Button variant="outline-light" as={Link} to="/login" className="m-1">
          Log In
        </Button>

        <Button variant="warning" as={Link} to="/apply" className="m-1">
          Apply
        </Button>
      </>
    );
  } else {
    /* Displayed for all logged-in users */
    return (
      <>
        <Nav.Link as={Link} to="/settings" className="m-1">
          Settings
        </Nav.Link>

        <Button variant="danger" as={Link} to="/logout" className="m-1">
          Log Out
        </Button>
      </>
    );
  }
};

export default NavBar;
