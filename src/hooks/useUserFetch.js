import { useState, useEffect } from "react";

const useUserFetch = () => {
  const [user, setUser] = useState({
    name: "",
    type: "",
    suspended: false,
    graduated: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setIsLoading] = useState(false);

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

  const login = (email, password) => {
    /* 
        Attempt Login With Credentials 
        - Send login request to server
        - Return error if fails
        - Returns msg success if success
      */
  };

  const logout = () => {
    /* 
      Attempt Logout With Credentials 
      - Send logout request to server (clear user access to server)
      - Return error if fails
      - Returns msg success if success
    */
  };

  useEffect(() => {
    if (isLoggedIn) {
      /* 
            Fetch user for server and update user object
        */
    } else {
      /* 
            Clear user object
        */
    }
  }, [isLoggedIn]);

  return { login, logout, user, loading };
};

export default useUserFetch;
