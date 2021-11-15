import { useContext, cloneElement } from "react";
import { Route, Redirect } from "react-router-dom";
import { GlobalContext } from "../../GlobalContext";

const RegistrarRoute = ({ children, location, ...rest }) => {
  const { isLoggedIn, user } = useContext(GlobalContext);
  /* Only allow registrar users to access*/
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn && user.type === "registrar" ? (
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

export default RegistrarRoute;
