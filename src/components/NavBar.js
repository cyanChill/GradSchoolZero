import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Nav, Navbar, NavDropdown, Button, Container } from "react-bootstrap";
import { MenuIcon } from "@mui/icons-material";

/* For routing */
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <Navbar bg="primary" variant="dark" expand="md" fixed="top">
      <Container>
        {/* <Link to= "/profile" >
        <MenuIcon />
         </Link> */}

        <Navbar.Brand as={Link} to="/">
          GradSchoolZero
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" className="m-1">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/classes" className="m-1">
              Classes
            </Nav.Link>

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

        <Button variant="warning" as={Link} to="/" className="m-1">
          Apply
        </Button>
      </>
    );
  } else {
    /* Displayed for all logged-in users */
    return (
      <>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown" className="m-1">
          <NavDropdown.Item as={Link} to="/profile">
            Profile
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/">
            Login-Only Item 2
          </NavDropdown.Item>
        </NavDropdown>

        <Button variant="danger" as={Link} to="/logout" className="m-1">
          Log Out
        </Button>
      </>
    );
  }
};

export default NavBar;
