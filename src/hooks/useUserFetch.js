import { useState, useEffect } from "react";
import { calculateGPA } from "../helpers/grades";
import useInfractions from "./useInfractions";

const defaultUserInfo = {
  id: "",
  name: "",
  email: "",
  type: "",
  suspended: false,
  graduated: false,
};

const useUserFetch = () => {
  const { addWarning } = useInfractions();

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") ? true : false
  );
  const [user, setUser] = useState(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : defaultUserInfo
  );

  // Function to see if an email is being used by a different user
  const checkUserEmailIsUsed = async (email) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/users?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length > 0) return true;
    return false;
  };

  // Function to create a user
  const createUser = async (userInfo) => {
    const baseStructure = {
      ...userInfo,
      warningCnt: 0,
      suspended: false,
      removed: false,
    };

    const body =
      userInfo.type === "student"
        ? {
            ...baseStructure,
            specReg: false,
            graduated: false,
            honorRoll: [],
            GPA: null,
            applyGrad: false,
          }
        : userInfo.type === "instructor"
        ? {
            ...baseStructure,
            rating: null,
          }
        : baseStructure;
    const res = await fetch("http://localhost:2543/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return res.ok;
  };

  // Function to login a user
  const login = async (email, password) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/users?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length === 0) return false;

    if (data[0].password === password) {
      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", true);
      setUserInfo(data[0]);
      return true;
    }
    return false;
  };

  // Function to logout a user
  const logout = () => {
    setIsLoggedIn(false);
    setUser(defaultUserInfo);
    sessionStorage.removeItem("isLoggedIn");
    return true;
  };

  // Helper function to remove password information from user object we'll be saving
  const setUserInfo = (data) => {
    const userInfo = { ...data };
    delete userInfo.password;
    setUser(userInfo);
  };

  // Function to change the password of the current user (stored in the user state)
  const changePassword = async (oldPass, newPass) => {
    const res = await fetch(`http://localhost:2543/users/${user.id}`);
    const data = await res.json();

    if (oldPass === data.password) {
      if (!newPass) {
        return { type: "danger", message: "New Password Must Not Be Empty" };
      }

      const res = await fetch(`http://localhost:2543/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          password: newPass,
        }),
      });

      if (!res.ok) {
        return {
          type: "danger",
          message: "An Error Has Occurred When Changing Your Password",
        };
      }

      return { type: "success", message: "Successfully Changed Password" };
    }

    return { type: "danger", message: "Incorrect Old Password" };
  };

  // Get user-related information from their id
  const getUserInfoFromId = async (id) => {
    // Get user info
    const userRes = await fetch(`http://localhost:2543/users/${id}`);

    if (!userRes.ok) return "error";

    const userData = await userRes.json();

    // Will get the grades (which includes courses currently taken)
    const gradeRes = await fetch(
      `http://localhost:2543/grades?student.id=${id}`
    );
    const gradeData = await gradeRes.json();

    // Get courses taught
    const taughtRes = await fetch(
      `http://localhost:2543/classes?instructor.id=${id}`
    );
    const taughtData = await taughtRes.json();

    return {
      userData: {
        name: userData.name,
        type: userData.type,
        removed: userData.removed,
        graduated: userData.graduated,
        GPA: userData.GPA,
      },
      gradeData,
      taughtData,
    };
  };

  const warnAllStudForLessCourse = async (semester, year) => {
    const studRes = await fetch(
      "http://localhost:2543/users?type=student&graduated=false&suspended=false&removed=false"
    );
    const studData = await studRes.json();

    for (const stud of studData) {
      const studGradRes = await fetch(
        `http://localhost:2543/grades?student.id=${stud.id}&semester=${semester}&year=${year}`
      );
      const studGradData = await studGradRes.json();

      if (studGradData.length < 2) {
        await addWarning(stud, "Student taking less than 2 courses", 1);
      }
    }
  };

  // Function to expell a student
  const removeUser = async (userId) => {
    const res = await fetch(`http://localhost:2543/users/${userId}`);
    const data = await res.json();

    const patchRes = await fetch(`http://localhost:2543/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, removed: true }),
    });

    return patchRes.ok;
  };

  // Function to get student's gpa
  const getStudGPA = async (id) => {
    const gradesRes = await fetch(
      `http://localhost:2543/grades?student.id=${id}&grade_ne=W&grade_new=DW`
    );
    const gradesData = await gradesRes.json();
    const gradeArr = gradesData
      .map((grade) => grade.grade)
      .filter((grade) => grade !== "");

    if (gradeArr.length === 0) return null;

    return calculateGPA(gradeArr);
  };

  // Function to get student GPA for this term
  const getStudSemesterGPA = async (id, year, semester) => {
    const gradesRes = await fetch(
      `http://localhost:2543/grades?student.id=${id}&grade_ne=W&grade_new=DW&term.semester=${semester}&term.year=${year}`
    );
    const gradesData = await gradesRes.json();
    const gradeArr = gradesData
      .map((grade) => grade.grade)
      .filter((grade) => grade !== "");

    if (gradeArr.length === 0) return null;

    return calculateGPA(gradeArr);
  };

  // Updates all student's GPA
  const updateAllStudGPA = async () => {
    const studRes = await fetch(
      "http://localhost:2543/users?type=student&removed=false&graduated=false"
    );
    const studData = await studRes.json();

    for (const stud of studData) {
      const GPA = await getStudGPA(stud.id);

      await fetch(`http://localhost:2543/users/${stud.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...stud, GPA }),
      });
    }
  };

  // Function to run the 3 GPA checks that triggers some actions for students
  const condCheckStudGPA = async (id, semester, year) => {
    const res = await fetch(`http://localhost:2543/users/${id}`);
    const data = await res.json();

    // Case if student has no GPA
    if (!data.GPA) return;

    if (data.GPA < 2) {
      // Expell student if their GPA is < 2
      await removeUser(id);
    } else if (data.GPA > 2 && data.GPA < 2.25) {
      // Notify user that a meeting is required if their GPA is between 2 and 2.25
      await addWarning(
        data,
        "Student requires interview with registrar for having an unoptimal GPA",
        1
      );
    } else {
      const termGPA = await getStudSemesterGPA(id, semester, year);

      if (termGPA > 3.75 || data.GPA > 3.5) {
        // Give honor roll to student with a term GPA > 3.75 or an overall GPA of 3.5
        const newWarnCnt = data.warningCnt > 0 ? data.warningCnt - 1 : 0;

        await fetch(`http://localhost:2543/users/${id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            warningCnt: newWarnCnt,
            honorRoll: [...data.honorRoll, { semester, year }],
          }),
        });
      }
    }
  };

  // Function to run the GPA checks on all students
  const condCheckAllStudGPA = async (semester, year) => {
    const studRes = await fetch(
      "http://localhost:2543/users?type=student&removed=false&graduated=false"
    );
    const studData = await studRes.json();

    for (const stud of studData) {
      await condCheckStudGPA(stud.id, semester, year);
    }
  };

  // Function to check if a student failed a course twice & expell them
  const studFailCourseTwice = async (id) => {
    const res = await fetch(
      `http://localhost:2543/grades?student.id=${id}&grade=F`
    );
    const data = await res.json();
    const courseMap = {};

    data.forEach((courseGrade) => {
      if (!courseMap[courseGrade.course.code])
        courseMap[courseGrade.course.code] = 0;
      courseMap[courseGrade.course.code]++;
    });

    const failedCourseTwice = Object.values(courseMap).includes(2);

    if (failedCourseTwice) {
      // Expel Student
      await removeUser(id);
    }

    return failedCourseTwice;
  };

  // Function to expel all students who failed the same course twice
  const expelAllStudFailCourseTwice = async () => {
    const studRes = await fetch(
      "http://localhost:2543/users?type=student&removed=false"
    );
    const studData = await studRes.json();

    for (const stud of studData) {
      await studFailCourseTwice(stud.id);
    }
  };

  // Function to refresh the user info
  const refreshUserInfo = async () => {
    if (!user.id) return;

    const res = await fetch(`http://localhost:2543/users/${user.id}`);
    const data = await res.json();
    setUserInfo(data);
  };

  // Get the user's warning count and latest 3 warnings
  const getUserInfractions = async (id) => {
    const userRes = await fetch(`http://localhost:2543/users/${id}`);
    const userData = await userRes.json();

    const warningsRes = await fetch(
      `http://localhost:2543/warnings?user.id=${id}&_sort=date&_order=desc&_limit=3`
    );
    const warningsData = await warningsRes.json();

    return { warningCnt: userData.warningCnt, latest3Warnings: warningsData };
  };

  // Get the top 3 student gpas
  const getProgramStudStats = async () => {
    const top3Res = await fetch(
      `http://localhost:2543/users?type=student&_sort=GPA&GPA_ne=null&_order=desc&_limit=3`
    );
    const top3Data = await top3Res.json();

    return { top3: top3Data };
  };

  // Set the applyGrad flag for the user to true (will display in graduation applications on the registrar side)
  const applyForGrad = async (id) => {
    const userRes = await fetch(`http://localhost:2543/users/${id}`);
    const userData = await userRes.json();

    const res = await fetch(`http://localhost:2543/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        applyGrad: true,
      }),
    });

    return res.ok;
  };

  // Function to get all current graduation applications
  const getAllGradApp = async () => {
    const res = await fetch(`http://localhost:2543/users?applyGrad=true`);
    const data = await res.json();
    return data;
  };

  // Function to handle how we deal with the graduation application
  const handleGradApp = async (userInfo, outcome) => {
    if (outcome === "reject") {
      await addWarning(userInfo, "Reckless graduation application", 1);
    }

    const userRes = await fetch(`http://localhost:2543/users/${userInfo.id}`);
    const userData = await userRes.json();

    const res = await fetch(`http://localhost:2543/users/${userInfo.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        applyGrad: false,
        graduated: outcome === "accept",
      }),
    });

    return res.ok;
  };

  // Function to get all suspended users
  const getAllSuspendedUsers = async () => {
    const res = await fetch(`http://localhost:2543/users?suspended=true`);
    const data = await res.json();
    return data;
  };

  // Functions to get all fired/expeled users
  const getAllRemovedUsers = async () => {
    const res = await fetch(`http://localhost:2543/users?removed=true`);
    const data = await res.json();
    return data;
  };

  // Function to get all (nonexpelled) students
  const getAllStudents = async () => {
    const res = await fetch(
      `http://localhost:2543/users?type=student&removed=false&_sort=name`
    );
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    refreshUserInfo();
  }, []);

  return {
    isLoggedIn,
    user,
    login,
    logout,
    checkUserEmailIsUsed,
    createUser,
    changePassword,
    getUserInfoFromId,
    warnAllStudForLessCourse,
    removeUser,
    getStudGPA,
    updateAllStudGPA,
    getStudSemesterGPA,
    condCheckStudGPA,
    condCheckAllStudGPA,
    studFailCourseTwice,
    expelAllStudFailCourseTwice,
    refreshUserInfo,
    getUserInfractions,
    getProgramStudStats,
    applyForGrad,
    getAllGradApp,
    handleGradApp,
    getAllSuspendedUsers,
    getAllRemovedUsers,
    getAllStudents,
  };
};

export default useUserFetch;
