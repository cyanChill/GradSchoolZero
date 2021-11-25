import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../../GlobalContext";

import { Container, Row, Col } from "react-bootstrap";
import useCourseFetch from "../../../hooks/useCourseFetch";
import CenterSpinner from "../../UI/CenterSpinner";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";

const Courses = () => {
  const { termHook } = useContext(GlobalContext);
  const { termInfo } = termHook;
  const { getCourseList, groupClassByMajor } = useCourseFetch();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const populateCourseList = async () => {
      setLoading(true);
      const data = await getCourseList(termInfo);
      const courseMap = await groupClassByMajor(data);
      setCourseList(courseMap);
      setLoading(false);
    };

    populateCourseList();
  }, []);

  const coursesWidgets = Object.keys(courseList).map((category) => (
    <div key={category}>
      <h2 className="my-2">{category}</h2>
      <Row>
        {courseList[category].map((course) => (
          <Col key={course.id} sm="6" className="my-2">
            <LinkBoxWidget
              to={`/courses/${course.id}`}
              text={`[${course.course.code}] ${course.course.name}`}
              className="my-0"
            />
          </Col>
        ))}
      </Row>
    </div>
  ));

  return (
    <Container>
      <h1 className="my-3 text-center">
        {`${termInfo.semester} ${termInfo.year}`} Courses:
      </h1>
      {loading && <CenterSpinner />}
      {!loading && coursesWidgets}
    </Container>
  );
};

export default Courses;
