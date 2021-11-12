import { useState, useEffect } from "react";

const useInstructorFetch = () => {
  const [instructorList, setInstructorList] = useState([]);
  const [nonSuspsendedInstructors, setNonSuspendedInstructors] = useState([]);
  const [suspendedInstructors, setSuspendedInstructors] = useState([]);

  useEffect(() => {
    /* Fetch instructor names, id from server */
    const dummyData = [
      {
        id: 1,
        name: "John Doe",
        suspended: false,
      },
      {
        id: 2,
        name: "Jane Doe",
        suspended: false,
      },
      {
        id: 3,
        name: "John Smith",
        suspended: true,
      },
    ];

    setInstructorList(dummyData);
  }, []);

  useEffect(() => {
    const newNonSuspdIns = instructorList.filter((instructor) => !instructor.suspended);
    const newSuspdIns = instructorList.filter((instructor) => instructor.suspended);
    setNonSuspendedInstructors(newNonSuspdIns);
    setSuspendedInstructors(newSuspdIns);
  }, [instructorList]);

  // Should run this if we "fire" an instructor
  const removeInstructor = (instructorId) => {
    const newInstructorList = instructorList.filter((instructor) => instructor.id !== instructorId);
    setInstructorList(newInstructorList);
  };

  return { instructorList, nonSuspsendedInstructors, suspendedInstructors, removeInstructor };
};

export default useInstructorFetch;
