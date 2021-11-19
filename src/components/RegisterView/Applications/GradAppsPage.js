import { Container } from "react-bootstrap";
import BackHeader from "../../UI/BackHeader";

const GradAppsPage = () => {
  return (
    <Container>
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Graduation Applications Page"
      />
    </Container>
  );
};

export default GradAppsPage;
