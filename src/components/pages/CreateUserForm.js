import { useState } from "react";
import { generate } from "generate-password";
import { Button, Form, Card, Container, Alert } from "react-bootstrap";

const CreateUser = ({ name, email, type }) => {
  const [userInfo, setUserInfo] = useState({
    email: name
      ? `${name.replace(/\s/g, "").toLowerCase()}@gradschoolzero.edu`
      : "@gradschoolzero.edu",
    password: generate({
      length: 10,
      numbers: true,
      strict: true,
    }),
    type: type || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    /* Make sure email doesn't exist in the database */

    setTimeout(() => {
      setLoading(false);
      /* Submit Form to server */

      setSuccess(true);
    }, 500);
  };

  /* 
    Instead of having a page soley for creating users, only have this appear once we accept an application and autofill the fields with information
  */

  if (success) {
    return (
      <Container>
        <Alert variant="success" className="mx-auto mt-5">
          <Alert.Heading>Success!</Alert.Heading>
          <p>
            Successfully created an account for{" "}
            <span className="fw-bold font-monospace text-muted">{name || "<user name>"}</span>
            . Please send the email template below to the following email:
            <br />
            <span className="fw-bold text-decoration-underline font-monospace text-muted">
              {email || "<user email>"}
            </span>
          </p>
          <hr />
          <p className="mb-0">
            Hello {name || "<user name>"},
            <br />
            <br />
            You have been accepted into our graduate program. Here are the following credentials
            needed to log in and please make sure, once you log in, to change your password.:
            <br />
            <br />
            <span className="fw-bold">Email: </span>
            <span className="font-monospace">{userInfo.email}</span>
            <br />
            <span className="fw-bold">Password: </span>
            <span className="font-monospace">{userInfo.password}</span>
            <br />
            <br />
            Regards,
            <br />
            <span className="fw-bold">Registrar @ GradSchoolZero</span>
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Card style={{ maxWidth: "50rem" }} className="mx-auto mt-5">
        <Card.Body>
          <h1 className="text-center">Create An Account For a New User</h1>

          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3" controlId="formHorizontalEmail">
              <Form.Label>User Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formHorizontalPassword">
              <Form.Label>User Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Password"
                name="password"
                value={userInfo.password}
                onChange={handleInputChange}
                required
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formHorizontalUserType">
              <Form.Label>User Type</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Student"
                  name="type"
                  type="radio"
                  id="student-radio"
                  value="student"
                  required
                />
                <Form.Check
                  inline
                  label="Instructor"
                  name="type"
                  type="radio"
                  id="instructor-radio"
                  value="instructor"
                  required
                />
              </div>
            </Form.Group>

            <Button
              style={{ width: "100%" }}
              variant="primary"
              type="submit"
              disabled={loading ? true : false}
            >
              Create User
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateUser;
