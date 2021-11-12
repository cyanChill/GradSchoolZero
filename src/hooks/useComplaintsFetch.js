import { useState, useEffect } from "react";

const useComplaintsFetch = () => {
  const [complaintsList, setComplaintsList] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const addComplaint = (complaintInfo) => {
    /* 
      Update local complaint list, update complaint list in server (add entry)
    */
  };

  useEffect(() => {
    /* Fetch list of complaints from server */
  }, []);

  return { complaintsList, loading, addComplaint };
};

export default useComplaintsFetch;
