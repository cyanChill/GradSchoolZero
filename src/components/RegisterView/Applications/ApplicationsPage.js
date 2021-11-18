import { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Spinner, Button } from "react-bootstrap";
import { GlobalContext } from "../../../GlobalContext";
import classes from "./ApplicationsPage.module.css";
import BackButton from "../../UI/BackButton";

const ApplicationsPage = () => {
  const { applicationsHook } = useContext(GlobalContext);
  const { applicationsList, loading, refreshApplicationsList } =
    applicationsHook;

  const applicants = applicationsList.map((application) => (
    <div
      as={Link}
      to={`/applications/${application.id}`}
      className={`${classes.link} ${classes.application} ${
        classes[application.type]
      }`}
      key={application.id}
    >
      {application.name}
    </div>
  ));

  return (
    <Container>
      <BackButton to="/registrar" btnLabel="Back to Management Page" />
      <h1 className="text-center mt-2 mb-3">Applications</h1>
      {applicants.length > 0 && applicants}
      {loading && (
        <div className="my-3">
          <Spinner animation="border" />
        </div>
      )}
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
