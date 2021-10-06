import { useContext } from "react";
import { GlobalContext } from "../../GlobalContext";

const About = () => {
  /* 
    How we access the values of the "GlobaContext" [we can specify what
    we want from the available values using object destructuring]:
  */
  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <>
      <h1>This is our About Component</h1>
      {isLoggedIn ? (
        <p>This is shown if we're logged in</p>
      ) : (
        <p>This is shown if we're not logged in</p>
      )}
    </>
  );
};

export default About;
