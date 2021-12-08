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
import useInfractions from "../../../hooks/useInfractions";
import HorizFormInputField from "../../UI/HorizFormInputField";

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
  const {
    getUserInfoFromId,
    user,
    applyForGrad,
    refreshUserInfo,
    removeUser,
    getUserInfractions,
  } = userHook;
  const { termInfo } = termHook;
  const { submitComplaint, addWarning } = useInfractions();

  const userId = id || user.id;
  const [profileInfo, setProfileInfo] = useState(defaultInfo);
  const [organizedData, setOrganizedData] = useState(defaultOrgInfo);
  const [loading, setLoading] = useState(true);
  const [canSeeAll, setCanSeeAll] = useState(
    user.type === "registrar" || !id ? true : false
  );
  const [error, setError] = useState(false);
  const [alertObj, setAlertObj] = useState(null);
  const [userInfracInfo, setUserInfracInfo] = useState(null);

  useEffect(() => {
    const populateData = async () => {
      setLoading(true);
      const data = await getUserInfoFromId(userId);

      if (data === "error") {
        setError(true);
        setLoading(false);
        return;
      }

      setProfileInfo({
        ...data,
        userData: { ...data.userData },
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

      if (!id) {
        const userInfractions = await getUserInfractions(userId);
        setUserInfracInfo(userInfractions);
      }

      setLoading(false);
    };

    populateData();
  }, []);

  const handleApplyGrad = async () => {
    await applyForGrad(user.id);
    await refreshUserInfo();

    setAlertObj({
      type: "success",
      title: "Success",
      message: "Successfully Applied For Graduation",
    });
  };

  const submitReportHandler = async (reason) => {
    const extra = {
      outcome: "warning",
    };
    const offender = {
      id: userId,
      name: profileInfo.userData.name,
      type: profileInfo.userData.type,
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

  const submitRemovalHandler = async () => {
    await removeUser(userId);

    setAlertObj({
      type: "success",
      title: "Success",
      message: `Successfully ${
        profileInfo.userData.type === "student" ? "Expell" : "Fire"
      } User`,
    });

    setProfileInfo((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        removed: true,
      },
    }));
  };

  const submitWarningHandler = async (reason, value) => {
    const userInfo = {
      id: userId,
      name: profileInfo.userData.name,
    };
    await addWarning(userInfo, reason, value);

    setAlertObj({
      type: "success",
      title: "Success",
      message: "Successfully submitted warning to user",
    });
  };

  if (loading) {
    return <CenterSpinner />;
  }

  if (!id && user.type === "registrar") {
    return <Redirect to="/registrar" />;
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

  let body = null;

  if (profileInfo.userData.type === "student") {
    body = (
      <>
        <h3>
          Current GPA:{" "}
          <span className="font-monospace text-muted">
            {profileInfo.userData.GPA || "No GPA Avaliable"}
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
  }

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

  let graduatedInfo = null;

  if (!id && user.graduated) {
    graduatedInfo = (
      <Alert variant="success" className="my-3">
        <Alert.Heading>You have graduated from the program</Alert.Heading>
      </Alert>
    );
  }

  let removedInfo = null;

  if (!id && user.removed) {
    removedInfo = (
      <Alert variant="danger" className="my-3">
        <Alert.Heading>
          You are {user.type === "student" ? "expelled" : "fired"}
        </Alert.Heading>
      </Alert>
    );
  }

  let suspendedInfo = null;

  if (!id && user.suspended) {
    suspendedInfo = (
      <Alert variant="danger" className="my-3">
        <Alert.Heading>You are currently suspended</Alert.Heading>
      </Alert>
    );
  }

  let formattedWarningInfo = null;

  if (userInfracInfo) {
    const { warningCnt, latest3Warnings } = userInfracInfo;

    let headingMsg = `You currently have ${warningCnt} warnings. You are ${
      3 - warningCnt
    } warnings away from being suspended.`;
    if (warningCnt >= 3) {
      headingMsg = `You currently have ${warningCnt} warnings. You will be suspended in the next semester`;
    }

    formattedWarningInfo = (
      <Alert variant={warningCnt > 1 ? "danger" : "warning"} className="my-3">
        <Alert.Heading>{headingMsg}</Alert.Heading>
        {warningCnt > 0 && (
          <>
            <p className="my-2">Your current warnings include:</p>
            {latest3Warnings.map((warning) => (
              <p key={warning.id} className="my-2 text-muted font-monospace">
                ({new Date(warning.date).toDateString()}) {warning.reason}
              </p>
            ))}
          </>
        )}
      </Alert>
    );
  }

  return (
    <Container>
      {!id && alertObj && (
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

      {!id && user.specReg && (
        <Alert className="my-3" variant="success">
          You current can enroll into classes as one of your class has been
          canceled.
        </Alert>
      )}

      {/* Display conditionally information */}
      {!id &&
        (graduatedInfo || removedInfo || suspendedInfo || formattedWarningInfo)}

      {body}

      {/* Requires user to be logged in to see the following: */}
      {user.name !== "" && (
        <div className="d-flex justify-content-center align-items-center my-3 gap-2">
          {/* Apply for graduation button */}
          {!id &&
            !user.applyGrad &&
            !user.graduated &&
            !user.removed &&
            user.type === "student" && (
              <Button onClick={handleApplyGrad}>Apply For Graduation</Button>
            )}

          {/* Buttons will appear if user isn't expelled/fired and hasn't graduated*/}
          {!profileInfo.userData.removed &&
            !profileInfo.userData.graduated &&
            profileInfo.userData.type !== "registrar" && (
              <>
                {/* Report user button */}
                {id && id !== user.id && (
                  <ReportButtonModal submitHandler={submitReportHandler} />
                )}

                {/* Registrar Only: */}
                {user.type === "registrar" && (
                  <>
                    {/* Remove user button*/}
                    {
                      <RemoveUserButtonModal
                        submitHandler={submitRemovalHandler}
                        profileUserType={profileInfo.userData.type}
                      />
                    }

                    {/* Warn user button*/}
                    {
                      <WarnUserButtonModal
                        submitHandler={submitWarningHandler}
                      />
                    }
                  </>
                )}
              </>
            )}
        </div>
      )}
    </Container>
  );
};

const createWidgetGroups = (arr, canSeeAll) => {
  return arr.map((course) => {
    const courseId = course.grade !== undefined ? course.course.id : course.id;
    const code =
      course.grade === undefined ? course.section : course.course.code;

    return (
      <Col key={course.id} md="6" lg="6" className="my-2">
        <Widget
          key={course.id}
          name={`[${code}] ${course.course.name}`}
          courseId={courseId}
          grade={course.grade}
          canSeeAll={canSeeAll}
        />
      </Col>
    );
  });
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

const RemoveUserButtonModal = ({ submitHandler, profileUserType }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = () => {
    handleClose();
    submitHandler();
  };

  return (
    <>
      <Button variant="dark" onClick={() => setShow(true)}>
        {profileUserType === "student" ? "Expell" : "Fire"} User
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            {profileUserType === "student" ? "Expell" : "Fire"} User?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <span className="text-danger">This is irreversible.</span>
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

const WarnUserButtonModal = ({ submitHandler }) => {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [warningCnt, setWarningCnt] = useState(1);

  const handleClose = () => {
    setShow(false);
    setReason("");
    setReasonError(false);
  };

  const handleSubmit = () => {
    setReasonError(false);

    if (reason.trim().length < 20) {
      setReasonError(true);
      return;
    }

    handleClose();
    submitHandler(reason, warningCnt);
  };

  return (
    <>
      <Button variant="warning" onClick={() => setShow(true)}>
        Give Warning
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit a Warning</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label column sm="auto">
              Warning Reason:
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={reasonError ? "is-invalid" : ""}
            />
            <Form.Control.Feedback type="invalid">
              Please write some more in your reason for this warning.
            </Form.Control.Feedback>
          </Form.Group>

          <HorizFormInputField
            label="Warning Amount"
            inputField={{
              type: "number",
              value: warningCnt,
              onChange: (e) => setWarningCnt(e.target.value),
              required: true,
              min: 1,
              max: 3,
              step: 1,
            }}
          />
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
