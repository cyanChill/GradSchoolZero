import { useState, useEffect } from "react";

const useInstructorFetch = () => {
  const [instructorList, setInstructorList] = useState([]);
  const [nonSuspsendedInstructors, setNonSuspendedInstructors] = useState([]);
  const [suspendedInstructors, setSuspendedInstructors] = useState([]);

  const refreshInstructorsList = async () => {
    const response = await fetch(`http://localhost:2543/users?type=instructor`);
    const data = await response.json();

    setInstructorList(data);
  };

  useEffect(() => {
    refreshInstructorsList();
  }, []);

  useEffect(() => {
    const newNonSuspdIns = instructorList.filter(
      (instructor) => !instructor.suspended
    );
    const newSuspdIns = instructorList.filter(
      (instructor) => instructor.suspended
    );
    setNonSuspendedInstructors(newNonSuspdIns);
    setSuspendedInstructors(newSuspdIns);
  }, [instructorList]);

  // Should run this if we "fire" an instructor
  const removeInstructor = (instructorId) => {
    const newInstructorList = instructorList.filter(
      (instructor) => instructor.id !== instructorId
    );
    setInstructorList(newInstructorList);

    /* Update instructors in database to indicate they're fired? instead of just deletion*/
  };

  return {
    instructorList,
    nonSuspsendedInstructors,
    suspendedInstructors,
    refreshInstructorsList,
    removeInstructor,
  };
};

export default useInstructorFetch;
