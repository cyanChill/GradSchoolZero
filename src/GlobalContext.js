import { useState, useEffect, createContext } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("loggedIn?") === "true" || false
  );

  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || {
      type: "",
    }
  );

  const [termInfo, setTermInfo] = useState({
    phase: "",
    semester: "",
    year: "",
  });

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
    sessionStorage.setItem("loggedIn?", isLoggedIn); // Temporary caching in session storage
  }, [isLoggedIn]);

  useEffect(() => {
    /* Some async calls */
    sessionStorage.setItem("user", JSON.stringify(user)); // Temporary caching in session storage
  }, [user]);

  /* 
    The values of "value" in "GlobalContext.Provider" is available to all
    components that access "GlobalContext" via "useContext"
  */
  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, termInfo, setTermInfo, user, setUser }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
