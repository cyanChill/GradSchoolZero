import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useInfractions from "./useInfractions";

const useComplaintsFetch = () => {
  const { addWarning } = useInfractions();

  const [complaintsList, setComplaintsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const addComplaint = async (complaintInfo) => {
    /* 
      Update local complaint list, update complaint list in server (add entry)
    */
  };

  const resolveComplaint = async (complaintInfo, outcome) => {
    let warningInfo = null;

    if (outcome === "approve") {
      if (
        complaintInfo.reporter.userType === "instructor" &&
        complaintInfo.outcome === "de-registration"
      ) {
        /* 
          De-register student from course 
            - Find courses student is in and the course the instructor teaches
            - Give the student a grade of DW (disciplinary withdrawal) & unenroll student from course
        */
      } else {
        warningInfo = {
          id: uuidv4(),
          date: new Date(),
          userId: complaintInfo.offender.id,
          reason: "You have been warned due to a report",
          value: 1,
        };
      }
    } else if (complaintInfo.reporter.userType === "instructor") {
      // If the registrar reject the complaint by an instructor
      warningInfo = {
        id: uuidv4(),
        date: new Date(),
        userId: complaintInfo.reporter.id,
        reason: "You have been warned due to a false report",
        value: 1,
      };
    }

    if (warningInfo) {
      await addWarning(warningInfo);
    }

    // Remove complaint from complaints database
    await fetch(`http://localhost:2543/complaints/${complaintInfo.id}`, {
      method: "DELETE",
    });

    setComplaintsList((prev) =>
      prev.filter((complaint) => complaint.id !== complaintInfo.id)
    );
  };

  const refreshComplaintsList = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:2543/complaints");
    const data = await res.json();
    setComplaintsList(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshComplaintsList();
  }, []);

  return {
    complaintsList,
    loading,
    addComplaint,
    resolveComplaint,
    refreshComplaintsList,
  };
};

export default useComplaintsFetch;
