import { createContext } from "react";
import useUserFetch from "./hooks/useUserFetch";
import useTermInfo from "./hooks/useTermInfo";
import useApplicationFetch from "./hooks/useApplicationFetch";
import useTabooFetch from "./hooks/useTabooFetch";
import useComplaintsFetch from "./hooks/useComplaintsFetch";
import useInstructorFetch from "./hooks/useInstructorFetch";

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  /* -=- Login -=- */
  const userHook = useUserFetch();

  /* -=- Term Info -=- */
  const termHook = useTermInfo();

  /* -=- Application -=- */
  const applicationsHook = useApplicationFetch();

  /* -=- Taboo -=- */
  const tabooHook = useTabooFetch();

  /* -=- Complaints -=- */
  const complaintHook = useComplaintsFetch();

  /* -=- Instructors -=- */
  const instructorHook = useInstructorFetch();

  /* 
    The values of "value" in "GlobalContext.Provider" is available to all
    components that access "GlobalContext" via "useContext"
  */
  return (
    <GlobalContext.Provider
      value={{
        userHook,
        termHook,
        applicationsHook,
        tabooHook,
        complaintHook,
        instructorHook,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
