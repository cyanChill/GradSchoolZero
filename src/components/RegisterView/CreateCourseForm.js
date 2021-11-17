import { useContext, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import useInstructorFetch from "../../hooks/useInstructorFetch";

import FormAlerts from "../UI/FormAlerts/FormAlerts";

import {
  Button,
  Form,
  Card,
  Row,
  Col,
  Container,
  Alert,
} from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

import {
  convert23Time,
  isAfter,
  checkConflicts,
  removeDupe,
} from "../../helpers/time";
import BackButton from "../UI/BackButton";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreateCourseForm = () => {
  const { termHook } = useContext(GlobalContext);
  const { termInfo } = termHook;
  const { nonSuspsendedInstructors: instructors } = useInstructorFetch();

  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    instructorId: "",
    instructorName: "",
    maxCapacity: 5,
    courseTimes: [],
    newDay: "",
    newStart: "",
    newEnd: "",
  });
  const [addTimeError, setAddTimeError] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const removeTime = (idx) => {
    const newTimes = courseInfo.courseTimes.filter(
      (time, tIdx) => tIdx !== idx
    );
    setCourseInfo({ ...courseInfo, courseTimes: newTimes });
  };

  const addTime = () => {
    const validTime = isAfter(courseInfo.newStart, courseInfo.newEnd);

    if (
      courseInfo.newDay &&
      courseInfo.newStart &&
      courseInfo.newEnd &&
      validTime
    ) {
      const newTimes = [
        ...courseInfo.courseTimes,
        {
          day: courseInfo.newDay,
          start: courseInfo.newStart,
          end: courseInfo.newEnd,
        },
      ];
      setAddTimeError(false);
      setCourseInfo({
        ...courseInfo,
        courseTimes: newTimes,
        newDay: "",
        newStart: "",
        newEnd: "",
      });
    } else {
      setAddTimeError(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInstructor = (e) => {
    const { value } = e.target;
    const [id, name] = value.split(",");
    setCourseInfo((prevState) => ({
      ...prevState,
      instructorId: id,
      instructorName: name,
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setLoading(true);

    /* Validations */
    const errors = [];
    const noDupes = removeDupe(courseInfo.courseTimes);
    const hasTimeConflicts = checkConflicts(noDupes);

    if (!courseInfo.courseName) errors.push("Please enter in a course name");
    if (!courseInfo.instructorId) errors.push("Please select an instructor");
    if (courseInfo.courseTimes.length === 0)
      errors.push("Please enter at least 1 course time");
    if (hasTimeConflicts)
      errors.push("There are time conflicts for this course");

    if (errors.length > 0) {
      setFormErrors(errors);
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
        /* Submit Form to server */

        setSuccess(true);
      }, 500);
    }
  };

  /* Check if current phase is course setup */
  if (termInfo.phase !== "set-up") {
    return (
      <Container>
        <BackButton />
        <Alert variant="danger" className="mt-3">
          <span className="fw-bold">Error:</span> The program is not in the{" "}
          <span className="font-monospace">Class Set-Up Period</span>.{" "}
        </Alert>
      </Container>
    );
  }

  if (success) {
    return (
      <Container>
        <Alert variant="success" className="mx-auto mt-5">
          <Alert.Heading>Success!</Alert.Heading>
          <p>
            Successfully created course for the {termInfo.semester}{" "}
            {termInfo.year} semster:
          </p>
          <hr />
          <p className="mb-0">
            <span className="fw-bold">Course Name: </span>
            <span className="font-monospace">{courseInfo.courseName}</span>
            <br />
            <span className="fw-bold">Course Instructor: </span>
            <span className="font-monospace">
              {courseInfo.instructorName} ({courseInfo.instructorId})
            </span>
            <br />
            <span className="fw-bold">Max Capacity: </span>
            <span className="font-monospace">{courseInfo.maxCapacity}</span>
            <br />
          </p>
          <p className="fw-bold my-0">Times:</p>
          <ul className="m-0">
            {courseInfo.courseTimes.map((time, idx) => (
              <li className="my-1" key={idx}>
                {time.day} | {convert23Time(time.start)} -{" "}
                {convert23Time(time.end)}
              </li>
            ))}
          </ul>
        </Alert>

        <BackButton to="/registrar" btnLabel="Back to Management Page" />
      </Container>
    );
  }

  return (
    <Container>
      <BackButton />
      <Card style={{ maxWidth: "50rem" }} className="mx-auto mt-3">
        <Card.Body>
          <h1 className="text-center">Create A Course</h1>
          {formErrors.length !== 0 && <FormAlerts errors={formErrors} />}

          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Course Name"
                name="courseName"
                value={courseInfo.courseName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructor</Form.Label>
              <Form.Select
                name="instructorId"
                defaultValue=""
                onChange={handleInstructor}
              >
                <option value="" disabled>
                  Select an Instructor
                </option>
                {instructors.map((instructor) => (
                  <option
                    key={instructor.id}
                    value={`${instructor.id},${instructor.name}`}
                  >
                    {instructor.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Max Capacity</Form.Label>
              <Form.Control
                type="number"
                min="5"
                name="maxCapacity"
                value={courseInfo.maxCapacity}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Times</Form.Label>
              {courseInfo.courseTimes.map((time, idx) => (
                <div key={idx}>
                  <Row className="d-flex align-items-center my-1">
                    <Col>
                      <p className="mb-0">{time.day}</p>
                      <p className="text-muted mb-0">
                        {convert23Time(time.start)} - {convert23Time(time.end)}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Button variant="danger" onClick={() => removeTime(idx)}>
                        <FaTrashAlt />
                      </Button>
                    </Col>
                  </Row>
                  {idx < courseInfo.courseTimes.length - 1 ? <hr /> : null}
                </div>
              ))}
              {/* Add course time row */}
              <Row className="d-flex align-items-center">
                <Col>
                  <Row className="d-flex mt-2 align-items-center">
                    <Col className="my-1">
                      <Form.Select
                        name="newDay"
                        value={courseInfo.newDay}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Select an Day
                        </option>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    {/* Time fields */}
                    <Col className="my-1">
                      <Form.Control
                        type="time"
                        name="newStart"
                        value={courseInfo.newStart}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col xs="auto" className="my-1">
                      —
                    </Col>
                    <Col className="my-1">
                      <Form.Control
                        type="time"
                        name="newEnd"
                        value={courseInfo.newEnd}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs="auto">
                  <Button
                    variant={addTimeError ? "danger" : "secondary"}
                    className="my-1"
                    onClick={addTime}
                  >
                    Add Time
                  </Button>
                </Col>
              </Row>
            </Form.Group>

            <Button
              style={{ width: "100%" }}
              variant="primary"
              type="submit"
              disabled={loading}
            >
              Create Course
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateCourseForm;
