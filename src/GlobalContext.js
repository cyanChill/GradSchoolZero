import { useState, useEffect, createContext } from "react";
import useUserFetch from "./hooks/useUserFetch";

const defaultUserInfo = {
  name: "",
  email: "",
  type: "",
  suspended: false,
  graduated: false,
};

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const {
    login: checkLogin,
    logout: checkLogout,
    fetchUserInfo,
  } = useUserFetch();

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") ? true : false
  );

  const [user, setUser] = useState(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : defaultUserInfo
  );
  const [userId, setUserId] = useState(null);

  /* phase can be: "set-up", "registration", "running", "grading" */
  const [termInfo, setTermInfo] = useState(
    JSON.parse(sessionStorage.getItem("termInfo")) || {
      phase: "",
      semester: "",
      year: "",
    }
  );

  const login = async (email, password) => {
    const { success, userId: id } = await checkLogin(email, password);

    if (success) {
      setIsLoggedIn(true);
      setUserId(id);
      const userInfo = await fetchUserInfo(id);
      setUser(userInfo);
      return true;
    }

    return false;
  };

  const logout = () => {
    checkLogout();
    setIsLoggedIn(false);
    setUser(defaultUserInfo);
    sessionStorage.removeItem("user");
  };

  /* 
    Will be called on load - we can use this to fetch async data from our
    database [ie: fill in termInfo]
    - The '[]' makes it so that this only gets triggered on the inital app
      load
    - If we want to update on a change of some state, we put the state in the
      array argument
  */

  useEffect(() => {
    /* Some async calls */
    sessionStorage.setItem("user", JSON.stringify(user)); // Temporary caching in session storage
  }, [user]);

  useEffect(() => {
    /* Some async calls */
    sessionStorage.setItem("termInfo", JSON.stringify(termInfo)); // Temporary caching in session storage
  }, [termInfo]);

  /* 
    The values of "value" in "GlobalContext.Provider" is available to all
    components that access "GlobalContext" via "useContext"
  */
  return (
    <GlobalContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        setIsLoggedIn,
        termInfo,
        setTermInfo,
        user,
        setUser,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
