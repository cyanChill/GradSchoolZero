import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { useParams, Link, Redirect } from "react-router-dom";
import {
  Container,
  Card,
  Col,
  Row,
  Alert,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import CenterSpinner from "../../UI/CenterSpinner";
import { calculateGPA } from "../../../helpers/grades";
import useInfractions from "../../../hooks/useInfractions";

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
  const { getUserInfoFromId, user, applyForGrad, refreshUserInfo } = userHook;
  const { termInfo } = termHook;
  const { submitComplaint } = useInfractions();

  const userId = id || user.id;
  const [profileInfo, setProfileInfo] = useState(defaultInfo);
  const [organizedData, setOrganizedData] = useState(defaultOrgInfo);
  const [loading, setLoading] = useState(true);
  const [canSeeAll, setCanSeeAll] = useState(
    user.type === "registrar" || !id ? true : false
  );
  const [error, setError] = useState(false);
  const [alertObj, setAlertObj] = useState(null);

  const handleApplyGrad = async () => {
    await applyForGrad(user.id);
    await refreshUserInfo();

    setAlertObj({
      type: "success",
      title: "Success",
      message: "Successfully Applied For Graduation",
    });
  };

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
          grade.term.semester === termInfo.semester &&
          +grade.term.year === +termInfo.year
        ) {
          currCourses.push(grade);
          if (user.id === grade.instructor.id || user.id === grade.student.id) {
            setCanSeeAll(true);
          }
        } else {
          prevCourses.push(grade);
        }
      });

      data.taughtData.forEach((taught) => {
        if (
          taught.term.semester === termInfo.semester &&
          +taught.term.year === +termInfo.year
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

  const submitReportHandler = async (reason) => {
    const extra = {
      outcome: "warning",
    };
    const offender = {
      id: profileInfo.id,
      name: profileInfo.name,
      type: profileInfo.type,
    };

    const res = await submitComplaint(user, offender, reason, extra);

    if (res.status === "success") {
      setAlertObj({
        type: "success",
        title: "Success",
        message: res.message,
      });
    } else {
      setAlertObj({
        type: "danger",
        title: "Error",
        message: res.message,
      });
    }
  };

  if (!id && user.type === "registrar") {
    return <Redirect to="/registrar" />;
  }

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
      {alertObj && (
        <Alert
          className="my-3"
          variant={alertObj.type}
          onClose={() => setAlertObj(null)}
          dismissible
        >
          <span className="fw-bold">{alertObj.title}: </span>
          {alertObj.message}
        </Alert>
      )}
      <h1 className="text-center my-3">
        {profileInfo.userData.name}'s Profile
      </h1>
      {body}
      <div className="d-flex justify-content-center align-items-center my-3 gap-2">
        {/* Apply for graduation button */}
        {!id && !user.applyGrad && user.type === "student" && (
          <Button onClick={handleApplyGrad}>Apply For Graduation</Button>
        )}

        {/* Report user button */}
        {id &&
          profileInfo.id !== user.id &&
          profileInfo.type !== "registrar" && (
            <ReportButtonModal submitHandler={submitReportHandler} />
          )}
      </div>
    </Container>
  );
};

const createWidgetGroups = (arr, canSeeAll) => {
  return arr.map((course) => (
    <Col key={course.id} md="6" lg="6" className="my-2">
      <Widget
        key={course.id}
        name={`[${course.course.code}] ${course.course.name}`}
        courseId={course.course.id || course.id}
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

const ReportButtonModal = ({ submitHandler }) => {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  const handleClose = () => {
    setShow(false);
    setReason("");
    setReasonError(false);
  };

  const handleSubmit = () => {
    setReasonError(false);

    if (reason.trim().length < 100) {
      setReasonError(true);
      return;
    }

    handleClose();
    submitHandler(reason);
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShow(true)}>
        Report
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit a Report</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label column sm="auto">
              Reason:
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={reasonError ? "is-invalid" : ""}
            />
            <Form.Control.Feedback type="invalid">
              Please write some more in your reason for this report
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
