import { useState, useEffect, useContext } from "react";
import {
  Container,
  Tab,
  Tabs,
  Card,
  Alert,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { BiCheck, BiX } from "react-icons/bi";

import CenterSpinner from "../../UI/CenterSpinner";
import LabelDescripField from "../../UI/LabelDescripField";
import useCourseFetch from "../../../hooks/useCourseFetch";
import BackButton from "../../UI/BackButton";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";

import { convert23Time } from "../../../helpers/time";
import { gradeEquiv } from "../../../helpers/grades";
import { GlobalContext } from "../../../GlobalContext";
import classes from "./CoursePage.module.css";

const CoursePage = () => {
  const { id } = useParams();
  const {
    getCourseInfo,
    enrollCourse,
    unEnrollCourse,
    leaveWaitlist,
    addStudentFromWaitlist,
    removeStudentFromWaitlist,
    setStdGrade,
  } = useCourseFetch();
  const { userHook, termHook } = useContext(GlobalContext);
  const { user } = userHook;
  const { termInfo } = termHook;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseInfo, setCourseInfo] = useState({});
  const [studentsList, setStudentList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [stdCourseRel, setStdCourseRel] = useState({
    enrolled: false,
    waitlist: false,
    reviewed: false,
    hasGrade: false,
    isCourseProf: false,
  });
  const [alertObj, setAlertObj] = useState(null);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const courseInfoData = await getCourseInfo(id);

      if (courseInfoData === "error") {
        setError(true);
        return;
      }

      console.log(courseInfoData);

      setCourseInfo(courseInfoData.courseData);
      setStudentList(courseInfoData.enrolledInfo);
      setReviewsList(courseInfoData.reviewsData);
      setWaitlist(courseInfoData.courseData.waitList);

      // Checking to see if the student is enrolled in the course, is on the waitlist, and if they wrote a review
      const isEnroll = courseInfoData.enrolledInfo.some(
        (enrolled) => enrolled.id === user.id
      );
      const isWaitlist = courseInfoData.courseData.waitList.some(
        (std) => std.id === user.id
      );
      const wroteReview = courseInfoData.reviewsData.some(
        (review) => review.reviewer.id === user.id
      );
      const hasGrade = courseInfoData.enrolledInfo.some(
        (enrolled) => enrolled.id === user.id && enrolled.grade
      );
      const isCourseProf =
        user.type === "instructor" &&
        courseInfoData.courseData.instructor.id === user.id;

      setStdCourseRel({
        enrolled: isEnroll,
        waitlist: isWaitlist,
        reviewed: wroteReview,
        hasGrade,
        isCourseProf,
      });

      setLoading(false);
    };

    populateData();
  }, []);

  const handleEnrollment = async () => {
    const response = await enrollCourse(user, courseInfo);

    if (response.error) {
      // Recieved an error from trying to enroll
      setAlertObj({
        type: "danger",
        title: response.error,
        message: response.details,
      });

      return;
    } else {
      // Either enrolled or joined the waitlist
      if (response.status === "Successfully Enrolled") {
        setStdCourseRel((prev) => ({
          ...prev,
          enrolled: true,
        }));

        setStudentList((prev) => [
          ...prev,
          {
            id: user.id,
            name: user.name,
          },
        ]);
      } else if (response.status === "Successfully Joined Waitlist") {
        setStdCourseRel((prev) => ({
          ...prev,
          waitlist: true,
        }));

        setWaitlist((prev) => [
          ...prev,
          {
            id: user.id,
            name: user.name,
          },
        ]);
      }

      setAlertObj({
        type: "success",
        title: response.status,
        message: response.details,
      });
    }
  };

  const handleUnEnrollment = async () => {
    console.log("handling unenrollment logic...");

    if (stdCourseRel.enrolled) {
      // Unenroll Student
      const response = await unEnrollCourse(user.id, courseInfo.id);
      if (response.status === "success") {
        setStdCourseRel((prev) => ({
          ...prev,
          enrolled: false,
        }));

        setStudentList((prev) => prev.filter((std) => std.id !== user.id));

        setAlertObj({
          type: "success",
          title: "Success",
          message: response.message,
        });
        return;
      }

      setAlertObj({
        type: "error",
        title: "Error",
        message: response.message,
      });
    } else {
      // Remove student from waitlist
      const response = await leaveWaitlist(user.id, courseInfo.id);
      if (response.status === "success") {
        setStdCourseRel((prev) => ({
          ...prev,
          waitlist: false,
        }));

        setWaitlist((prev) => prev.filter((std) => std.id !== user.id));

        setAlertObj({
          type: "success",
          title: "Success",
          message: response.message,
        });
        return;
      }

      setAlertObj({
        type: "error",
        title: "Error",
        message: response.message,
      });
    }
  };

  const handleReview = async () => {
    console.log("handling review logic....");
    /* 
      Logic For Review Button:
      - Button is disabled unless:
        - Student is in the course and haven't recieved a grade
        - Student is in the course and haven't wrote a review for the course yet

      We should do these checks in the "useEffect"
    */
  };

  // Function to handle accepting/rejecting student on waitlist
  const handleWaitlist = async (waitlistInfo, status) => {
    if (status === "approve") {
      const res = await addStudentFromWaitlist(waitlistInfo, courseInfo.id);
      setWaitlist((prev) => prev.filter((std) => std.id !== waitlistInfo.id));

      if (res.status === "success") {
        // Enrolled waitlist student
        setStudentList((prev) => [...prev, waitlistInfo]);
        setAlertObj({
          type: "success",
          title: "Success",
          message: res.message,
        });
      } else {
        // Failed to enroll waitlist student
        setAlertObj({
          type: "danger",
          title: "Error",
          message: res.message,
        });
      }
    } else {
      await removeStudentFromWaitlist(waitlistInfo.id, courseInfo.id);
      setWaitlist((prev) => prev.filter((std) => std.id !== waitlistInfo.id));
    }
  };

  // Function to update student grades
  const updateGrade = async (stdInfo, grade) => {
    await setStdGrade(stdInfo.id, courseInfo.id, grade);

    setStudentList((prev) =>
      prev.map((std) => {
        if (std.id !== stdInfo.id) return std;
        return {
          ...stdInfo,
          grade,
        };
      })
    );
  };

  // Setting the student widgets for the page
  const studentWidgets = studentsList.map((stud) => {
    if (
      (stdCourseRel.isCourseProf || user.type === "registrar") &&
      termInfo.phase === "grading"
    ) {
      return (
        <StudentGradeWidget
          key={stud.id}
          stdInfo={stud}
          updateGrade={updateGrade}
        />
      );
    }

    return (
      <LinkBoxWidget
        key={stud.id}
        to={`/profile/${stud.id}`}
        text={stud.name}
      />
    );
  });

  // Setting the review widgets for the page
  const reviewWidgets = reviewsList.map((review) => (
    <ReviewWidget key={review.id} userType={user.type} reviewInfo={review} />
  ));

  // Setting the waitlist widgets for the page
  const waitlistWidgets = waitlist.map((std) => (
    <WaitlistWidget
      key={std.id}
      waitlistInfo={std}
      handleResult={handleWaitlist}
      phase={termInfo.phase}
      userType={user.type}
    />
  ));

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

  let body = null;

  if (!loading) {
    const { course, instructor, capacity, time } = courseInfo;

    const timeField = time.map((time, idx) => (
      <span key={idx} className={classes.secondary}>
        {time.day} {convert23Time(time.start)}—{convert23Time(time.end)}
        {idx !== time.length - 1 && ", "}
      </span>
    ));

    body = (
      <>
        <Card className="my-3">
          <Card.Body>
            <h2>{course.name}</h2>
            {timeField}
            <LabelDescripField
              label="Instructor:"
              description={
                <Link to={`/profile/${instructor.id}`} className={classes.link}>
                  {instructor.name}
                </Link>
              }
            />
            <LabelDescripField
              label="Max Capacity:"
              description={capacity.max}
            />
            {/* Enroll & Write Review Buttons Row*/}
            <Row>
              <Col xs="auto">
                {!stdCourseRel.enrolled && !stdCourseRel.waitlist && (
                  <Button variant="success" onClick={handleEnrollment}>
                    {capacity.available > 0 ? "Enroll" : "Join Waitlist"}
                  </Button>
                )}
                {(stdCourseRel.enrolled || stdCourseRel.waitlist) && (
                  <Button variant="danger" onClick={handleUnEnrollment}>
                    {stdCourseRel.enrolled ? "Withdraw" : "Leave Waitlist"}
                  </Button>
                )}
              </Col>
              {/* Show review button if they're enrolled and didn't write a review for this course and doesn't have a grade assigned to them */}
              {stdCourseRel.enrolled &&
                !stdCourseRel.reviewed &&
                termInfo.phase !== "registration" &&
                !stdCourseRel.hasGrade && (
                  <Col>
                    <Button variant="secondary" onClick={handleReview}>
                      Write Review
                    </Button>
                  </Col>
                )}
            </Row>
          </Card.Body>
        </Card>
        <Tabs defaultActiveKey="students" className="my-3">
          <Tab eventKey="students" title="Students">
            {studentWidgets}
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            {reviewWidgets}
          </Tab>
          {(stdCourseRel.isCourseProf || user.type === "registrar") && (
            <Tab eventKey="waitlist" title="Waitlist">
              {waitlistWidgets.length > 0 ? (
                waitlistWidgets
              ) : (
                <p>There are no students in the waitlist.</p>
              )}
            </Tab>
          )}
        </Tabs>
      </>
    );
  }

  return (
    <Container>
      <BackButton />
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
      {loading && <CenterSpinner />}
      {!loading && body}
    </Container>
  );
};

const ReviewWidget = ({ reviewInfo, userType }) => {
  const formattedDate = new Date(reviewInfo.date).toDateString();

  return (
    <div className={classes.review}>
      <Row className="d-flex align-items-center">
        <Col sm="auto">
          <h3 className="d-flex align-items-center">
            {reviewInfo.rating}
            <FaRegStar />
          </h3>
        </Col>
        <Col>
          <p className={`my-1 ${classes.secondary}`}>
            {userType === "registrar" && (
              <span className="fw-bold">{reviewInfo.reviewer.name} </span>
            )}
            {formattedDate}
          </p>
          <p className="my-1">{reviewInfo.reason}</p>
        </Col>
      </Row>
    </div>
  );
};

const WaitlistWidget = ({ waitlistInfo, handleResult, phase, userType }) => {
  const { id, name } = waitlistInfo;

  return (
    <div className={classes.waitlist}>
      <Row className="d-flex align-items-center">
        <Col>
          <Link to={`/profile/${id}`} className={classes.link}>
            {name}
          </Link>
        </Col>
        {(phase === "registration" || userType === "registrar") && (
          <Col sm="auto" className="text-center">
            <Button
              variant="success"
              className="mx-1"
              onClick={() => handleResult(waitlistInfo, "approve")}
            >
              <BiCheck />
            </Button>
            <Button
              variant="danger"
              className="mx-1"
              onClick={() => handleResult(waitlistInfo, "reject")}
            >
              <BiX />
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};

const StudentGradeWidget = ({ stdInfo, updateGrade }) => {
  const { id, name, grade } = stdInfo;

  return (
    <div className={classes.waitlist}>
      <Row className="d-flex align-items-center">
        <Col>
          <Link to={`/profile/${id}`} className={classes.link}>
            {name}
          </Link>
        </Col>
        <Col sm="auto">
          <Form.Select
            value={grade}
            onChange={(e) => updateGrade(stdInfo, e.target.value)}
          >
            <option value="" disabled>
              Select an Grade
            </option>
            {Object.keys(gradeEquiv).map((gradeLetter) => (
              <option key={gradeLetter} value={gradeLetter}>
                {gradeLetter}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
};

export default CoursePage;
