import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LinkBoxWidget from "../UI/LinkBoxWidget/LinkBoxWidget";
import { GlobalContext } from "../../GlobalContext";

const Instructors = () => {
  const { instructorHook } = useContext(GlobalContext);
  const { instructorList } = instructorHook;

  const instWidgets = instructorList.map((inst) => (
    <Col key={inst.id} sm="12" md="6" lg="4" className="my-2">
      <LinkBoxWidget to={`/profile/${inst.id}`} text={inst.name} />
    </Col>
  ));

  return (
    <Container>
      <h1 className="my-3 text-center">Instructors</h1>
      <Row>{instWidgets}</Row>
    </Container>
  );
};

export default Instructors;
