import { useState, useEffect } from "react";
import { Container, Alert, Row, Col } from "react-bootstrap";
import { useParams } from "react-router";

import CenterSpinner from "../../UI/CenterSpinner";
import useCourseFetch from "../../../hooks/useCourseFetch";
import BackButton from "../../UI/BackButton";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";

const CourseHub = () => {
  const { id } = useParams();
  const { getBasicCourseById, getBasicCourseInstances } = useCourseFetch();
  const [groupBySemesterList, setGroupBySemesterList] = useState({});
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseRating, setCourseRating] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const courseTemplate = await getBasicCourseById(id);

      if (Object.keys(courseTemplate).length === 0) {
        setError(true);
        setLoading(false);
        return;
      }

      setCourseName(courseTemplate.name);
      setCourseRating(courseTemplate.rating);

      const courses = await getBasicCourseInstances(
        courseTemplate.name,
        courseTemplate.code
      );

      const groupSemester = {};

      courses.forEach((course) => {
        const currentSemester = `${course.term.semester} ${course.term.year}`;
        if (!groupSemester[currentSemester]) {
          groupSemester[currentSemester] = [];
        }
        groupSemester[currentSemester].push(course);
      });

      setGroupBySemesterList(groupSemester);

      setLoading(false);
    };

    populateData();
  }, []);

  const groupedBySemesterWidgets = (
    <>
      {Object.keys(groupBySemesterList).map((semester) => (
        <div key={semester}>
          <h2>{semester}</h2>
          {courseWidgets(groupBySemesterList[semester])}
        </div>
      ))}
    </>
  );

  if (loading) {
    return (
      <Container>
        <CenterSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BackButton />
        <Alert variant="danger" className="my-3">
          This course doesn't exist
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="my-3 text-center">{courseName}</h1>
      <h2 className="my-2 text-center">
        Rating:{" "}
        <span className="text-muted font-monospace">
          {courseRating
            ? `${courseRating}/5`
            : "This course has not been rated previously"}
        </span>
      </h2>
      {groupedBySemesterWidgets}
    </Container>
  );
};

const courseWidgets = (courseList) => {
  return (
    <Row>
      {courseList.map((course) => (
        <Col key={course.id} sm="12" md="6" lg="4" className="my-2">
          <LinkBoxWidget
            to={`/courses/${course.id}`}
            text={`Section ${course.section}`}
          />
        </Col>
      ))}
    </Row>
  );
};

export default CourseHub;
