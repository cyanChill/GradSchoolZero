import { useState, useEffect } from "react";
import useCourseFetch from "./useCourseFetch";
import useUserFetch from "./useUserFetch";
import useInstructorFetch from "./useInstructorFetch";
import useInfractions from "./useInfractions";

/* 
  Possible values for:
     1. phase: "set-up", "registration", "running", "grading"
     2. sememster: "Fall", "Spring"
*/

const defaultTermInfo = {
  phase: "",
  semester: "",
  year: "",
  specReg: false,
};

const useTermInfo = () => {
  const {
    warnAllStudForLessCourse,
    updateAllStudGPA,
    condCheckAllStudGPA,
    expelAllStudFailCourseTwice,
  } = useUserFetch();
  const {
    suspendAllInstructorsNoCourse,
    warnLess2RateInstructors,
    warnAllFailGradeAssign,
    notifyAllSupiciousInstructor,
    updateAllInstrucRating,
  } = useInstructorFetch();
  const {
    cancelCourse,
    listToBeCancelledCourse,
    semesterHasCourse,
    updateAllClassRatings,
  } = useCourseFetch();
  const { removeAllSuspendedFlag, suspendAllSuspendableUsers } =
    useInfractions();

  const [termInfo, setTermInfo] = useState(
    sessionStorage.getItem("term")
      ? JSON.parse(sessionStorage.getItem("term"))
      : defaultTermInfo
  );
  const [loading, setLoading] = useState(false);

  // Function that does the semester phase change logic
  const nextPhase = async () => {
    setLoading(true);
    const nextTerm = getNextPhaseInfo();

    if (nextTerm.phase === "set-up") {
      // Remove all suspended users
      await removeAllSuspendedFlag();

      // Update All Instructor Ratings
      await updateAllInstrucRating();

      // Warn instructors with an average rating <2
      await warnLess2RateInstructors();

      // Warn instructors who failed to assign grades to their students
      await warnAllFailGradeAssign();

      // Notify all suspicious instructors (class gpa < 2.5 or > 3.5)
      await notifyAllSupiciousInstructor(termInfo.semester, termInfo.year);

      /*
        0. Update all student's GPA
        1. Expel Student With GPA <2
        2. Warn Student With a GPA Between 2 and 2.5 Demanding an Interview (+0 warningCnt)
        3. Give Student HonorRoll For Term (Append to HonorRoll Array in DB) if GPA >3.75 this Semester or >3.5 Overall & remove 1 warning from their warning count (given it's >0)
      */
      await updateAllStudGPA();
      await condCheckAllStudGPA(termInfo.semester, termInfo.year);

      // Expell Student Who Failed the Same Course Twice
      await expelAllStudFailCourseTwice();

      // Suspend all users with warningCnt >= 3
      await suspendAllSuspendableUsers();

      // Update all course ratings
      await updateAllClassRatings(termInfo.semester, termInfo.year);
    } else if (nextTerm.phase === "registration") {
      // Require 1 course in order to move to the next phase
      const hasCourses = await semesterHasCourse(
        termInfo.semester,
        termInfo.year
      );

      if (!hasCourses) {
        setLoading(false);
        return {
          status: "danger",
          msg: "At least 1 course must be present when moving on to the next phase",
        };
      }
    } else if (nextTerm.phase === "running") {
      // Indicate Special Registration Has Started In Database
      await setSpecRegFlag(true);

      // Warning all students who are taking <2 courses this semester [people who don't enrolled are considered "inactive"]
      await warnAllStudForLessCourse(termInfo.semester, termInfo.year);

      // Cancel all classes with <5 enrolled students
      const cancellableCourseIdList = await listToBeCancelledCourse(termInfo);

      for (const courseId of cancellableCourseIdList) {
        await cancelCourse(courseId);
      }

      // Suspend all instructors taking no courses
      await suspendAllInstructorsNoCourse(termInfo.semester, termInfo.year);
    } else if (nextTerm.phase === "grading") {
      // End Special Registration In Case It's Still Enabled
      await endSpecialRegistration();
    }

    await fetch(`http://localhost:2543/term/terminfo`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextTerm),
    });

    setTermInfo((prev) => ({ ...prev, ...nextTerm }));
    setLoading(false);
    return {
      status: "success",
      msg: "Successfully moved to the next phase.",
    };
  };

  // Set Special Registration Flag in Database
  const setSpecRegFlag = async (state) => {
    const termRes = await fetch("http://localhost:2543/term/terminfo");
    const termData = await termRes.json();

    const res = await fetch(`http://localhost:2543/term/terminfo`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...termData, specReg: state }),
    });

    setTermInfo((prev) => ({ ...prev, specReg: state }));

    return res.ok;
  };

  // Function to remove special registration flag from students
  const endSpecialRegistration = async () => {
    // Fetch all students with the "specReg" flag
    setLoading(true);
    const studRes = await fetch("http://localhost:2543/users?specReg=true");
    const studData = await studRes.json();

    for (const stud of studData) {
      await fetch(`http://localhost:2543/users/${stud.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...stud, specReg: false }),
      });
    }

    // End Special Registration
    await setSpecRegFlag(false);
    setLoading(false);
  };

  // Function to get the new values for phase, semester, and year
  const getNextPhaseInfo = () => {
    const newPhase =
      termInfo.phase === "set-up"
        ? "registration"
        : termInfo.phase === "registration"
        ? "running"
        : termInfo.phase === "running"
        ? "grading"
        : "set-up";
    const newSemesterYear =
      termInfo.phase === "grading"
        ? termInfo.semester === "Fall"
          ? { semester: "Spring", year: +termInfo.year + 1 }
          : { semester: "Fall", year: +termInfo.year }
        : { semester: termInfo.semester, year: +termInfo.year };

    return { phase: newPhase, ...newSemesterYear };
  };

  // Function to get information about a phase in a semester
  const getPhaseInfo = (phase) => {
    let rtnInfo = {
      status: "error",
      description: "Invalid Phase",
    };

    if (
      phase === "set-up" ||
      phase === "registration" ||
      phase === "running" ||
      phase === "grading"
    ) {
      rtnInfo.status = "success";
    }

    if (phase === "set-up") {
      rtnInfo.description = (
        <div>
          <p>During this phase, the following events can happen:</p>
          <ul>
            <li>
              Users suspended for the outgoing semester will be unsuspended
            </li>
            <li>
              Instructors who haven't assigned grades to all students will be
              warned
            </li>
            <li>
              Instructors with a course GPA &gt;3.5 or &lt;2.5 will be
              questioned
            </li>
            <li>
              Any student with a GPA &lt;2 or failed the same course twice will
              be expelled
            </li>
            <li>
              Any student with a GPA &gt;3.75 from the previous semester or ≥3.5
              overall will be honor students (removing 1 warning)
            </li>
            <li>Students & Instructors with 3 warnings will be suspended</li>
            <li>You can set up classes (time, instructor, size)</li>
            <li>
              In addition, we updated the overall GPA of the student and course
            </li>
          </ul>
        </div>
      );
    } else if (phase === "registration") {
      rtnInfo.description = (
        <div>
          <p>During this phase, the following events can happen:</p>
          <ul>
            <li>Students can't register if they're suspended</li>
            <li>
              Students can register between 2-4 courses given that:
              <ol>
                <li>No time conflicts among the chosen classes</li>
                <li>
                  The class isn't at max capacity — if it is, the student is
                  added to the wait list
                </li>
                <li>
                  The student can retake the course if they got an "F" before
                </li>
              </ol>
            </li>
          </ul>
        </div>
      );
    } else if (phase === "running") {
      rtnInfo.description = (
        <div>
          <p>During this phase, the following events can happen:</p>
          <ul>
            <li>
              Courses with &lt;5 students will be cancelled, with the
              instructors receiving a warning and those students able to choose
              other courses during a special registration period
            </li>
            <li>
              Students can't register for courses except if they were in a class
              that was cancelled
            </li>
            <li>
              Instructors teaching no courses this semester will be suspended
              for the next semester
            </li>
          </ul>
        </div>
      );
    } else if (phase === "grading") {
      rtnInfo.description = (
        <div>
          <p>During this phase, the following events can happen:</p>
          <ul>
            <li>Instructors can assign grades</li>
            <li>
              Students can't write reviews once their grade is posted for the
              course
            </li>
          </ul>
        </div>
      );
    }

    return rtnInfo;
  };

  // Refreshes local copy of term information
  const refreshTermInfo = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:2543/term/terminfo`);
    const data = await res.json();

    const info = data;
    delete info.id;
    setTermInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    refreshTermInfo();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("term", JSON.stringify(termInfo));
  }, [termInfo]);

  return {
    loading,
    termInfo,
    nextPhase,
    getPhaseInfo,
    getNextPhaseInfo,
    endSpecialRegistration,
  };
};

export default useTermInfo;
