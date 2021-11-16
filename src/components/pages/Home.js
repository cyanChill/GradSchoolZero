import { useContext, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import { Button, Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import "./Home.css";

const Home = ({ history }) => {
  /* 
    How we access the values of the "GlobaContext" [we can specify what
    we want from the available values using object destructuring]:
  */
  const isBackgroundRed = true;
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

      {/* <div style={{display: 'flex',  justifyContent:'center'}}>
        <h1>
        <marquee direction="down" height="50" width="550" bgcolor="" color="blue">Welcome to GradSchoolZero</marquee>
        </h1>

      </div> */}

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

      <Grid
        className="HomeP text-center"
        sx={{
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          padding: "7%",
          minHeight: "90vh",
          width: "100%",
          minWidth: "50px",
          border: "1px solid black",
        }}
      >
        {isLoggedIn ? null : (
          <div>
            <h1>
              <marquee
                direction="down"
                height="50"
                width="550"
                bgcolor=""
                color="blue"
              >
                Welcome to GradSchoolZero
              </marquee>{" "}
            </h1>

            <h2>
              Applications are open for the Fall 2021 Semester for Students and
              Instructors!
            </h2>
            <Button as={Link} to="/apply">
              Apply Now
            </Button>
          </div>
        )}
      </Grid>

      <></>

      {/* <Grid container display="grid" gridAutoFlow="column" spacing={1}>
       <Grid>
           <Paper sx={{ textAlign: "center", padding: "2%", minHeight: "20vh", width: "100%", minWidth: "40px", border: "1px solid black" }} >
          a
          </Paper>
          </Grid>

          <Grid>
          <Paper sx={{ textAlign: "center", padding: "2%", minHeight: "20vh", width: "100%", minWidth: "40px", border:"1px solid black" }}  >
          b
          </Paper>
        </Grid>
       <Grid>
          <Paper sx={{ textAlign: "center", padding: "2%", minHeight: "20vh", width: "100%", minWidth: "40px", border:"1px solid black" }}  >
          c
          </Paper>
        </Grid>
  </Grid> */}

      {/* <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  {Array.from(Array(6)).map((_, index) => (
    <Grid item xs={2} sm={4} md={4} key={index}>
      <Item>xs=2</Item>
    </Grid>
  ))}
</Grid> */}
    </Container>
  );
};

export default Home;
