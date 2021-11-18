import { Container } from "react-bootstrap";
import BackButton from "../../UI/BackButton";

const GradAppsPage = () => {
  return (
    <Container>
      <BackButton to="/registrar" btnLabel="Back to Management Page" />
      <h1 className="my-3 text-center">Graduation Applications Page</h1>
    </Container>
  );
};

export default GradAppsPage;
