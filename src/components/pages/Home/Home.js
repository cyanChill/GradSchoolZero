import { useContext } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { Button, Alert } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { Grid } from "@mui/material";
import RegistrarMangementPage from "../../RegisterView/Mangement/RegistrarManagementPage";
import "./Home.css";
import HomePageCard from "../../UI/HomePageCard/HomePageCard";

const Home = ({ history }) => {
  const { userHook } = useContext(GlobalContext);
  const { isLoggedIn, user } = userHook;

  const clearAlert = () => {
    let state = { ...history.location.state };
    delete state.alert;
    history.replace({ ...history.location, state });
  };

  return (
    <div>
      {(() => {
        if (user.type === "registrar") {
          return <RegistrarMangementPage />;
        } else if (user.type === "student" || user.type === "instructor") {
          return <Redirect to="/profile" />;
        } else {
          return (
            <>
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
                {isLoggedIn ? null : (
                  <div>
                    <h1 className="font">
                      <marquee
                        className="text-center text-black"
                        direction="down"
                        height="50"
                        width="100%"
                        bgcolor=""
                        color="blue"
                      >
                        Welcome to GradSchoolZero
                      </marquee>{" "}
                    </h1>
                    <h2 className="font text-black">
                      Applications are open for the Fall 2021 Semester for
                      Students and Instructors!
                    </h2>
                    <Button as={Link} to="/apply">
                      Apply Now
                    </Button>
                  </div>
                )}
                <HomePageCard />
              </Grid>
            </>
          );
        }
      })()}
    </div>
  );
};

export default Home;
