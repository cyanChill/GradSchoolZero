import { useContext } from "react";
import { GlobalContext } from "../../../GlobalContext";

import { Container } from "react-bootstrap";

const Classes = () => {
  /* 
    We'll have a different component for the individual class information
  */
  return (
    <Container>
      <h1>This is our Classes Component</h1>
      {/* list courses for current semester */}
    </Container>
  );
};

export default Classes;
