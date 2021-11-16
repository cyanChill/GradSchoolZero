import { useState, useEffect } from "react";

/* 
    Data is in the form of:
    {
        id: "....",
        type: "student" or "instructor",
        name: "....",
        email: email in lowercase,
        gpa: String [for type="student"],
        description: String [for type="instructor"]
    }
*/

const useApplicationFetch = () => {
  const [applicationsList, setApplicationsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkAppEmailIsUsed = async (email) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/applications?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length > 0) return true;
    return false;
  };

  const addApplication = async (application) => {
    const res = await fetch("http://localhost:2543/applications", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(application),
    });
    setApplicationsList((prev) => [...prev, application]);

    return res.status === 201;
  };

  const getApplicationInfo = async (applicationId) => {
    const res = await fetch(
      `http://localhost:2543/applications/${applicationId}`
    );
    const data = await res.json();
    return data;
  };

  const removeApplication = async (applicationId) => {
    await fetch(`http://localhost:2543/applications/${applicationId}`, {
      method: "DELETE",
    });
    setApplicationsList((prev) =>
      prev.filter((application) => application.id !== applicationId)
    );
  };

  const refreshApplicationsList = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:2543/applications");
    const data = await res.json();
    setApplicationsList(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshApplicationsList();
  }, []);

  return {
    applicationsList,
    loading,
    checkAppEmailIsUsed,
    addApplication,
    getApplicationInfo,
    removeApplication,
    refreshApplicationsList,
  };
};

export default useApplicationFetch;
