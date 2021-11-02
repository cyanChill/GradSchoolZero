import { useContext, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import { Redirect } from "react-router";

import { Button, Form, Card, Row, Col, Container } from "react-bootstrap";

const Login = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("@gradschoolzero.edu");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(!isLoggedIn);
    }, 500);
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Card style={{ maxWidth: "50rem" }} className="mx-auto mt-5">
        <Card.Body>
          <h1 className="text-center">Login</h1>

          <Form onSubmit={handleLogin}>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
              <Form.Label column sm="auto">
                Email
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
              <Form.Label column sm="auto">
                Password
              </Form.Label>
              <Col>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Incorrect password</Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Row>
              <Col>
                <Button
                  style={{ width: "100%" }}
                  variant="primary"
                  type="submit"
                  disabled={loading ? true : false}
                >
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
