import { Alert } from "react-bootstrap";

const FormAlerts = ({ errors }) => {
  return (
    <Alert variant="danger">
      <ul className="mb-0">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </Alert>
  );
};

export default FormAlerts;
