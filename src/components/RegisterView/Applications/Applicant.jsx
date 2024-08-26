import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router";
import { Redirect, Link } from "react-router-dom";
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Container,
  Alert,
} from "react-bootstrap";
import { GlobalContext } from "../../../GlobalContext";
import BackButton from "../../UI/BackButton";
import LabelDescripField from "../../UI/LabelDescripField";
import HorizFormInputField from "../../UI/HorizFormInputField";
import CenterSpinner from "../../UI/CenterSpinner";

const Applicant = () => {
  const { id } = useParams();
  const justificationField = useRef();
  const { applicationsHook } = useContext(GlobalContext);
  const { loading, getApplicationInfo, removeApplication } = applicationsHook;
  const [isValid, setisValid] = useState(null);
  const [application, setApplication] = useState({
    id: "",
    type: "",
    name: "",
    email: "",
    gpa: "",
    description: "",
  });
  const [justification, setJustification] = useState("");
  const [reqJust, setReqJust] = useState({ accept: false, reject: false });
  const [successType, setSuccessType] = useState("");

  const acceptHandler = async (e) => {
    e.preventDefault();

    if (reqJust.accept) {
      // Require justification on accept
      justificationField.current.required = true;
    } else {
      justificationField.current.required = false;
    }
    setisValid(true);

    if (reqJust.accept && !justification.trim()) {
      setisValid(false);
      return;
    }

    setSuccessType("accept");
  };

  const rejectHandler = async (e) => {
    e.preventDefault();

    if (reqJust.reject) {
      // Require justification on reject
      justificationField.current.required = true;
    } else {
      justificationField.current.required = false;
    }
    setisValid(true);

    if (reqJust.reject && !justification.trim()) {
      setisValid(false);
      return;
    }

    // We can now reject & remove the application from the database
    removeApplication(id);
    setSuccessType("reject");
  };

  useEffect(() => {
    const getAppInfo = async () => {
      const data = await getApplicationInfo(id);
      setApplication(data);

      if (data.type === "student" && +data.gpa > 3) {
        setReqJust((prev) => ({ ...prev, reject: true }));
      } else if (data.type === "student" && +data.gpa <= 3) {
        setReqJust((prev) => ({ ...prev, accept: true }));
      }
    };

    getAppInfo();
  }, []);

  if (loading && !successType) {
    return <CenterSpinner />;
  }

  if (!loading && !application.name) {
    return (
      <Container>
        <Alert variant="danger" className="mt-5">
          <span className="fw-bold">Error:</span> The application doesn't exist.{" "}
          <Alert.Link as={Link} to="/applications">
            Return to the Applications Page.
          </Alert.Link>
        </Alert>
      </Container>
    );
  }

  if (successType === "accept") {
    return (
      <Redirect
        to={{
          pathname: "/create/user",
          state: {
            application,
            justification,
            reqJust: reqJust.accept,
          },
        }}
      />
    );
  }

  if (successType === "reject") {
    return (
      <ApplicationRejectionAlert
        name={application.name}
        email={application.email}
        justification={justification}
        required={reqJust.reject}
      />
    );
  }

  return (
    <Container>
      <BackButton
        to="/applications"
        className="mt-3"
        btnLabel="Back to Applications"
      />
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>{application.name}</Card.Title>
          <hr />
          <LabelDescripField
            label="Application Type:"
            description={application.type}
          />

          {application.type === "student" && (
            <LabelDescripField label="GPA:" description={application.gpa} />
          )}
          {application.type === "instructor" && (
            <LabelDescripField
              label="Description:"
              description={application.description}
            />
          )}
          <Form noValidate>
            <HorizFormInputField
              label="Justification"
              feedback="Justification is required."
              inputField={{
                type: "text",
                placeholder: "Enter Justification",
                value: justification,
                onChange: (e) => setJustification(e.target.value),
                ref: justificationField,
                className: isValid
                  ? "is-valid"
                  : isValid === false
                  ? "is-invalid"
                  : "",
              }}
            />
            <Row>
              <Col>
                <Button
                  variant="success"
                  style={{ width: "100%" }}
                  onClick={acceptHandler}
                >
                  Accept
                </Button>
              </Col>
              <Col>
                <Button
                  variant="danger"
                  style={{ width: "100%" }}
                  onClick={rejectHandler}
                >
                  Reject
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

const ApplicationRejectionAlert = ({
  name,
  email,
  justification,
  required,
}) => {
  return (
    <Container>
      <Alert variant="success" className="mt-5">
        <Alert.Heading>Application has been Rejected</Alert.Heading>
        <p>
          <span className="fw-bold font-monospace text-muted">{name}</span>'s
          application has been rejected. It's{" "}
          {required ? (
            <span className="fw-bold">required</span>
          ) : (
            "not required"
          )}{" "}
          that you send this email template to the following email:{" "}
          <span className="fw-bold text-decoration-underline font-monospace text-muted">
            {email}
          </span>
        </p>
        <hr />
        <p className="mb-0">
          Hello {name},
          <br />
          <br />
          Unfortunately, your application has been rejected. We hope the best of
          luck to your future endeavors.
          <br />
          <br />
          {justification && (
            <>
              <span className="fw-bold">
                The following justification has been given for your rejection:{" "}
              </span>
              <span className="font-monospace">{justification}</span>
              <br />
              <br />
            </>
          )}
          Regards,
          <br />
          <span className="fw-bold">Registrar @ GradSchoolZero</span>
        </p>
      </Alert>

      <BackButton to="/applications" btnLabel="Back to Application Page" />
    </Container>
  );
};

export default Applicant;
