import { Button } from "react-bootstrap";
import { BiCheck, BiX } from "react-icons/bi";
import DualColWidget from "../DualColWidget/DualColWidget";

const AcceptRejectWidget = ({ leftCol, handleAccept, handleReject }) => {
  const rightCol = (
    <>
      <Button variant="success" className="mx-1" onClick={handleAccept}>
        <BiCheck />
      </Button>
      <Button variant="danger" className="mx-1" onClick={handleReject}>
        <BiX />
      </Button>
    </>
  );

  return (
    <DualColWidget
      leftCol={{ body: leftCol }}
      rightCol={{
        body: rightCol,
        breakPoints: { sm: "auto" },
        className: "text-center",
      }}
    />
  );
};

export default AcceptRejectWidget;
