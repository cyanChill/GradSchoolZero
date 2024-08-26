import { useHistory, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const BackButton = (props) => {
  const history = useHistory();
  const btnLabel = props.btnLabel || "Back";

  if (props.to) {
    return (
      <Button as={Link} className={`mt-3 ${props.className}`} to={props.to}>
        {btnLabel}
      </Button>
    );
  }

  return (
    <Button
      className={`mt-3 ${props.className}`}
      onClick={() => history.goBack()}
    >
      {btnLabel}
    </Button>
  );
};

export default BackButton;
