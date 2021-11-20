import { useState, useEffect } from "react";

const useCourseFetch = () => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const addCourse = (courseInfo) => {
    /* 
      Update local course list list, update course list in server (add entry)
    */
  };

  const cancelCourse = (courseId) => {
    /* 
      Update local course list (use filter to remove), update course list in server (find & delete entry)
    */
  };

  const enrollCourse = (stdId, courseId) => {
    /* 
      Do checks to see if the course isn't full:
       - if it isn't, enroll the student
       - otherwise, add the student to the waitlist
    */
  };

  const unEnrollCourse = (stdId, courseId) => {
    /* 
      Do checks to see if we're not in the grading period:
       - if it isn't, give student a grade of W and remove from course roster
       - If a waitlist exists, add the first person that can be added into the course - delete anyone who fails

      If the person isn't in the course but on the waitlist, remove them from the waitlist
    */
  };

  const getCourseInfo = (courseId) => {
    /* 
        Get course info from server
        - This includes reviews
      */
  };

  const addReview = (courseId, reviewObj) => {
    /* 
        Do taboo checks (if we haven't done so - issue warnings and such if we haven't yet)
        - Add it to the server
        - update course info if we have reviews in the course info
      */
  };

  useEffect(() => {
    /* Fetch list of courses from server */
  }, []);

  return {
    courseList,
    loading,
    addCourse,
    cancelCourse,
    enrollCourse,
    unEnrollCourse,
    getCourseInfo,
    addReview,
  };
};

export default useCourseFetch;
