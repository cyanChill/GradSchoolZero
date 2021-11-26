import { useState, useEffect } from "react";
import useInfractions from "./useInfractions";

const useComplaintsFetch = () => {
  const { addWarning } = useInfractions();

  const [complaintsList, setComplaintsList] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
    Removes the complaint from the database and take certain actions based on the
    outcome decided
  */
  const resolveComplaint = async (complaintInfo, outcome) => {
    let warningInfo = null;

    if (outcome === "approve") {
      if (
        (complaintInfo.reporter.type === "instructor" ||
          complaintInfo.reporter.type === "registrar") &&
        complaintInfo.extra.outcome === "de-registration"
      ) {
        const courseRes = await fetch(
          `http://localhost:2543/grades?student.id=${complaintInfo.offender.id}&course.id=${complaintInfo.extra.courseId}`
        );
        const courseData = await courseRes.json();
        let updatedInfo = { ...courseData[0], grade: "DW" };

        await fetch(`http://localhost:2543/grades/${updatedInfo.id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(updatedInfo),
        });
      } else {
        warningInfo = {
          user: complaintInfo.offender,
          reason: "You have been warned due to a report",
          value: 1,
        };
      }
    } else if (complaintInfo.reporter.type === "instructor") {
      // If the registrar reject the complaint by an instructor
      warningInfo = {
        user: complaintInfo.reporter,
        reason: "You have been warned due to a false report",
        value: 1,
      };
    }

    if (warningInfo) {
      await addWarning(warningInfo.user, warningInfo.reason, warningInfo.value);
    }

    // Remove complaint from complaints database
    const res = await fetch(
      `http://localhost:2543/complaints/${complaintInfo.id}`,
      {
        method: "DELETE",
      }
    );

    setComplaintsList((prev) =>
      prev.filter((complaint) => complaint.id !== complaintInfo.id)
    );

    return res.ok;
  };

  /*
    Refresh the local instance of the complaint list (to prevent constant 
    fetching)
  */
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
    resolveComplaint,
    refreshComplaintsList,
  };
};

export default useComplaintsFetch;
