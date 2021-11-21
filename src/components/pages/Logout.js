import { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router";

import { GlobalContext } from "../../GlobalContext";

const Logout = () => {
  const { userHook } = useContext(GlobalContext);
  const { isLoggedIn, logout } = userHook;
  const [validLogout, setValidLogout] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      logout();
      setValidLogout(true);
    }
  }, []);

  if (!isLoggedIn && validLogout) {
    return <Redirect to="/" />;
  }

  return (
    <Redirect
      to={{
        pathname: "/",
        state: {
          alert: {
            message: "You have successfully logged out.",
            type: "success",
          },
        },
      }}
    />
  );
};

export default Logout;
