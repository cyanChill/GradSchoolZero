import { useState, useEffect } from "react";
import useInfractions from "./useInfractions";
import useUserFetch from "./useUserFetch";
import useCourseFetch from "./useCourseFetch";
import { calcAvgRating } from "../helpers/rating";

const useInstructorFetch = () => {
  const { removeUser } = useUserFetch();
  const { addWarning } = useInfractions();
  const { getClassGPA } = useCourseFetch();

  const [instructorList, setInstructorList] = useState([]);
  const [nonSuspsendedInstructors, setNonSuspendedInstructors] = useState([]);
  const [suspendedInstructors, setSuspendedInstructors] = useState([]);

  // Refresh the local copy of the instructor list (to prevent constant fetching)
  const refreshInstructorsList = async () => {
    const response = await fetch(`http://localhost:2543/users?type=instructor`);
    const data = await response.json();

    setInstructorList(data);
  };

  useEffect(() => {
    refreshInstructorsList();
  }, []);

  useEffect(() => {
    const newNonSuspdIns = instructorList.filter(
      (instructor) => !instructor.suspended
    );
    const newSuspdIns = instructorList.filter(
      (instructor) => instructor.suspended
    );
    setNonSuspendedInstructors(newNonSuspdIns);
    setSuspendedInstructors(newSuspdIns);
  }, [instructorList]);

  // Function to fire an instructor
  const fireInstructor = async (instructorId) => {
    const newInstructorList = instructorList.map((instructor) => {
      if (instructor.id !== instructorId) return instructor;
      return { ...instructor, removed: true };
    });
    setInstructorList(newInstructorList);

    await removeUser(instructorId);
  };

  const suspendAllInstructorsNoCourse = async (semester, year) => {
    const instRes = await fetch(
      "http://localhost:2543/users?type=instructor&suspended=false&removed=false"
    );
    const instData = await instRes.json();

    for (const inst of instData) {
      const instCoursesRes = await fetch(
        `http://localhost:2543/classes?instructor.id=${inst.id}&semester=${semester}&year=${year}`
      );
      const instCoursesData = await instCoursesRes.json();

      if (instCoursesData.length === 0) {
        await addWarning(
          inst,
          "Instructor is teaching no courses and will be suspended",
          3
        );
      }
    }
  };

  const getInstructorAvgRating = async (instId) => {
    const instReviewsRes = await fetch(
      `http://localhost:2543/reviews?instructor.id=${instId}`
    );
    const instReviewsData = await instReviewsRes.json();

    if (instReviewsData.length === 0) return null;

    return calcAvgRating(instReviewsData);
  };

  const updateAllInstrucRating = async () => {
    const instRes = await fetch(
      "http://localhost:2543/users?type=instructor&removed=false"
    );
    const instData = await instRes.json();

    for (const inst of instData) {
      const avgRate = await getInstructorAvgRating(inst.id);

      await fetch(`http://localhost:2543/users/${inst.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...inst, rating: avgRate }),
      });
    }
  };

  const warnLess2RateInstructors = async () => {
    const instRes = await fetch(
      "http://localhost:2543/users?type=instructor&removed=false"
    );
    const instData = await instRes.json();

    for (const inst of instData) {
      if (inst.rating && inst.rating < 2) {
        await addWarning(inst, "Instructor has an average rating < 2", 1);
      }
    }
  };

  const instructorAssignAllGrades = async (instId) => {
    const instGradesRes = await fetch(
      `http://localhost:2543/grades?instructor.id=${instId}`
    );
    const instGradesData = await instGradesRes.json();

    return instGradesData.some((grade) => !grade.grade);
  };

  const warnAllFailGradeAssign = async () => {
    const instRes = await fetch(
      "http://localhost:2543/users?type=instructor&removed=false"
    );
    const instData = await instRes.json();

    for (const inst of instData) {
      const failAssignGrade = await instructorAssignAllGrades(inst.id);

      if (failAssignGrade) {
        await addWarning(
          inst,
          "Instructor failed to assign a grade to all their students",
          1
        );
      }
    }
  };

  const instructorWithSuspiciousClassGPA = async (instId, semester, year) => {
    const instCoursesRes = await fetch(
      `http://localhost:2543/classes?instructor.id=${instId}&semester=${semester}&year=${year}`
    );
    const instCoursesData = await instCoursesRes.json();

    let result = false;
    for (const course of instCoursesData) {
      const gpa = await getClassGPA(course.id);
      if (!gpa) return false;
      result = result || gpa < 2.5 || gpa > 3.5;
    }

    return result;
  };

  const notifyAllSupiciousInstructor = async (semester, year) => {
    const instRes = await fetch(
      "http://localhost:2543/users?type=instructor&removed=false"
    );
    const instData = await instRes.json();

    for (const inst of instData) {
      const suspicious = await instructorWithSuspiciousClassGPA(
        inst.id,
        semester,
        year
      );

      if (suspicious) {
        await addWarning(
          inst,
          "Your course has a supicious GPA, you will be notified at a later date for a meeting.",
          0
        );
      }
    }
  };

  return {
    instructorList,
    nonSuspsendedInstructors,
    suspendedInstructors,
    refreshInstructorsList,
    fireInstructor,
    suspendAllInstructorsNoCourse,
    getInstructorAvgRating,
    warnLess2RateInstructors,
    instructorAssignAllGrades,
    warnAllFailGradeAssign,
    notifyAllSupiciousInstructor,
    updateAllInstrucRating,
  };
};

export default useInstructorFetch;
