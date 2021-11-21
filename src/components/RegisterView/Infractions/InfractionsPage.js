import { Container, Tabs, Tab, Button } from "react-bootstrap";
import BackHeader from "../../UI/BackHeader";

const InfractionsPage = () => {
  const handleRefresh = () => {};

  return (
    <Container>
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Infractions"
      />
      <div className="d-flex justify-content-center">
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>
      <Tabs defaultActiveKey="suspended" className="mb-3">
        <Tab eventKey="suspended" title="Suspended">
          <p>List of Suspended Users</p>
        </Tab>
        <Tab eventKey="fired" title="Expelled/Fired">
          <p>List of Fired or Expelled Users</p>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default InfractionsPage;
