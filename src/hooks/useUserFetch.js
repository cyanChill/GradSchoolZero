import { useState, useEffect } from "react";

const defaultUserInfo = {
  id: "",
  name: "",
  email: "",
  type: "",
  suspended: false,
  graduated: false,
};

const useUserFetch = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") ? true : false
  );
  const [user, setUser] = useState(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : defaultUserInfo
  );

  /* 
    Also have functions to get other info on the user such as: 
    - classes currently taking
    - grades/previous courses (can calculate gpa with this)
    - reviews given

    (instructors)
    - courses currently teaching
    - courses previously taught
    - rating
  */

  // Function to see if an email is being used by a different user
  const checkUserEmailIsUsed = async (email) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/users?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length > 0) return true;
    return false;
  };

  // Function to create a user
  const createUser = async (userInfo) => {
    const res = await fetch("http://localhost:2543/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    return res.status === 201;
  };

  // Function to login a user
  const login = async (email, password) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/users?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length === 0) return false;

    if (data[0].password === password) {
      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", true);
      setUserInfo(data[0]);
      return true;
    }
    return false;
  };

  // Function to logout a user
  const logout = () => {
    setIsLoggedIn(false);
    setUser(defaultUserInfo);
    sessionStorage.removeItem("isLoggedIn");
    return true;
  };

  // Helper function to remove password information from user object we'll be saving
  const setUserInfo = (data) => {
    const userInfo = { ...data };
    delete userInfo.password;
    setUser(userInfo);
  };

  // Function to change the password of the current user (stored in the user state)
  const changePassword = async (oldPass, newPass) => {
    const res = await fetch(`http://localhost:2543/users/${user.id}`);
    const data = await res.json();

    if (oldPass === data.password) {
      if (!newPass) {
        return { type: "danger", message: "New Password Must Not Be Empty" };
      }

      const res = await fetch(`http://localhost:2543/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          password: newPass,
        }),
      });

      if (!res.ok) {
        return {
          type: "danger",
          message: "An Error Has Occurred When Changing Your Password",
        };
      }

      return { type: "success", message: "Successfully Changed Password" };
    }

    return { type: "danger", message: "Incorrect Old Password" };
  };

  // Get user-related information from their id
  const getUserInfoFromId = async (id) => {
    // Get user info
    const userRes = await fetch(`http://localhost:2543/users/${id}`);

    if (!userRes.ok) return "error";

    const userData = await userRes.json();

    // Will get the grades (which includes courses currently taken)
    const gradeRes = await fetch(
      `http://localhost:2543/grades?studentInfo.id=${id}`
    );
    const gradeData = await gradeRes.json();

    // Get courses taught
    const taughtRes = await fetch(
      `http://localhost:2543/courses?courseInfo.instructorId=${id}`
    );
    const taughtData = await taughtRes.json();

    return {
      userData: {
        name: userData.name,
        type: userData.type,
      },
      gradeData,
      taughtData,
    };
  };

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return {
    isLoggedIn,
    user,
    login,
    logout,
    checkUserEmailIsUsed,
    createUser,
    changePassword,
    getUserInfoFromId,
  };
};

export default useUserFetch;
