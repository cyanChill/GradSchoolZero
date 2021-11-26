import { useContext, useState } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { Button, Container, Alert } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import RegistrarMangementPage from "../../RegisterView/Mangement/RegistrarManagementPage";
import "./Home.css";

const Home = ({ history }) => {
  const isBackgroundRed = true;
  const { userHook } = useContext(GlobalContext);
  const { isLoggedIn, user } = userHook;
  // console.log(user);

  const clearAlert = () => {
    let state = { ...history.location.state };
    delete state.alert;
    history.replace({ ...history.location, state });
  };

  const x = user.type === "student";
  if (x) {
    return <Redirect to="/profile" />;
  }

  return (
    <div>
      {(() => {
        if (user.type === "registrar") {
          return <RegistrarMangementPage />;
        } else {
          return (
            <>
              {/* <div style={{display: 'flex',  justifyContent:'center'}}>
            <h1>
            <marquee direction="down" height="50" width="550" bgcolor="" color="blue">Welcome to GradSchoolZero</marquee>
            </h1>
    
          </div> */}

              {history.location.state && history.location.state.alert ? (
                <Alert
                  variant={history.location.state.alert.type}
                  dismissible
                  onClose={clearAlert}
                  className="m-1"
                >
                  {history.location.state.alert.message}
                </Alert>
              ) : null}

              <Grid className="HomeP">
                {/* 
            <Grid
              className="HomeP"
              sx={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                padding: "7%",
                minHeight: "90vh",
                width: "100%",
                minWidth: "50px",
              }}
            >
            */}
                {isLoggedIn ? null : (
                  <div>
                    <h1>
                      <marquee
                        className="text-center"
                        direction="down"
                        height="50"
                        width="100%"
                        bgcolor=""
                        color="blue"
                      >
                        Welcome to GradSchoolZero
                      </marquee>{" "}
                    </h1>

                    <h2>
                      Applications are open for the Fall 2021 Semester for
                      Students and Instructors!
                    </h2>
                    <Button as={Link} to="/apply">
                      Apply Now
                    </Button>
                  </div>
                )}
              </Grid>

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
            </>
          );
        }
      })()}
    </div>
  );
};

export default Home;
