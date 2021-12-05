import { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router";
import { GlobalContext } from "../../GlobalContext";
import useCourseFetch from "../../hooks/useCourseFetch";
import { Container } from "react-bootstrap";
import CenterSpinner from "../UI/CenterSpinner";

const RefreshStats = () => {
  const { userHook, instructorHook } = useContext(GlobalContext);
  const { updateAllStudGPA } = userHook;
  const { updateAllInstrucRating } = instructorHook;
  const { updateAllClassRatings } = useCourseFetch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateData = async () => {
      setLoading(true);
      await updateAllStudGPA();
      await updateAllInstrucRating();
      await updateAllClassRatings();
      setLoading(false);
    };

    updateData();
  }, []);

  if (loading) {
    return (
      <Container>
        <CenterSpinner />
      </Container>
    );
  }

  return <Redirect to="/" />;
};

export default RefreshStats;
