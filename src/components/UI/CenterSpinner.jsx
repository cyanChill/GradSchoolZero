import { Spinner } from "react-bootstrap";

const CenterSpinner = () => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Spinner animation="border" />
    </div>
  );
};

export default CenterSpinner;
