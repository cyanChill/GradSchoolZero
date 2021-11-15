import { useContext, cloneElement } from "react";
import { Route, Redirect } from "react-router-dom";
import { GlobalContext } from "../../GlobalContext";

const PublicRoute = ({ children, location, ...rest }) => {
  const { isLoggedIn } = useContext(GlobalContext);
  /* Only allow outside users to access*/
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          cloneElement(children, { ...children.props, location })
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PublicRoute;
