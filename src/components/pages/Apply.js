import { useState } from "react";
import { Redirect } from "react-router-dom";

import { Button, Form, Row, Col, Container } from "react-bootstrap";

const Apply = () => {
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    GPA: "",
    interests: "",
  });

  const [formType, setFormType] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleApplication = (e) => {
    e.preventDefault();
    setLoading(true);

    /* Perform Form Checks */
    const success = true; // Simulate successful application

    if (success) {
      setTimeout(() => {
        setLoading(false);
        /* Submit Form to server */

        setSuccess(true);
      }, 500);
    } else {
      /* Indicate Form Erros */
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: {
            alert: { message: "Your application has been submitted.", type: "success" },
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

      {!formType ? null : (
        <Form onSubmit={handleApplication} className="mt-5">
          {/* Name Field */}
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
            <Form.Label column sm="auto">
              Name
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </Col>
          </Form.Group>

          {/* Email Field -- verification if an existing application exists for that email already? */}
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm="auto">
              Email
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* GPA Field [Student Only] */}
          {formType !== "student" ? null : (
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalGPA">
              <Form.Label column sm="auto">
                GPA
              </Form.Label>
              <Col>
                <Form.Control
                  type="number"
                  min="0"
                  max="4"
                  step="0.001"
                  name="GPA"
                  value={formState.GPA}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">Please enter your GPA</Form.Control.Feedback>
              </Col>
            </Form.Group>
          )}

          {/* Skills and Fields of Interest [Instructor Only] */}
          {formType !== "instructor" ? null : (
            <Form.Group className="mb-3" controlId="formHorizontalPassword">
              <Form.Label column sm="auto">
                About Yourself
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="interests"
                value={formState.interests}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter something about yourself
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Button
            style={{ width: "100%" }}
            variant="primary"
            type="submit"
            disabled={loading ? true : false}
          >
            Submit Application
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default Apply;
