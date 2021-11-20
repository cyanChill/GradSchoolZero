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

  // Check if email is used in an unviewed application
  const checkAppEmailIsUsed = async (email) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/applications?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length > 0) return true;
    return false;
  };

  // Add an application to the database
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

  // Get the information on the application based on it's id
  const getApplicationInfo = async (applicationId) => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:2543/applications/${applicationId}`
    );
    const data = await res.json();
    setLoading(false);
    return data;
  };

  // Remove the application from the database based on it's id
  const removeApplication = async (applicationId) => {
    await fetch(`http://localhost:2543/applications/${applicationId}`, {
      method: "DELETE",
    });
    setApplicationsList((prev) =>
      prev.filter((application) => application.id !== applicationId)
    );
  };

  // Refresh the local instance of the application list (saved to reduce fetching)
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
