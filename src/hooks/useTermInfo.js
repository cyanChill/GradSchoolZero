import { useState, useEffect } from "react";

/* 
  Possible values for:
     1. phase: "set-up", "registration", "running", "grading"
     2. sememster: "Fall", "Spring"
*/

const defaultTermInfo = {
  phase: "",
  semester: "",
  year: "",
};

const useTermInfo = () => {
  const [termInfo, setTermInfo] = useState(
    sessionStorage.getItem("term")
      ? JSON.parse(sessionStorage.getItem("term"))
      : defaultTermInfo
  );
  const [loading, setLoading] = useState(false);

  const nextPhase = async () => {
    setLoading(true);
    const nextTerm = getNextTermInfo();
    console.log("doing logic for next phase");
    if (nextTerm.phase === "set-up") {
      /* 
        Update the phase - if current phase is "grading" period, goto course set-up and move to the next semester
        - Send an update request to the server

        Depending on the phase, we may need to do some checks such as:
        - suspending users
        - issuing warnings (if we goto the course setup period and a course doesn't have all the grades in)
        - remove suspensions if they're over
        - Automatic honor student assignment
        - Automatic termination (gpa < 2 or failed the same course twice)
      */
      /* 
        Prevent going to course registration phase if there's no courses added from class set-up
          - If this is the case, return with an error message
          - Also set loading to false
      */
    } else if (nextTerm.phase === "registration") {
    } else if (nextTerm.phase === "running") {
    } else if (nextTerm.phase === "grading") {
    }

    // Uncomment once the logic is done
    /*
    await fetch(`http://localhost:2543/term/terminfo`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextTerm),
    });
    */
    setTermInfo(nextTerm);
    setLoading(false);
    return {
      status: "success",
      msg: "Successfully moved to the next phase.",
    };
  };

  const getNextTermInfo = () => {
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
            <li>Instructors who haven't assigned grades will be warned</li>
            <li>
              Instructors with a course GPA &gt;3.5 or &lt;2.5 will be
              questioned
            </li>
            <li>
              Any student with a GPA &lt;2 or failed the same course twice will
              be expelled
            </li>
            <li>
              Any student with a GPA &gt;3.75 from the previous semester or
              &gte;3.5 overall will be honor students (removing 1 warning)
            </li>
            <li>Instructors with 3 warnings will be suspended</li>
            <li>Students with 3 warnings will be suspended</li>
            <li>You can set up classes (time, instructor, size)</li>
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
    if (!termInfo.phase) {
      refreshTermInfo();
    }
    sessionStorage.setItem("term", JSON.stringify(termInfo));
  }, [termInfo]);

  return {
    termInfo,
    nextPhase,
    getPhaseInfo,
    getNextTermInfo,
  };
};

export default useTermInfo;
