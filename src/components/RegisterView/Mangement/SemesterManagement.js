import { useContext, useState } from "react";
import { Container, Card, Button, Modal, Alert } from "react-bootstrap";
import BackHeader from "../../UI/BackHeader";
import LabelDescripField from "../../UI/LabelDescripField";
import { GlobalContext } from "../../../GlobalContext";
import CenterSpinner from "../../UI/CenterSpinner";

const SemesterManagement = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [alertInfo, setAlertInfo] = useState(null);

  const { termHook } = useContext(GlobalContext);
  const { loading, termInfo, getPhaseInfo, getNextTermInfo, nextPhase } =
    termHook;

  const currTermInfo = getPhaseInfo(termInfo.phase);
  const nextTerm = getNextTermInfo();
  const nextTermInfo = getPhaseInfo(nextTerm.phase);

  const handleContinue = async () => {
    const res = await nextPhase();
    setAlertInfo(res);
    handleClose();
  };

  let body = <CenterSpinner />;

  if (!loading) {
    body = (
      <>
        <h2>Current Phase Info:</h2>
        <PhaseWidget
          {...termInfo}
          phaseDescription={currTermInfo.description}
        />
        <hr />
        <h2>Next Phase Info:</h2>
        <PhaseWidget
          {...nextTerm}
          phaseDescription={nextTermInfo.description}
        />

        <div className="d-flex justify-content-end my-3">
          <Button variant="warning" className="my-3" onClick={handleShow}>
            Move to Next Phase?
          </Button>
        </div>
      </>
    );
  }

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
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Semester Management"
      />
      {body}

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
        <LabelDescripField label="Phase:" description={phase} />
        <LabelDescripField
          label="Description:"
          description={phaseDescription}
        />
      </Card.Body>
    </Card>
  );
};

export default SemesterManagement;
