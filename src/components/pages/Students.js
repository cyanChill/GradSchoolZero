import { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import LinkBoxWidget from "../UI/LinkBoxWidget/LinkBoxWidget";
import CenterSpinner from "../UI/CenterSpinner";
import DualColWidget from "../UI/DualColWidget/DualColWidget";
import { GlobalContext } from "../../GlobalContext";

const Students = () => {
  const { userHook } = useContext(GlobalContext);
  const { getAllStudents, getProgramStudStats } = userHook;
  const [studList, setStudList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topStuds, setTopStuds] = useState([]);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const studs = await getAllStudents();
      setStudList(studs);

      const studStats = await getProgramStudStats();
      const filteredStud = studStats.top3.filter((stud) => stud.GPA);
      setTopStuds(filteredStud);

      setLoading(false);
    };

    populateData();
  }, []);

  if (loading) return <CenterSpinner />;

  const topStudList = topStuds.map((stud) => {
    const leftCol = (
      <Link to={`/profile/${stud.id}`} style={{ textDecoration: "none" }}>
        {stud.name}
      </Link>
    );
    const rightCol = (
      <span className="text-muted text-monospace">{stud.GPA}</span>
    );

    return (
      <DualColWidget
        key={stud.id}
        leftCol={{ body: leftCol }}
        rightCol={{ body: rightCol, breakPoints: { xs: "auto" } }}
      />
    );
  });

  const hasTable = topStudList.length > 0;

  const studWidgets = studList.map((stud) => (
    <Col key={stud.id} sm="12" md="6" lg="4" className="my-2">
      <LinkBoxWidget to={`/profile/${stud.id}`} text={stud.name} />
    </Col>
  ));

  return (
    <Container>
      {topStudList.length > 0 && (
        <div className="my-3">
          <h2>Top Rated Students</h2>
          {topStudList}
        </div>
      )}
      {hasTable && <hr className="my-2" />}
      <h1 className="my-3 text-center">Students</h1>
      {!loading && <Row>{studWidgets}</Row>}
    </Container>
  );
};

export default Students;
