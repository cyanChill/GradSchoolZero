import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Col, Row, Alert } from "react-bootstrap";
import CenterSpinner from "../../UI/CenterSpinner";
import { calculateGPA } from "../../../helpers/grades";

import classes from "./Profile.module.css";

const defaultInfo = {
  userData: null,
  gradeData: null,
  taughtData: null,
};

const defaultOrgInfo = {
  currCourses: null,
  prevCourses: null,
  currTeach: null,
  prevTeach: null,
  currInstructors: null,
};

const Profile = () => {
  const { id } = useParams();
  const { userHook, termHook } = useContext(GlobalContext);
  const { getUserInfoFromId, user } = userHook;
  const { termInfo } = termHook;

  const userId = id || user.id;
  const [profileInfo, setProfileInfo] = useState(defaultInfo);
  const [organizedData, setOrganizedData] = useState(defaultOrgInfo);
  const [loading, setLoading] = useState(true);
  const [canSeeAll, setCanSeeAll] = useState(
    user.type === "registrar" || !id ? true : false
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const data = await getUserInfoFromId(userId);

      if (data === "error") {
        setError(true);
        setLoading(false);
        return;
      }

      const gradesArr = data.gradeData
        .map((grade) => grade.grade)
        .filter((grade) => grade !== "");
      const GPA = calculateGPA(gradesArr);

      setProfileInfo({
        ...data,
        userData: { ...data.userData, GPA },
      });

      let currCourses = [],
        prevCourses = [],
        currTeach = [],
        prevTeach = [];

      data.gradeData.forEach((grade) => {
        if (
          grade.courseInfo.semester === termInfo.semester &&
          +grade.courseInfo.year === +termInfo.year
        ) {
          currCourses.push(grade);
          if (
            user.id === grade.courseInfo.instructorId ||
            user.id === grade.studentInfo.id
          ) {
            setCanSeeAll(true);
          }
        } else {
          prevCourses.push(grade);
        }
      });

      data.taughtData.forEach((taught) => {
        if (
          taught.courseInfo.semester === termInfo.semester &&
          +taught.courseInfo.year === +termInfo.year
        ) {
          currTeach.push(taught);
        } else {
          prevTeach.push(taught);
        }
      });

      setOrganizedData({ currCourses, prevCourses, currTeach, prevTeach });

      setLoading(false);
    };

    populateData();
  }, []);

  if (loading) {
    return <CenterSpinner />;
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="my-4">
          This user does not exist
        </Alert>
      </Container>
    );
  }

  const currCourseWdgt = createWidgetGroups(
    organizedData.currCourses,
    canSeeAll
  );
  const prevCourseWdgt = createWidgetGroups(
    organizedData.prevCourses,
    canSeeAll
  );
  const currTeachWdgt = createWidgetGroups(organizedData.currTeach, canSeeAll);
  const prevTeachWdgt = createWidgetGroups(organizedData.prevTeach, canSeeAll);

  let body = (
    <>
      <h3>
        Current GPA:{" "}
        <span className="font-monospace text-muted">
          {profileInfo.userData.GPA}
        </span>
      </h3>
      <h3 className="my-3">Currently Taking:</h3>
      <Row>
        {currCourseWdgt.length > 0 ? (
          currCourseWdgt
        ) : (
          <p>User is currently not taking any courses.</p>
        )}
      </Row>
      <h3 className="my-3">Previously Taken:</h3>
      <Row>
        {prevCourseWdgt.length > 0 ? (
          prevCourseWdgt
        ) : (
          <p>User have not taken any courses in the past.</p>
        )}
      </Row>
    </>
  );

  if (profileInfo.userData.type === "instructor") {
    body = (
      <>
        <h2>Currently Teaching:</h2>
        <Row>
          {currTeachWdgt.length > 0 ? (
            currTeachWdgt
          ) : (
            <p>User is currently not teaching any courses.</p>
          )}
        </Row>
        <h2 className="my-3">Previously Taught:</h2>
        <Row>
          {prevTeachWdgt.length > 0 ? (
            prevTeachWdgt
          ) : (
            <p>User have not taught any courses in the past.</p>
          )}
        </Row>
      </>
    );
  }

  return (
    <Container>
      <h1 className="text-center my-3">
        {profileInfo.userData.name}'s Profile
      </h1>
      {body}
    </Container>
  );
};

const createWidgetGroups = (arr, canSeeAll) => {
  return arr.map((course) => (
    <Col key={course.id} md="6" lg="6" className="my-2">
      <Widget
        key={course.id}
        name={`${course.courseInfo.code} ${course.courseInfo.name}`}
        courseId={course.courseInfo.id || course.id}
        grade={course.grade}
        canSeeAll={canSeeAll}
      />
    </Col>
  ));
};

const Widget = ({ name, courseId, grade, canSeeAll }) => {
  return (
    <Card className={classes.widget}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <Link className={classes.courseLink} to={`/courses/${courseId}`}>
          {name}
        </Link>
        {canSeeAll && (
          <span className="fw-bold font-monospace text-muted">{grade}</span>
        )}
      </Card.Body>
    </Card>
  );
};

export default Profile;
