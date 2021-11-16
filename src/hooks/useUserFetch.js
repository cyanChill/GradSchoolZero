import { useState, useEffect } from "react";

const defaultUserInfo = {
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

  const checkUserEmailIsUsed = async (email) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/users?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length > 0) return true;
    return false;
  };

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

  const logout = () => {
    setIsLoggedIn(false);
    setUser(defaultUserInfo);
    sessionStorage.removeItem("isLoggedIn");
    return true;
  };

  const setUserInfo = (data) => {
    const userInfo = { ...data };
    delete userInfo.password;
    setUser(userInfo);
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
  };
};

export default useUserFetch;
