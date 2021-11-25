import { createContext, useEffect } from "react";
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
  const { refreshUserInfo } = userHook;

  /* -=- Term Info -=- */
  const termHook = useTermInfo();
  const { shouldRefresh, fulfillRefresh } = termHook;

  /* -=- Application -=- */
  const applicationsHook = useApplicationFetch();

  /* -=- Taboo -=- */
  const tabooHook = useTabooFetch();
  const { refreshTabooList } = tabooHook;

  /* -=- Complaints -=- */
  const complaintHook = useComplaintsFetch();

  /* -=- Instructors -=- */
  const instructorHook = useInstructorFetch();

  useEffect(() => {
    const handleRefresh = async () => {
      await refreshTabooList();
      await refreshUserInfo();
      await fulfillRefresh();
    };

    if (shouldRefresh) {
      handleRefresh();
    }
  }, [shouldRefresh]);

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
