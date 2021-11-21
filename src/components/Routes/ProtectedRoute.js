import { useContext, cloneElement } from "react";
import { Route, Redirect } from "react-router-dom";
import { GlobalContext } from "../../GlobalContext";

const ProtectedRoute = ({ children, location, ...rest }) => {
  const { userHook } = useContext(GlobalContext);
  const { isLoggedIn } = userHook;
  /* Only allow logged in users to access*/
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          cloneElement(children, { ...children.props, location })
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
