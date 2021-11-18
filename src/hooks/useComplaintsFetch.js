import { useState, useEffect } from "react";

const useComplaintsFetch = () => {
  const [complaintsList, setComplaintsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const addComplaint = (complaintInfo) => {
    /* 
      Update local complaint list, update complaint list in server (add entry)
    */
  };

  const resolveComplaint = (id, outcome) => {
    /* 
      Update local complaint list, update complaint list in server (add entry)
    */
    if (outcome === "approve") {
      // warn the offender
      // deregister if the reporter is an instructor and they select the deregister option
    } else {
      // warn the reporter if they're an instructor
    }

    console.log(outcome);
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
