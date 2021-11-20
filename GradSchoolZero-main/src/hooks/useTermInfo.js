import { useState, useEffect } from "react";

const useTermInfo = () => {
  const [termInfo, setTermInfo] = useState({
    phase: "",
    semester: "",
    year: "",
  });
  const [loading, setIsLoading] = useState(false);

  const nextPhase = () => {
    /* 
        Update the phase - if current phase is "grading" period, goto course set-up and move to the next semester
        - Send an update request to the server

        Depending on the phase, we may need to do some checks such as:
        - suspending users
        - issuing warnings (if we goto the course setup period and a course doesn't have all the grades in)
        - remove suspensions if they're over
        - Automatic honor student assignment
        - Automatic termination (gpa < 2 or failed the same course twice)

        - Prevent going to course registration phase if there's no courses added from class set-up
      */
  };

  useEffect(() => {
    /* Fetch term info from server */
  }, []);

  return { termInfo, loading, nextPhase };
};

export default useTermInfo;
