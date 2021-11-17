import { useContext, useState } from "react";
import { Container, Card, Button, Modal, Alert } from "react-bootstrap";
import BackButton from "../../UI/BackButton";
import { GlobalContext } from "../../../GlobalContext";

const SemesterManagement = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [alertInfo, setAlertInfo] = useState(null);

  const { termInfo, getPhaseInfo, getNextTermInfo, nextPhase } =
    useContext(GlobalContext);

  const currTermInfo = getPhaseInfo(termInfo.phase);
  const nextTerm = getNextTermInfo();
  const nextTermInfo = getPhaseInfo(nextTerm.phase);

  const handleContinue = async () => {
    const res = await nextPhase();
    setAlertInfo(res);
    handleClose();
  };

  return (
    <Container>
      {alertInfo && (
        <Alert
          variant={alertInfo.status}
          onClose={() => setAlertInfo(null)}
          dismissible
          className="mt-3 mb-2"
        >
          {alertInfo.msg}
        </Alert>
      )}
      <BackButton to="/registrar" btnLabel="Back to Management Page" />
      <h1 className="my-3 text-center">Semester Management</h1>
      <h2>Current Phase Info:</h2>
      <PhaseWidget {...termInfo} phaseDescription={currTermInfo.description} />
      <hr />
      <h2>Next Phase Info:</h2>
      <PhaseWidget {...nextTerm} phaseDescription={nextTermInfo.description} />

      <div className="d-flex justify-content-end my-3">
        <Button variant="warning" className="my-3" onClick={handleShow}>
          Move to Next Phase?
        </Button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Move to Next Phase?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "red" }}>
          <span className="fw-bold">Warning:</span> The program will move onto
          it's next semester phase. This is irreversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleContinue}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const PhaseWidget = ({ phase, semester, year, phaseDescription }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {semester} {year} Semester
        </Card.Title>
        <Field label="Phase:" description={phase} />
        <Field label="Description:" description={phaseDescription} />
      </Card.Body>
    </Card>
  );
};

const Field = ({ label, description }) => {
  return (
    <div className="my-2">
      <span className="fw-bold">{label}</span>{" "}
      <span className="text-capitalize font-monospace text-muted">
        {description}
      </span>
    </div>
  );
};

export default SemesterManagement;
