import { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Spinner, Button } from "react-bootstrap";
import { GlobalContext } from "../../../GlobalContext";
import classes from "./ApplicationsPage.module.css";
import BackButton from "../../UI/BackButton";

const ApplicationsPage = () => {
  const { applicationsList, loading, refreshApplicationsList } =
    useContext(GlobalContext);

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
    <Container className="d-flex flex-column align-items-center">
      <BackButton
        className="align-self-start"
        to="/registrar"
        btnLabel="Back to Management Page"
      />
      <h1 className="text-center mt-2 mb-3">Applications</h1>
      {applicants.length > 0 && applicants}
      {loading && (
        <div className="my-3">
          <Spinner animation="border" />
        </div>
      )}
      {!loading && applicants.length === 0 && <p>There are no applications.</p>}
      <Button
        className="my-3"
        onClick={refreshApplicationsList}
        disabled={loading}
      >
        Refresh
      </Button>
    </Container>
  );
};

export default ApplicationsPage;
