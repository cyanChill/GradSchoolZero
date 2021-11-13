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
  const checkEmailIsUsed = async (email) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/applications?email=${formattedEmail}`,
      {
        method: "GET",
      }
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

    return res.status === 201;
  };

  const getApplications = async () => {
    const res = await fetch("http://localhost:2543/applications");
    const data = await res.json();
    return data;
  };

  const removeApplication = async (applicationId) => {
    await fetch(`http://localhost:2543/applications/${applicationId}`, {
      method: "DELETE",
    });
  };

  return {
    checkEmailIsUsed,
    addApplication,
    getApplications,
    removeApplication,
  };
};

export default useApplicationFetch;
