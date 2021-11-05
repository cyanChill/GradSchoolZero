import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ children, isAuthenticated, ...rest }) => {
  /* Only allow outside users to access*/
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuthenticated ? (
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

export default PublicRoute;
