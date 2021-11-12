import { Route, Redirect } from "react-router-dom";

const RegistrarRoute = ({ children, isAuthenticated, user, ...rest }) => {
  /* Only allow registrar users to access*/
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated && user.type === "registrar" ? (
          children
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
