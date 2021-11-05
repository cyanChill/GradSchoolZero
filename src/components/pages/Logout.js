import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../GlobalContext";
import { Redirect } from "react-router";
import { Spinner, Container } from "react-bootstrap";

const Logout = () => {
  const { setIsLoggedIn, setUser } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* Also logout from the server */

    const timeout = setTimeout(() => {
      setLoading(false);
      setUser({});
      setIsLoggedIn(false);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Container className="text-center">
      {loading ? (
        <Spinner animation="border" className="mx-auto mt-5" />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: {
              alert: { message: "You have successfully logged out.", type: "success" },
            },
          }}
        />
      )}
    </Container>
  );
};

export default Logout;
