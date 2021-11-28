import { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LinkBoxWidget from "../UI/LinkBoxWidget/LinkBoxWidget";
import CenterSpinner from "../UI/CenterSpinner";
import { GlobalContext } from "../../GlobalContext";

const Students = () => {
  const { userHook } = useContext(GlobalContext);
  const { getAllStudents } = userHook;
  const [studList, setStudList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const studs = await getAllStudents();
      setStudList(studs);
      setLoading(false);
    };

    populateData();
  }, []);

  const studWidgets = studList.map((stud) => (
    <Col key={stud.id} sm="12" md="6" lg="4" className="my-2">
      <LinkBoxWidget to={`/profile/${stud.id}`} text={stud.name} />
    </Col>
  ));

  return (
    <Container>
      <h1 className="my-3 text-center">Students</h1>
      {loading && <CenterSpinner />}
      {!loading && <Row>{studWidgets}</Row>}
    </Container>
  );
};

export default Students;
