import { Link } from "react-router-dom";
import classes from "./LinkBoxWidget.module.css";

const LinkBoxWidget = ({ to, className, text }) => {
  return (
    <Link
      to={to}
      className={`${classes.link} ${classes.application} ${className}`}
    >
      {text}
    </Link>
  );
};

export default LinkBoxWidget;
