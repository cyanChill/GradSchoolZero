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
  const [disable, setDisable] = useState(false);

  const { termHook } = useContext(GlobalContext);
  const {
    loading,
    termInfo,
    getPhaseInfo,
    getNextPhaseInfo,
    nextPhase,
    endSpecialRegistration,
  } = termHook;

  const currTermInfo = getPhaseInfo(termInfo.phase);
  const nextTerm = getNextPhaseInfo();
  const nextTermInfo = getPhaseInfo(nextTerm.phase);

  const handleContinue = async () => {
    setDisable(true);
    const res = await nextPhase();
    setAlertInfo(res);
    setDisable(false);
    handleClose();
  };

  const handleEndSpecReg = async () => {
    await endSpecialRegistration();
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

      {!loading && termInfo.specReg && (
        <SpecRegAlert handleEnd={handleEndSpecReg} />
      )}
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
          <Button variant="danger" onClick={handleContinue} disabled={disable}>
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

const SpecRegAlert = ({ handleEnd }) => {
  return (
    <Alert variant="warning">
      <Alert.Heading>Special Registration Phase Is Ongoing</Alert.Heading>
      <p>
        The Special Registration Phase allows students of cancelled courses the
        chance to enroll into a course.
      </p>
      <p>Clicking the below button will end the Special Registration Phase.</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={handleEnd} variant="outline-danger">
          End Special Registration Phase
        </Button>
      </div>
    </Alert>
  );
};

export default SemesterManagement;
