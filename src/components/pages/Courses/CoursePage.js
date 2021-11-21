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
} from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";

import CenterSpinner from "../../UI/CenterSpinner";
import LabelDescripField from "../../UI/LabelDescripField";
import useCourseFetch from "../../../hooks/useCourseFetch";
import BackButton from "../../UI/BackButton";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";

import { convert23Time } from "../../../helpers/time";
import { GlobalContext } from "../../../GlobalContext";
import classes from "./CoursePage.module.css";

const CoursePage = () => {
  const { id } = useParams();
  const { getCourseInfo } = useCourseFetch();
  const { userHook } = useContext(GlobalContext);
  const { user } = userHook;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentWidgets, setStudentWidgets] = useState([]);
  const [reviewWidgets, setReviewWidgets] = useState([]);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const courseInfo = await getCourseInfo(id);

      console.log(courseInfo);

      if (courseInfo === "error") {
        setError(true);
        return;
      }

      setData(courseInfo);

      // Setting the student widgets for the page
      const studWdgts = courseInfo.enrolledInfo.map((stud) => (
        <LinkBoxWidget
          key={stud.id}
          to={`/profile/${stud.id}`}
          text={stud.name}
        />
      ));
      setStudentWidgets(studWdgts);

      // Setting the review widgets for the page
      const reviewWdgts = courseInfo.reviewsData.map((review) => (
        <ReviewWidget
          key={review.id}
          userType={user.type}
          reviewInfo={review}
        />
      ));
      setReviewWidgets(reviewWdgts);

      setLoading(false);
    };

    populateData();
  }, []);

  const handleEnrollment = async () => {
    console.log("handling enrollment logic....");
    /* 
      We should check if the user is enrolled, if they are, have this button be the uneroll button (we can check to see if the user is in the list of enrolled students returned by "courseInfo.enrolledInfo" -- we can put this check in the "setting the students widgets for the page" map [compare "stud.id" with "user.id"])

      We should do the check in the "useEffect" - have a state that keeps track of what the "enroll" button should say
    */
  };

  const handleUnEnrollment = async () => {
    console.log("handling unenrollment logic...");
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
    const { course, instructor, capacity, time } = data.courseData;

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
                <Button variant="success" onClick={handleEnrollment}>
                  Enroll
                </Button>
              </Col>
              <Col>
                <Button variant="secondary" onClick={handleReview}>
                  Write Review
                </Button>
              </Col>
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
          {user.type === "instructor" ||
            (user.type === "registrar" && (
              <Tab eventKey="waitlist" title="Waitlist">
                Waitlist students
              </Tab>
            ))}
        </Tabs>
      </>
    );
  }

  return (
    <Container>
      <BackButton />
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

export default CoursePage;
