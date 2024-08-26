import { Form, Row, Col } from "react-bootstrap";

const HorizFormInputField = (props) => {
  const classes = `my-3 ${props.className}`;

  return (
    <Form.Group as={Row} className={classes}>
      <Form.Label column md="auto">
        {props.label}
      </Form.Label>
      <Col>
        <Form.Control {...props.inputField} />
        <Form.Control.Feedback type="invalid">
          {props.feedback}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

export default HorizFormInputField;
