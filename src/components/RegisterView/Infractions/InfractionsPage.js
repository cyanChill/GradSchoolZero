import { Container, Tabs, Tab, Button } from "react-bootstrap";
import BackButton from "../../UI/BackButton";

const InfractionsPage = () => {
  const handleRefresh = () => {};

  return (
    <Container>
      <BackButton to="/registrar" btnLabel="Back to Management Page" />
      <h1 className="my-3 text-center">Infractions Page</h1>
      <div className="d-flex justify-content-center">
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>
      <Tabs defaultActiveKey="warnings" className="mb-3">
        <Tab eventKey="warnings" title="Warnings">
          <p>Lists of Warnings Recieved</p>
        </Tab>
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
