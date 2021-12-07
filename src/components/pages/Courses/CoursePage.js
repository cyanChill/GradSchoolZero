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
  Modal,
} from "react-bootstrap";
import { useParams, Redirect } from "react-router";
import { Link } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { GoReport } from "react-icons/go";

import CenterSpinner from "../../UI/CenterSpinner";
import LabelDescripField from "../../UI/LabelDescripField";
import useCourseFetch from "../../../hooks/useCourseFetch";
import BackButton from "../../UI/BackButton";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";
import HorizFormInputField from "../../UI/HorizFormInputField";
import AcceptRejectWidget from "../../UI/AcceptRejectWidget/AcceptRejectWidget";
import DualColWidget from "../../UI/DualColWidget/DualColWidget";

import { convert23Time } from "../../../helpers/time";
import { gradeEquiv } from "../../../helpers/grades";
import { GlobalContext } from "../../../GlobalContext";
import useReviewFetch from "../../../hooks/useReviewFetch";
import useInfractions from "../../../hooks/useInfractions";
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
    getCourseAvgRating,
  } = useCourseFetch();
  const { userHook, termHook } = useContext(GlobalContext);
  const { user } = userHook;
  const { termInfo } = termHook;
  const { addReview } = useReviewFetch();
  const { submitComplaint } = useInfractions();
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
  const [show, setShow] = useState(false);
  const [isCorrectTerm, setIsCorrectTerm] = useState(false);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const courseInfoData = await getCourseInfo(id);

      if (courseInfoData === "error") {
        setError(true);
        return;
      }

      const courseRating = await getCourseAvgRating(
        courseInfoData.courseData.course.name,
        courseInfoData.courseData.course.code
      );

      setCourseInfo({
        ...courseInfoData.courseData,
        overallRating: courseRating,
      });
      setStudentList(courseInfoData.enrolledInfo);
      if (user.type === "registrar") {
        setReviewsList(courseInfoData.reviewsData);
      } else {
        const filteredReviews = courseInfoData.reviewsData.filter(
          (review) => review.show
        );
        setReviewsList(filteredReviews);
      }
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
        (enrolled) => enrolled.id === user.id && enrolled.StudentGradeWidget
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

  useEffect(() => {
    if (courseInfo.term && termInfo.semester) {
      setIsCorrectTerm(
        courseInfo.term.semester === termInfo.semester &&
          courseInfo.term.year === termInfo.year
      );
    }
  }, [courseInfo, termInfo]);

  const handleEnrollment = async () => {
    const response = await enrollCourse(user, courseInfo, termInfo);

    if (response.status === "error") {
      // Recieved an error from trying to enroll
      setAlertObj({
        type: "danger",
        title: response.title,
        message: response.details,
      });

      return;
    } else {
      // Either enrolled or joined the waitlist
      if (response.title === "Successfully Enrolled") {
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
      } else if (response.title === "Successfully Joined Waitlist") {
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
        title: response.title,
        message: response.details,
      });
    }
  };

  const handleUnEnrollment = async () => {
    if (stdCourseRel.enrolled) {
      // Unenroll Student
      const response = await unEnrollCourse(user.id, courseInfo.id, termInfo);
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

  const handleReview = async (rating, reason) => {
    setShow(false);

    const crsInfo = {
      ...courseInfo.course,
      id: courseInfo.id,
    };
    const reviewer = {
      id: user.id,
      name: user.name,
    };
    const response = await addReview(
      crsInfo,
      courseInfo.instructor,
      reviewer,
      +rating,
      reason
    );

    if (response.status === "success") {
      // Successfully added review
      setAlertObj({
        type: "success",
        title: "Success",
        message: response.message,
      });

      setReviewsList((prev) => [response.review, ...prev]);
      setStdCourseRel((prev) => ({ ...prev, reviewed: true }));
    } else {
      // Error with submitting review to server
      setAlertObj({
        type: "danger",
        title: "Error",
        message: response.message,
      });
    }
  };

  // Function to handle accepting/rejecting student on waitlist
  const handleWaitlist = async (waitlistInfo, status) => {
    if (status === "approve") {
      const res = await addStudentFromWaitlist(
        waitlistInfo,
        courseInfo.id,
        termInfo
      );
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

  // Function to submit report by instructor
  const submitComplaintHandler = async (reason, outcome, std) => {
    const extra = {
      outcome,
      courseId: courseInfo.id,
    };
    const offender = {
      id: std.id,
      name: std.name,
      type: "student",
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

  // Setting the student widgets for the page
  const studentWidgets = studentsList.map((stud) => {
    if (
      isCorrectTerm &&
      (stdCourseRel.isCourseProf || user.type === "registrar")
    ) {
      if (termInfo.phase === "grading") {
        return (
          <StudentGradeWidget
            key={stud.id}
            stdInfo={stud}
            updateGrade={updateGrade}
          />
        );
      } else {
        return (
          <StudentReportWidget
            key={stud.id}
            stdInfo={stud}
            submitHandler={submitComplaintHandler}
          />
        );
      }
    }

    return (
      <LinkBoxWidget
        key={stud.id}
        to={`/profile/${stud.id}`}
        text={stud.name}
        className="my-2"
      />
    );
  });

  // Setting the review widgets for the page
  const reviewWidgets = reviewsList.map((review) => (
    <ReviewWidget key={review.id} userType={user.type} reviewInfo={review} />
  ));

  // Setting the waitlist widgets for the page
  const waitlistWidgets =
    isCorrectTerm && termInfo.phase === "registration"
      ? waitlist.map((std) => (
          <WaitlistWidget
            key={std.id}
            waitlistInfo={std}
            handleResult={handleWaitlist}
          />
        ))
      : [];

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
    const { course, instructor, capacity, time, overallRating } = courseInfo;

    const timeField = time.map((classTime, idx) => (
      <span key={idx} className={classes.secondary}>
        {classTime.day} {convert23Time(classTime.start)}—
        {convert23Time(classTime.end)}
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
              label="Section:"
              description={courseInfo.section}
            />
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
            <LabelDescripField
              label="Course Rating:"
              description={
                overallRating
                  ? `${overallRating}/5`
                  : "This course has not been rated previously"
              }
            />
            {/* Enroll & Write Review Buttons Row*/}
            {!user.suspended &&
              !user.graduated &&
              !user.removed &&
              (user.type === "student" || user.type === "registrar") && (
                <Row>
                  <Col xs="auto">
                    {!stdCourseRel.enrolled &&
                      !stdCourseRel.waitlist &&
                      termInfo.year === courseInfo.term.year &&
                      (termInfo.phase === "registration" ||
                        (termInfo.phase !== "registration" &&
                          user.specReg)) && (
                        <Button variant="success" onClick={handleEnrollment}>
                          {capacity.available > 0
                            ? `Enroll ${capacity.max - capacity.available}/${
                                capacity.max
                              }`
                            : "Join Waitlist"}
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
                        <Button
                          variant="secondary"
                          onClick={() => setShow(true)}
                        >
                          Write Review
                        </Button>
                      </Col>
                    )}
                </Row>
              )}
          </Card.Body>
        </Card>

        <Tabs defaultActiveKey="students" className="my-3">
          <Tab eventKey="students" title="Students">
            {studentWidgets}
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            {reviewWidgets}
          </Tab>
          {isCorrectTerm &&
            (stdCourseRel.isCourseProf || user.type === "registrar") &&
            termInfo.phase === "registration" && (
              <Tab eventKey="waitlist" title="Waitlist">
                {waitlistWidgets.length > 0 ? (
                  waitlistWidgets
                ) : (
                  <p>There are no students in the waitlist.</p>
                )}
              </Tab>
            )}
        </Tabs>

        <ReviewModal
          show={show}
          handleClose={() => setShow(false)}
          submitReview={handleReview}
        />
      </>
    );
  }

  let deleteCourseBtn = null;

  if (
    isCorrectTerm &&
    user.type === "registrar" &&
    termInfo.phase === "set-up"
  ) {
    deleteCourseBtn = <DeleteCourseBtn courseId={courseInfo.id} />;
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
      {deleteCourseBtn}
    </Container>
  );
};

const ReviewWidget = ({ reviewInfo, userType }) => {
  const formattedDate = new Date(reviewInfo.date).toDateString();

  const leftCol = (
    <h3 className="d-flex align-items-center">
      {reviewInfo.rating}
      <FaRegStar />
    </h3>
  );

  const rightCol = (
    <div className="text-break">
      <p className={`my-1 ${classes.secondary}`}>
        {userType === "registrar" && (
          <span className="fw-bold">{reviewInfo.reviewer.name} </span>
        )}
        {formattedDate}
      </p>
      <p className="my-1">{reviewInfo.reason}</p>
    </div>
  );

  return (
    <DualColWidget
      leftCol={{
        body: leftCol,
        breakPoints: { sm: "auto" },
        className: "review",
      }}
      rightCol={{ body: rightCol, className: "review" }}
    />
  );
};

const WaitlistWidget = ({ waitlistInfo, handleResult }) => {
  const { id, name } = waitlistInfo;

  return (
    <AcceptRejectWidget
      leftCol={
        <Link to={`/profile/${id}`} className={classes.link}>
          {name}
        </Link>
      }
      handleAccept={() => handleResult(waitlistInfo, "approve")}
      handleReject={() => handleResult(waitlistInfo, "reject")}
    />
  );
};

const StudentGradeWidget = ({ stdInfo, updateGrade }) => {
  const { id, name, grade } = stdInfo;

  const leftCol = (
    <Link to={`/profile/${id}`} className={classes.link}>
      {name}
    </Link>
  );

  const rightCol = (
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
  );

  return (
    <DualColWidget
      leftCol={{ body: leftCol }}
      rightCol={{
        body: rightCol,
        breakPoints: { sm: "auto" },
        className: "text-center",
      }}
    />
  );
};

const StudentReportWidget = ({ stdInfo, submitHandler }) => {
  const { id, name } = stdInfo;
  const [show, setShow] = useState(false);
  const [reportOutcome, setReportOutcome] = useState("");
  const [reportOutcomeError, setReportOutcomeError] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  const handleClose = () => {
    setShow(false);
    setReason("");
    setReasonError(false);
    setReportOutcome("");
    setReportOutcomeError(false);
  };

  const handleSubmit = () => {
    setReasonError(false);
    setReportOutcomeError(false);

    if (reason.trim().length < 100) {
      setReasonError(true);
      return;
    }

    if (!reportOutcome) {
      setReportOutcomeError(true);
      return;
    }

    handleClose();

    submitHandler(reason, reportOutcome, stdInfo);
  };

  const leftCol = (
    <Link to={`/profile/${id}`} className={classes.link}>
      {name}
    </Link>
  );

  const rightCol = (
    <GoReport onClick={() => setShow(true)} className={classes.report} />
  );

  return (
    <>
      <DualColWidget
        leftCol={{ body: leftCol }}
        rightCol={{
          body: rightCol,
          breakPoints: { xs: "auto" },
          className: "text-center",
        }}
      />

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

          <Form.Group className="mb-3">
            <Form.Label>Report Outcome:</Form.Label>
            <Form.Select
              name="reportOutcome"
              defaultValue=""
              onChange={(e) => setReportOutcome(e.target.value)}
              className={reportOutcomeError ? "is-invalid" : ""}
            >
              <option value="" disabled>
                Select an Outcome
              </option>
              <option value="warning">Warning</option>
              <option value="de-registration">De-Registration</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select an outcome.
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

const ReviewModal = ({ show, handleClose, submitReview }) => {
  const [rating, setRating] = useState(3);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  const handleSubmit = () => {
    if (reason.trim().length < 50) {
      setReasonError(true);
      return;
    }
    submitReview(rating, reason);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Write Review:</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <HorizFormInputField
          label="Rating: "
          inputField={{
            type: "number",
            value: rating,
            min: 1,
            max: 5,
            step: 0.01,
            onChange: (e) => setRating(e.target.value),
          }}
        />

        <Form.Group className="mb-3">
          <Form.Label column sm="auto">
            Review:
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={reasonError ? "is-invalid" : ""}
          />
          <Form.Control.Feedback type="invalid">
            Please write some more in your review.
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
  );
};

const DeleteCourseBtn = ({ courseId }) => {
  const { deleteCourse } = useCourseFetch();
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => setShow(false);

  const handleContinue = async () => {
    await deleteCourse(courseId);
    setSuccess(true);
  };

  if (success) {
    return <Redirect to="/courses" />;
  }

  return (
    <div className="my-3 d-flex justify-content-center align-items-center">
      <Button variant="danger" onClick={() => setShow(true)}>
        Delete Course?
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete This Course</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "red" }}>
          <span className="fw-bold">Warning:</span> The irreversibly delete the
          course from the database.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleContinue}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoursePage;
