import { useContext, useState } from "react";
import { GlobalContext } from "../../GlobalContext";

import { Button, Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = ({ history }) => {
  /* 
    How we access the values of the "GlobaContext" [we can specify what
    we want from the available values using object destructuring]:
  */
  const { isLoggedIn, user, setUser, termInfo, setTermInfo } =
    useContext(GlobalContext);

  const clearAlert = () => {
    let state = { ...history.location.state };
    delete state.alert;
    history.replace({ ...history.location, state });
  };

  const setPhase = (phase) => {
    setTermInfo({
      ...termInfo,
      phase,
    });
  };

  return (
    <Container>
      {history.location.state && history.location.state.alert ? (
        <Alert
          variant={history.location.state.alert.type}
          className="mt-2"
          dismissible
          onClose={clearAlert}
        >
          {history.location.state.alert.message}
        </Alert>
      ) : null}

      <h1 className="mt-2">Welcome to GradSchoolZero</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti hic
        sequi nobis, impedit corporis ut quod. Repellat aut ratione dolorem
        provident error maiores repudiandae minus asperiores, temporibus et est
        quae deserunt fuga neque officia facere perspiciatis optio obcaecati
        enim. Necessitatibus explicabo dolores optio nobis quibusdam non aliquam
        omnis tempore accusamus at blanditiis reprehenderit distinctio,
        repellendus, laboriosam modi similique rem voluptatibus commodi error
        recusandae eaque ipsam veniam iste! Error id, quis iste a quisquam non,
        debitis, atque repudiandae voluptate sequi dolorem perferendis
        cupiditate placeat quia beatae suscipit temporibus similique animi quos
        minus voluptatum magnam quidem! Accusantium facere possimus quas
        recusandae provident.
      </p>

      {!isLoggedIn ? null : (
        <>
          <h2>Temporary:</h2>
          <div className="d-flex gap-3 flex-wrap justify-content-center align-items-center my-2">
            <Button onClick={() => setUser({ ...user, type: "" })}>
              Clear User Type
            </Button>
            <Button
              onClick={() => setUser({ ...user, type: "student" })}
              disabled={user.type === "student" ? true : false}
            >
              Set User as Student
            </Button>
            <Button
              onClick={() => setUser({ ...user, type: "instructor" })}
              disabled={user.type === "instructor" ? true : false}
            >
              Set User as Instructor
            </Button>
            <Button
              onClick={() => setUser({ ...user, type: "registrar" })}
              disabled={user.type === "registrar" ? true : false}
            >
              Set User as Registrar
            </Button>
          </div>
          <div className="d-flex gap-3 flex-wrap justify-content-center align-items-center my-2">
            <Button
              variant="secondary"
              onClick={() => setPhase("set-up")}
              disabled={termInfo.phase === "set-up" ? true : false}
            >
              Class Set-Up Period
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPhase("registration")}
              disabled={termInfo.phase === "registration" ? true : false}
            >
              Course Registration period
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPhase("running")}
              disabled={termInfo.phase === "running" ? true : false}
            >
              Class Running Period
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPhase("grading")}
              disabled={termInfo.phase === "grading" ? true : false}
            >
              Grading Period
            </Button>
          </div>
        </>
      )}

      {isLoggedIn ? null : (
        <div>
          <h2>
            Applications are open for the Fall 2021 Semester for Students and
            Instructors!
          </h2>
          <Button as={Link} to="/apply">
            Apply Now
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
