import { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { GlobalContext } from "../../../GlobalContext";
import classes from "./ApplicationsPage.module.css";
import BackHeader from "../../UI/BackHeader";
import CenterSpinner from "../../UI/CenterSpinner";

const ApplicationsPage = () => {
  const { applicationsHook } = useContext(GlobalContext);
  const { applicationsList, loading, refreshApplicationsList } =
    applicationsHook;

  const applicants = applicationsList.map((application) => (
    <Link
      to={`/applications/${application.id}`}
      className={`${classes.link} ${classes.application} ${
        classes[application.type]
      }`}
      key={application.id}
    >
      {application.name}
    </Link>
  ));

  return (
    <Container>
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Applications"
      />
      {applicants.length > 0 && applicants}
      {loading && <CenterSpinner />}
      {!loading && applicants.length === 0 && <p>There are no applications.</p>}
      <div className="d-flex justify-content-center">
        <Button
          className="my-3"
          onClick={refreshApplicationsList}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
    </Container>
  );
};

export default ApplicationsPage;
