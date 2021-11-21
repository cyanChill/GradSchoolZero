import { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { Button, Form, Container, Alert } from "react-bootstrap";
import { GlobalContext } from "../../GlobalContext";
import HorizFormInputField from "../UI/HorizFormInputField";

const ApplyPage = () => {
  const { applicationsHook } = useContext(GlobalContext);
  const { checkAppEmailIsUsed, addApplication } = applicationsHook;

  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    GPA: "",
    interests: "",
  });

  const [formType, setFormType] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    setLoading(true);

    const usedEmail = await checkAppEmailIsUsed(formState.email);

    // Check if email used in application has been already used
    if (usedEmail) {
      setError("The application email used has been already used.");
      setLoading(false);
      return;
    }

    // Submitting Application:
    const formattedEmail = formState.email.toLowerCase();

    let application = {
      id: uuidv4(),
      type: formType,
      name: formState.name,
      email: formattedEmail,
    };

    if (formType === "student") {
      application = { ...application, gpa: +formState.GPA };
    } else {
      application = { ...application, description: formState.interests };
    }

    const submissionStatus = await addApplication(application);
    if (!submissionStatus) {
      setError("Your application failed to submit.");
    }

    setLoading(false);
    setSuccess(submissionStatus);
  };

  if (success) {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: {
            alert: {
              message: "Your application has been submitted.",
              type: "success",
            },
          },
        }}
      />
    );
  }

  return (
    <Container>
      {/* Form Selection */}
      <div className="d-flex flex-row justify-content-evenly align-items-center mt-5 gap-3">
        <Button
          onClick={() => setFormType("student")}
          disabled={formType === "student" ? true : false}
        >
          Apply As Student
        </Button>
        <Button
          onClick={() => setFormType("instructor")}
          disabled={formType === "instructor" ? true : false}
        >
          Apply As Instructor
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}

      {formType && (
        <Form onSubmit={handleApplication} className="mt-4">
          {/* Name Field */}
          <HorizFormInputField
            label="Name"
            inputField={{
              type: "text",
              placeholder: "Enter name",
              name: "name",
              value: formState.name,
              onChange: handleInputChange,
              required: true,
            }}
          />

          {/* Email Field */}
          <HorizFormInputField
            label="Email"
            inputField={{
              type: "email",
              placeholder: "Enter email",
              name: "email",
              value: formState.email,
              onChange: handleInputChange,
              required: true,
            }}
          />

          {/* GPA Field [Student Only] */}
          {formType === "student" && (
            <HorizFormInputField
              label="GPA"
              inputField={{
                type: "number",
                name: "GPA",
                value: formState.GPA,
                onChange: handleInputChange,
                required: true,
                min: 0,
                max: 4,
                step: 0.001,
              }}
            />
          )}

          {/* Skills and Fields of Interest [Instructor Only] */}
          {formType === "instructor" && (
            <Form.Group className="mb-3">
              <Form.Label column sm="auto">
                About Yourself
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="interests"
                value={formState.interests}
                onChange={handleInputChange}
                maxLength="1000"
                required
              />
            </Form.Group>
          )}

          <Button
            style={{ width: "100%" }}
            variant="primary"
            type="submit"
            disabled={loading}
          >
            Submit Application
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default ApplyPage;
