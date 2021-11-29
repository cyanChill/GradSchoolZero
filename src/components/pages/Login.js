import { useContext, useState } from "react";
import { Redirect } from "react-router";
import { GlobalContext } from "../../GlobalContext";
import HorizFormInputField from "../UI/HorizFormInputField";
import "./Login.css";

import { Button, Form, Card, Container, Alert } from "react-bootstrap";

const Login = () => {
  const { userHook } = useContext(GlobalContext);
  const { login, isLoggedIn } = userHook;

  const [email, setEmail] = useState("@gradschoolzero.edu");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const didLogin = await login(email, password);

    if (!didLogin) {
      setError("Invalid Login Credentials");
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container className="LoginP">
      <Card  style={{ maxWidth: "50rem" }} className="mx-auto mt-5">
        <Card.Body>
          <h1 className="text-center">Login</h1>

          {error && (
            <Alert variant="danger" className="my-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <HorizFormInputField
              label="Email"
              inputField={{
                type: "text",
                placeholder: "Enter email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
              }}
            />

            <HorizFormInputField
              label="Password"
              inputField={{
                type: "password",
                placeholder: "Password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
              }}
            />

            <Button style={{ width: "100%" }} variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
