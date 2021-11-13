import { Alert } from "react-bootstrap";

const FormAlerts = ({ errors }) => {
  const errArr = typeof errors === "string" ? [errors] : errors;

  return (
    <Alert variant="danger">
      <ul className="mb-0">
        {errArr.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </Alert>
  );
};

export default FormAlerts;
