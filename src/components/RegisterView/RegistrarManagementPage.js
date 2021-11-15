import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaClipboardList, FaUserPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const widgetLists = [
  {
    icon: <FaClipboardList />,
    label: "View Applications",
    linkTo: "/applications",
  },
  {
    icon: <FaUserPlus />,
    label: "Create User",
    linkTo: "/create/user",
  },
];

const RegistrarMangementPage = () => {
  const widgets = widgetLists.map((widget, idx) => (
    <Widget key={idx} {...widget} />
  ));

  const getWidgetRows = (widgets) => {
    const rows = [];
    for (let i = 0; i < widgetLists.length; i += 2) {
      rows.push(
        <Row key={uuidv4()}>
          <Col>{widgets[i]}</Col>
          <Col>{widgets[i + 1]}</Col>
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
    <Card as={Link} to={linkTo}>
      <Card.Body>
        <Row>
          <Col xs="auto">{icon}</Col>
          <Col>{label}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RegistrarMangementPage;
