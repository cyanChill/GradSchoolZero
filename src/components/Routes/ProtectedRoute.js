import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated, ...rest }) => {
  /* Only allow logged in users to access*/
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
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
