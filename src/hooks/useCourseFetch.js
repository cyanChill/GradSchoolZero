import _ from "lodash";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "../GlobalContext";
import { checkConflicts } from "../helpers/time";

const useCourseFetch = () => {
  const {
    termHook: {
      termInfo: { semester, year, phase },
    },
  } = useContext(GlobalContext);

  // Function to add a course to the database
  const addCourse = async (
    courseBase,
    instructorId,
    instructorName,
    time,
    capacity
  ) => {
    const courseObj = {
      id: uuidv4(),
      course: {
        id: courseBase.id,
        code: courseBase.code,
        name: courseBase.name,
      },
      instructor: {
        id: instructorId,
        name: instructorName,
      },
      term: {
        semester,
        year,
      },
      capacity: {
        max: capacity,
        available: 0,
      },
      time,
      waitList: [],
    };

    await fetch("http://localhost:2543/classes", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(courseObj),
    });
  };

  // Fetch the courses with less than 5 students
  const listToBeCancelledCourse = async () => {
    const res = await fetch(
      `http://localhost:2543/grades?courseInfo.semester=${semester}&courseInfo.year=${year}&grade_ne=W&grade_ne=DW`
    );
    const data = await res.json();
    const enrolledMap = {};

    data.forEach((enrollment) => {
      const courseId = enrollment.courseInfo.id;
      if (!enrolledMap[courseId]) enrolledMap[courseId] = 0;
      enrolledMap[courseId]++;
    });

    const shouldBeCancelled = _.pickBy(enrolledMap, (val, key) => val < 5);
    return Object.keys(shouldBeCancelled);
  };

  const cancelCourse = (courseId) => {
    /* 
      Update local course list (use filter to remove), update course list in server (find & delete entry)
      - Also if there's any students enrolled, give them special registration flag
    */
  };

  // Function to enroll student into a course
  const enrollCourse = async (user, courseInfo) => {
    const { courseName, courseId } = courseInfo;
    const { stdId, name, specReg } = user;

    if (phase !== "registration" || !specReg)
      return {
        error: "Can't Enroll",
        details: "Phase isn't in course-registration",
      };

    // Get student grades
    const studGradeRes = await fetch(
      `http://localhost:2543/grades?student.id=${stdId}`
    );
    const studGradeData = await studGradeRes.json();

    // Get number of courses the student is currently taking
    const coursesCurrTaking = studGradeData.map(
      (grade) => grade.term.semester === semester && +grade.term.year === +year
    );
    const numCoursesCurrTaking = coursesCurrTaking.length;

    // Filter out the grades for this course taken previously
    const prevGradesForCourse = studGradeData.map(
      (grade) => grade.course.name === courseName
    );

    // Get grade distribution of previous attempt at course & see if they've previously withdrawn from this semester's instance of the course
    const gradeDist = {};
    let withdrawn = false;
    prevGradesForCourse.forEach((grade) => {
      if (!gradeDist[grade.grade]) gradeDist[grade.grade] = 0;
      grade[grade.grade]++;

      if (grade.course.id === courseId) withdrawn = true;
    });
    // Number of times student have taken the course (excluding withdraws)
    const numTaken =
      prevGradesForCourse.length - gradeDist["W"] - gradeDist["DW"];

    if (
      numCoursesCurrTaking < 4 &&
      !withdrawn &&
      (numTaken === 0 || (numTaken === 1 && gradeDist["F"] === 1))
    ) {
      // Student haven't taken this course before or taken it once and has an F and haven't withdrawn from the course previously
      /* 
        1. Get time slots for the courses the student is currently taking [from "coursesCurrTaking"] and combine all the time arrays and run the "checkConflicts" function
          - If conflicts, then return error✅

        2. Check if course is currently full -- if it is, add the student to the waitlist [after checking to see if there's no time conflicts]

        3. If course isn't full, enroll the student
      */
      const allCourseTimes = coursesCurrTaking.reduce(
        (allCourses, newCourse) => allCourses.concat(newCourse.time),
        courseInfo.time
      );
      const conflicts = checkConflicts(allCourseTimes);

      if (!conflicts) {
        // Checking to see if course is full
        const currCourse = await fetch(
          `http://localhost:2543/classes/id=${courseId}`
        );
        const currCourseInfo = await currCourse.json();

        if (currCourseInfo.available > 0) {
          /* 
            Enroll student
              - Create "grade" object
              - Increment "classes" capacity property by 1
          */
        } else {
          // Add student to waitlist
          const updatedCourseInfo = {
            ...currCourseInfo,
            waitList: [
              ...currCourseInfo.waitlist,
              {
                id: stdId,
                name: name,
              },
            ],
          };

          const updateResponse = await fetch(
            `http://localhost:2543/classes/id=${courseId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedCourseInfo),
            }
          );

          if (updateResponse.ok)
            return {
              status: "Successfully Updated",
              details: "Successfully updated waitlist",
            };
          return {
            error: "Failed to Update",
            details: "Failed to update waitlist with new student",
          };
        }
      } else {
        return {
          error: "Time Conflicts",
          details:
            "Adding this course will lead to time conflicts with some of the other enrolled courses",
        };
      }
    } else {
      // Taken Class Twice (Both F)
      if (numTaken === 2 && gradeDist["F"] === 2)
        return { error: "Expulsion", details: "Failed course twice" };

      // Taken class once or twice but didn't get an F the 2nd time (or a "W" or "DW")
      if (numTaken === 1 || numTaken === 2)
        return {
          error: "Passed",
          details: "Passed course already",
        };

      // Taking 4 classes
      if (numCoursesCurrTaking === 4)
        return {
          error: "Course Limit",
          details: "Taking the max number of courses allowed",
        };

      // Withdrawn from this course already
      if (withdrawn)
        return {
          error: "Withdrawn",
          detais: "Student have withdrawn from this course",
        };

      return {
        error: "Unknown",
        details: "Some other factor that doesn't allow the student to enroll",
      };
    }
  };

  const unEnrollCourse = (stdId, courseId) => {
    /* 
      Do checks to see if we're not in the grading period:
       - if it isn't, give student a grade of W and remove from course roster
       - If a waitlist exists, add the first person that can be added into the course - delete anyone who fails

      If the person isn't in the course but on the waitlist, remove them from the waitlist
    */
  };

  const getCourseList = async () => {
    const res = await fetch(
      `http://localhost:2543/classes?term.semester=${semester}&term.year=${year}`
    );
    const data = await res.json();
    return data;
  };

  // Get course information from the database include reviews & students enrolled
  const getCourseInfo = async (courseId) => {
    const courseRes = await fetch(`http://localhost:2543/classes/${courseId}`);
    const courseData = await courseRes.json();

    if (!courseData.course) return "error";

    const enrolledRes = await fetch(
      `http://localhost:2543/grades?course.id=${courseId}&grade_ne=W&grade_ne=DW`
    );
    const enrolledData = await enrolledRes.json();
    const enrolledInfo = enrolledData.map((grade) => grade.student);

    const reviewsRes = await fetch(
      `http://localhost:2543/reviews?course.name=${courseData.course.name}&course.code=${courseData.course.code}`
    );
    const reviewsData = await reviewsRes.json();

    return { courseData, enrolledInfo, reviewsData };
  };

  // Get the basis for the created courses (id, name, department, number)
  const getAllBaseCourses = async () => {
    const res = await fetch("http://localhost:2543/courses");
    const data = await res.json();
    return data;
  };

  return {
    addCourse,
    cancelCourse,
    enrollCourse,
    unEnrollCourse,
    getCourseInfo,
    getCourseList,
    listToBeCancelledCourse,
    getAllBaseCourses,
  };
};

export default useCourseFetch;
