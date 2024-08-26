import { Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GrDocumentMissing } from "react-icons/gr";

const NotFound = () => {
  return (
    <Container>
      <Card style={{ maxWidth: "50rem" }} className="d-flex flex-column text-center mx-auto mt-5">
        <Card.Body>
          <GrDocumentMissing style={{ fontSize: 96 }} />
          <h1 className="mt-2">404 - Page not found</h1>
          <p>
            The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </p>
          <Button as={Link} to="/">
            Go To Homepage
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotFound;
