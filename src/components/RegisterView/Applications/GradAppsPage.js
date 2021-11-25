import { useContext, useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import BackHeader from "../../UI/BackHeader";
import AcceptRejectWidget from "../../UI/AcceptRejectWidget/AcceptRejectWidget";
import { GlobalContext } from "../../../GlobalContext";
import classes from "./GradAppsPage.module.css";

const GradAppsPage = () => {
  const { userHook } = useContext(GlobalContext);
  const { getAllGradApp, handleGradApp } = userHook;

  const [gradApplic, setGradApplic] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshGradAppList = async () => {
    setLoading(true);
    const apps = await getAllGradApp();
    setGradApplic(apps);
    setLoading(false);
  };

  const handleResult = async (userInfo, resultType) => {
    const info = { id: userInfo.id, name: userInfo.name };
    await handleGradApp(info, resultType);
    setGradApplic((prev) =>
      prev.filter((gradApp) => gradApp.id !== userInfo.id)
    );
  };

  useEffect(() => {
    refreshGradAppList();
  }, []);

  const body =
    gradApplic.length === 0 ? (
      <p className="text-center">
        There are currently no applications for graduation.
      </p>
    ) : (
      gradApplic.map((user) => (
        <AcceptRejectWidget
          key={user.id}
          leftCol={
            <Link to={`/profile/${user.id}`} className={classes.link}>
              {user.name}
            </Link>
          }
          handleAccept={() => handleResult(user, "accept")}
          handleReject={() => handleResult(user, "reject")}
        />
      ))
    );

  return (
    <Container>
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Graduation Applications"
      />

      {body}

      <div className="d-flex justify-content-center align-items-center my-3">
        <Button
          className="my-3"
          onClick={refreshGradAppList}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
    </Container>
  );
};

export default GradAppsPage;
