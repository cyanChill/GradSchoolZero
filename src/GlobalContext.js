import { useState, useEffect, createContext } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    /* Some async call */
  }, []);

  /* 
    The values of "value" in "GlobalContext.Provider" is available to all
    components that access "GlobalContext" via "useContext"
  */
  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, termInfo, setTermInfo }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
