import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";

const Profile = () => {
  /* 
    How we access the values of the "GlobaContext" [we can specify what
    we want from the available values using object destructuring]:
  */
  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <div>
      <h1>This is our Profile Component</h1>
      {isLoggedIn ? (
        <p>This is shown if we're logged in</p>
      ) : (
        <p>This is shown if we're not logged in</p>
      )}
    </div>
  );
};

export default Profile;
