import { useContext, useState } from "react";
import { Container, Form, Row, Col, Button, Alert } from "react-bootstrap";

import { GlobalContext } from "../../GlobalContext";

const isEmpty = (str) => str.trim() === "";

const defaultFormFields = {
  old: "",
  new: "",
  newConfirm: "",
};

const Settings = () => {
  const { userHook } = useContext(GlobalContext);
  const { changePassword } = userHook;

  const [passVals, setPassVals] = useState(defaultFormFields);
  const [alert, setAlert] = useState(null);

  const changeHandler = (e) => {
    setPassVals((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setAlert(null);
    if (
      isEmpty(passVals.old) ||
      isEmpty(passVals.new) ||
      isEmpty(passVals.newConfirm)
    ) {
      setAlert({ type: "danger", message: "Please fill out all the fields" });
      return;
    }

    if (passVals.new !== passVals.newConfirm) {
      setAlert({
        type: "danger",
        message: "Your new and confirmed passwords are not the same",
      });
      return;
    }

    const res = await changePassword(passVals.old, passVals.new);

    if (res.type === "success") {
      setPassVals(defaultFormFields);
    }

    setAlert(res);
  };

  return (
    <Container>
      <h1 className="my-3 text-center">Settings:</h1>
      <Form onSubmit={submitHandler}>
        <h5 className="text-decoration-underline">Change Password:</h5>
        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
        <HorizontalFormField
          type="text"
          label="Old Password"
          name="old"
          value={passVals.old}
          onChange={changeHandler}
          placeholder="Enter your old password here"
          required
        />
        <HorizontalFormField
          type="password"
          label="New Password"
          name="new"
          value={passVals.new}
          onChange={changeHandler}
          placeholder="Enter your new password here"
          required
        />
        <HorizontalFormField
          type="password"
          label="Confirm New Password"
          name="newConfirm"
          value={passVals.newConfirm}
          onChange={changeHandler}
          placeholder="Confirm your new password"
          required
        />
        <div className="d-flex justify-content-end">
          <Button variant="secondary" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Settings;

const HorizontalFormField = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  name,
  required,
}) => {
  return (
    <Form.Group as={Row} className="my-3">
      <Form.Label column md="auto">
        {label}
      </Form.Label>
      <Col>
        <Form.Control
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      </Col>
    </Form.Group>
  );
};
