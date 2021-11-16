import { useState, useEffect, createContext } from "react";
import useUserFetch from "./hooks/useUserFetch";
import useTermInfo from "./hooks/useTermInfo";
import useApplicationFetch from "./hooks/useApplicationFetch";

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  /* -=- Login -=- */
  const { isLoggedIn, user, login, logout, checkUserEmailIsUsed, createUser } =
    useUserFetch();

  /* -=- Term Info -=- */
  const { termInfo } = useTermInfo();

  /* -=- Application -=- */
  const {
    applicationsList,
    loading,
    checkAppEmailIsUsed,
    addApplication,
    getApplicationInfo,
    removeApplication,
    refreshApplicationsList,
  } = useApplicationFetch();

  /* 
    The values of "value" in "GlobalContext.Provider" is available to all
    components that access "GlobalContext" via "useContext"
  */
  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        checkUserEmailIsUsed,
        termInfo,
        createUser,
        applicationsList,
        loading,
        checkAppEmailIsUsed,
        addApplication,
        getApplicationInfo,
        removeApplication,
        refreshApplicationsList,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
