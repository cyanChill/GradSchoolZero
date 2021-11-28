import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";
import CenterSpinner from "../../UI/CenterSpinner";
import useCourseFetch from "../../../hooks/useCourseFetch";

const AllCourses = () => {
  const { getBasicCourse } = useCourseFetch();
  const [groupedCourseList, setGroupedBasicCourseList] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const courses = await getBasicCourse();

      const groupCourse = {};
      courses.forEach((course) => {
        if (!groupCourse[course.department]) {
          groupCourse[course.department] = [];
        }
        groupCourse[course.department].push(course);
      });
      setGroupedBasicCourseList(groupCourse);

      setLoading(false);
    };

    populateData();
  }, []);

  if (loading) {
    return (
      <Container>
        <CenterSpinner />
      </Container>
    );
  }

  const groupedCourseWidgets = (
    <>
      {Object.keys(groupedCourseList).map((department) => (
        <div key={department}>
          <h2>{department}</h2>
          {courseWidgets(groupedCourseList[department])}
        </div>
      ))}
    </>
  );

  return (
    <Container>
      <h1 className="my-3 text-center">All Courses</h1>
      {groupedCourseWidgets}
    </Container>
  );
};

const courseWidgets = (courseList) => {
  return (
    <Row>
      {courseList.map((course) => (
        <Col key={course.id} sm="12" md="6" lg="4" className="my-2">
          <LinkBoxWidget to={`/allcourses/${course.id}`} text={course.name} />
        </Col>
      ))}
    </Row>
  );
};

export default AllCourses;
