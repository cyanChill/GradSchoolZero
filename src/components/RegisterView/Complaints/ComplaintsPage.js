import { useContext } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import BackHeader from "../../UI/BackHeader";
import LabelDescripField from "../../UI/LabelDescripField";
import CenterSpinner from "../../UI/CenterSpinner";
import AcceptRejectWidget from "../../UI/AcceptRejectWidget/AcceptRejectWidget";
import { GlobalContext } from "../../../GlobalContext";

import classes from "./ComplaintsPage.module.css";

const ComplaintsPage = () => {
  const { complaintHook } = useContext(GlobalContext);
  const { complaintsList, resolveComplaint, loading, refreshComplaintsList } =
    complaintHook;

  const handleResult = async (complaintInfo, resultType) => {
    await resolveComplaint(complaintInfo, resultType);
  };

  const complaints = complaintsList.map((complaint) => (
    <ComplaintWidget
      key={complaint.id}
      complaint={complaint}
      handleResult={handleResult}
    />
  ));

  return (
    <Container>
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Complaints"
      />
      {complaints.length > 0 && complaints}

      <div className="d-flex justify-content-center flex-column">
        {loading && <CenterSpinner />}
        {!loading && complaints.length === 0 && <p>There are no complaints.</p>}
        <Button
          className="my-3"
          onClick={refreshComplaintsList}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
    </Container>
  );
};

const ComplaintWidget = ({ complaint, handleResult }) => {
  const {
    reporter,
    offender,
    reason,
    extra: { outcome },
  } = complaint;

  const leftCol = (
    <Col>
      <Row>
        <Col>
          <LabelDescripField
            label="Reporter: "
            description={
              <>
                <Link to={`/profile/${reporter.id}`} className={classes.link}>
                  {reporter.name}
                </Link>{" "}
                ({reporter.type})
              </>
            }
          />
        </Col>

        <Col>
          <LabelDescripField
            label="Offender: "
            description={
              <>
                <Link to={`/profile/${offender.id}`} className={classes.link}>
                  {offender.name}
                </Link>{" "}
                ({offender.type})
              </>
            }
          />
        </Col>
      </Row>

      <LabelDescripField label="Description: " description={reason} />

      {reporter.type === "instructor" && (
        <LabelDescripField label="Outcome: " description={outcome} />
      )}
    </Col>
  );

  return (
    <AcceptRejectWidget
      leftCol={leftCol}
      handleAccept={() => handleResult(complaint, "approve")}
      handleReject={() => handleResult(complaint, "reject")}
    />
  );
};

export default ComplaintsPage;
