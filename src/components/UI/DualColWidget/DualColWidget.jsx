import { Row, Col } from "react-bootstrap";
import classes from "./DualColWidget.module.css";

const DualColWidget = ({ leftCol, rightCol }) => {
  const leftBreakPoints = leftCol.breakPoints;
  const rightBreakPoints = rightCol.breakPoints;

  return (
    <div className={classes.widget}>
      <Row className="d-flex align-items-center">
        <Col {...leftBreakPoints} className={leftCol.className}>
          {leftCol.body}
        </Col>
        <Col {...rightBreakPoints} className={rightCol.className}>
          {rightCol.body}
        </Col>
      </Row>
    </div>
  );
};

export default DualColWidget;
