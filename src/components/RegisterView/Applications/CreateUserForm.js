import { useState, useEffect, useContext } from "react";
import { generate } from "generate-password";
import { v4 as uuidv4 } from "uuid";
import { Button, Form, Card, Container, Alert } from "react-bootstrap";
import FormAlerts from "../../UI/FormAlerts";
import { GlobalContext } from "../../../GlobalContext";
import BackButton from "../../UI/BackButton";

const CreateUserForm = ({ location }) => {
  const [inputInfo, setInputInfo] = useState({
    applic: undefined,
    id: uuidv4(),
    name: "",
    email: "",
    type: "",
    justification: "",
    reqJust: false,
  });

  const { userHook, applicationsHook } = useContext(GlobalContext);
  const { removeApplication } = applicationsHook;
  const { checkUserEmailIsUsed, createUser } = userHook;

  const [userInfo, setUserInfo] = useState({
    email: "@gradschoolzero.edu",
    password: generate({ length: 10, numbers: true, strict: true }),
    type: inputInfo.type || "",
  });

  /* Attempt to load information passed via history */
  useEffect(() => {
    if (location.state) {
      const { application: applic, justification, reqJust } = location.state;

      const { id, name, email, type } = applic;

      if (location.state) {
        setInputInfo({ applic, id, name, email, type, justification, reqJust });
        setUserInfo((prev) => ({
          ...prev,
          email: `${name.replace(/\s/g, "").toLowerCase()}@gradschoolzero.edu`,
          type,
        }));
      }
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const usedEmail = await checkUserEmailIsUsed(userInfo.email);

    // Check if email used for a different student
    if (usedEmail) {
      setError("This email used has been already used.");
      setLoading(false);
      return;
    }

    // Creating User:
    const formattedEmail = userInfo.email.toLowerCase();
    const creationStatus = await createUser({
      id: inputInfo.id,
      name: inputInfo.name,
      email: formattedEmail,
      password: userInfo.password,
      type: userInfo.type,
    });

    if (!creationStatus) {
      setError("Failed to create user account.");
    } else if (inputInfo.applic) {
      await removeApplication(inputInfo.id);
    }

    setLoading(false);
    setSuccess(creationStatus);
  };

  if (success) {
    return (
      <SuccessfulCreationAlert
        name={inputInfo.name}
        email={inputInfo.email}
        userInfo={userInfo}
        justification={inputInfo.justification}
        reqJust={inputInfo.reqJust}
      />
    );
  }

  return (
    <Container>
      <BackButton />
      <Card style={{ maxWidth: "50rem" }} className="mx-auto mt-3">
        <Card.Body>
          <h1 className="text-center">Create An Account For a New User</h1>

          {error && <FormAlerts errors={error} />}

          <Form onSubmit={handleCreate} className="mt-3">
            <Form.Group className="mb-3">
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

            <Form.Group className="mb-3">
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

            <Form.Group className="mb-3">
              <Form.Label>User Type</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Student"
                  name="type"
                  type="radio"
                  id="student-radio"
                  checked={userInfo.type === "student"}
                  value="student"
                  onChange={handleInputChange}
                  required
                />
                <Form.Check
                  inline
                  label="Instructor"
                  name="type"
                  type="radio"
                  id="instructor-radio"
                  checked={userInfo.type === "instructor"}
                  value="instructor"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Form.Group>

            <Button
              style={{ width: "100%" }}
              variant="primary"
              type="submit"
              disabled={loading}
            >
              Create User
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

const SuccessfulCreationAlert = ({
  name,
  email,
  userInfo,
  justification,
  reqJust,
}) => {
  return (
    <Container>
      <Alert variant="success" className="mx-auto mt-5">
        <Alert.Heading>Success!</Alert.Heading>
        <p>
          Successfully created an account for{" "}
          <span className="fw-bold font-monospace text-muted">{name}</span>
          . Please send the email template below to the following email:
          <br />
          <span className="fw-bold text-decoration-underline font-monospace text-muted">
            {email}
          </span>
        </p>
        <hr />
        <p className="mb-0">
          Hello {name},
          <br />
          <br />
          {userInfo.type === "student" && reqJust
            ? `Although your GPA didn't meet our standards, you've have been accepted into our graduate program on the reason that: ${justification}`
            : `You have been accepted into our graduate program as a ${
                userInfo.type
              } ${justification && `for the reason of: ${justification}`}`}
          <br />
          Here are the following credentials needed to log in and{" "}
          <span className="fw-bold">
            please make sure, once you log in, to change your password
          </span>
          :
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

      <BackButton to="/applications" btnLabel="Back to Application Page" />
    </Container>
  );
};

export default CreateUserForm;
