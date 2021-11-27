import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../../GlobalContext";

import { Container, Row, Col } from "react-bootstrap";
import useCourseFetch from "../../../hooks/useCourseFetch";
import CenterSpinner from "../../UI/CenterSpinner";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";
import DualColWidget from "../../UI/DualColWidget/DualColWidget";

import classes from "./CoursePage.module.css";

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

  const phase =
    termInfo.phase === "set-up"
      ? "Class Set-Up Period"
      : termInfo.phase === "registration"
      ? "Course Registration"
      : termInfo.phase === "running"
      ? "Class Running Period"
      : "Grading Period";

  const currentPhase = (
    <h2 className="my-3">
      The current phase is:{" "}
      <span className="font-monospace text-muted">{phase}</span>
    </h2>
  );

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
      {currentPhase}
      <Statistics />
      <h1 className="my-3 text-center">
        {`${termInfo.semester} ${termInfo.year}`} Courses:
      </h1>
      {loading && <CenterSpinner />}
      {!loading && coursesWidgets}
    </Container>
  );
};

const Statistics = () => {
  const { userHook } = useContext(GlobalContext);
  const { getProgramStudStats } = userHook;
  const { getProgramClassStats } = useCourseFetch();
  const [topRated, setTopRated] = useState([]);
  const [bottomRated, setBottomRated] = useState([]);
  const [topStuds, setTopStuds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);

      const classStats = await getProgramClassStats();
      setTopRated(classStats.top3);

      const filteredBottom = classStats.bottom3.filter((course) =>
        classStats.top3.every((topcourse) => topcourse.id !== course.id)
      );
      setBottomRated(filteredBottom);

      const studStats = await getProgramStudStats();
      const filteredStud = studStats.top3.filter((stud) => stud.GPA);
      setTopStuds(filteredStud);

      setLoading(false);
    };

    populateData();
  }, []);

  if (loading) return <CenterSpinner />;

  const topClassList = topRated.map((course) => (
    <TopBottomCourseWidget key={course.id} classInfo={course} />
  ));

  const bottomClassList = bottomRated.map((course) => (
    <TopBottomCourseWidget key={course.id} classInfo={course} />
  ));

  const topStudList = topStuds.map((stud) => {
    const leftCol = (
      <Link to={`/profile/${stud.id}`} className={classes.link}>
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

  return (
    <Row className="mt-3 mb-2">
      {topClassList.length > 0 && (
        <Col xs="12" lg="4">
          <h2>Top Rated Courses</h2>
          {topClassList}
        </Col>
      )}
      {bottomClassList.length > 0 && (
        <Col xs="12" lg="4">
          <h2>Bottom Rated Courses</h2>
          {bottomClassList}
        </Col>
      )}
      {topStudList.length > 0 && (
        <Col xs="12" lg="4">
          <h2>Top Rated Students</h2>
          {topStudList}
        </Col>
      )}
    </Row>
  );
};

const TopBottomCourseWidget = ({ classInfo }) => {
  const leftCol = <span>{classInfo.name}</span>;
  const rightCol = (
    <span className="text-muted font-monospace">{classInfo.rating}</span>
  );

  return (
    <DualColWidget
      leftCol={{ body: leftCol }}
      rightCol={{
        body: rightCol,
        breakPoints: { xs: "auto" },
        className: "font-monospace text-muted",
      }}
    />
  );
};

export default Courses;
