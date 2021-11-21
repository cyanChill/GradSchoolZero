import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import classes from "./RegistrarManagementPage.module.css";
import widgetLists from "./widgetLists";

const RegistrarMangementPage = () => {
  const widgets = widgetLists.map((widget, idx) => (
    <Widget key={idx} {...widget} />
  ));

  const getWidgetRows = (widgets) => {
    const rows = [];
    for (let i = 0; i < widgetLists.length; i += 2) {
      rows.push(
        <Row key={uuidv4()}>
          <Col md="6" className="my-2">
            {widgets[i]}
          </Col>
          <Col md="6" className="my-2">
            {widgets[i + 1]}
          </Col>
        </Row>
      );
    }

    return rows;
  };

  return (
    <Container>
      <h1 className="my-3 text-center">Management</h1>
      {getWidgetRows(widgets)}
    </Container>
  );
};

const Widget = ({ icon, label, linkTo }) => {
  return (
    <Card as={Link} to={linkTo} className={classes.widget}>
      <Card.Body>
        <Row>
          <Col xs="auto" className="d-flex align-items-center">
            {icon}
          </Col>
          <Col className="d-flex align-items-center">{label}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RegistrarMangementPage;
