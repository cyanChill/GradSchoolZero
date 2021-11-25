import { Row, Col, Button } from "react-bootstrap";
import { BiCheck, BiX } from "react-icons/bi";

import classes from "./AcceptRejectWidget.module.css";

const AcceptRejectWidget = ({ leftCol, handleAccept, handleReject }) => {
  return (
    <div className={classes.widget}>
      <Row className="d-flex align-items-center">
        <Col>{leftCol}</Col>
        <Col sm="auto" className="text-center">
          <Button variant="success" className="mx-1" onClick={handleAccept}>
            <BiCheck />
          </Button>
          <Button variant="danger" className="mx-1" onClick={handleReject}>
            <BiX />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AcceptRejectWidget;
