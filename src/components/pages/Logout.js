import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../GlobalContext";
import { Redirect } from "react-router";
import { Spinner, Container } from "react-bootstrap";

const Logout = () => {
  const { setIsLoggedIn } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoggedIn(false);
      setLoading(false);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Container className="text-center">
      {loading ? <Spinner animation="border" className="mx-auto mt-5" /> : <Redirect to="/" />}
    </Container>
  );
};

export default Logout;
