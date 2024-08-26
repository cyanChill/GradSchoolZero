import { v4 as uuidv4 } from "uuid";
import { checkConflicts } from "../helpers/time";
import { calculateGPA, gradeMap } from "../helpers/grades";
import { calcAvgRating } from "../helpers/rating";
import useInfractions from "./useInfractions";

const useCourseFetch = () => {
  const { addWarning } = useInfractions();

  // Function to add a course to the database
  const addCourse = async (
    courseBase,
    instructorId,
    instructorName,
    time,
    capacity,
    termInfo
  ) => {
    const { semester, year } = termInfo;
    const num = await numCourseInstanceInSemester(
      termInfo.semester,
      termInfo.year,
      courseBase.name,
      courseBase.code
    );
    const startPad =
      (1000 - num).toString().length >= 0 ? (1000 - num).toString().length : 0;

    const section =
      semester[0] + (year % 100) + "S" + num.toString().padStart(startPad, 0);

    const courseObj = {
      id: uuidv4(),
      section,
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
        available: capacity,
      },
      time,
      waitList: [],
    };

    const res = await fetch("http://localhost:2543/classes", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(courseObj),
    });

    return res.ok;
  };

  // Function to delete course
  const deleteCourse = async (courseId) => {
    const res = await fetch(`http://localhost:2543/classes/${courseId}`, {
      method: "DELETE",
    });
    return res.ok;
  };

  // Get a list of the courses that can be cancelled
  const listToBeCancelledCourse = async (termInfo) => {
    const { semester, year } = termInfo;

    const res = await fetch(
      `http://localhost:2543/classes?term.semester=${semester}&term.year=${year}`
    );
    const data = await res.json();

    const shouldBeCancelled = data.filter(
      (course) => +course.capacity.max - +course.capacity.available < 5
    );

    const shouldBeCancelledCourseIds = shouldBeCancelled.map(
      (course) => course.id
    );

    return shouldBeCancelledCourseIds;
  };

  // Cancel Course
  const cancelCourse = async (courseId) => {
    const courseRes = await fetch(`http://localhost:2543/classes/${courseId}`);
    const courseData = await courseRes.json();

    const studentsRes = await fetch(
      `http://localhost:2543/grades?course.id=${courseId}&grade_ne=W&grade_ne=DW`
    );
    const studentsGradesObj = await studentsRes.json();

    // Give student who have this class the special registration property
    for (const student of studentsGradesObj) {
      const userInfoRes = await fetch(
        `http://localhost:2543/users/${student.student.id}`
      );
      const userInfo = await userInfoRes.json();

      const newUserInfo = {
        ...userInfo,
        specReg: true,
      };

      await fetch(`http://localhost:2543/users/${student.student.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserInfo),
      });

      await fetch(`http://localhost:2543/grades/${student.id}`, {
        method: "DELETE",
      });
    }

    // Warn the instructor for teaching a cancelled class
    await addWarning(courseData.instructor, "Teaching a cancelled course", 1);

    // Remove Course from Database
    const res = await fetch(`http://localhost:2543/classes/${courseId}`, {
      method: "DELETE",
    });

    return res.ok;
  };

  // Function to enroll student into a course
  const enrollCourse = async (user, courseInfo, termInfo) => {
    const {
      id: courseId,
      course: { code, name: courseName },
      instructor,
    } = courseInfo;
    const { id: stdId, name: stdName, specReg, suspended, expelled } = user;
    const { semester, year, phase } = termInfo;

    if (phase !== "registration" && !specReg)
      return {
        status: "error",
        title: "Can't Enroll",
        details: "Phase isn't in course-registration",
      };

    if (suspended)
      return {
        status: "error",
        title: "Can't Enroll",
        details: "User is suspended",
      };

    if (expelled)
      return {
        status: "error",
        title: "Can't Enroll",
        details: "User is expelled",
      };

    // Get student grades
    const studGradeRes = await fetch(
      `http://localhost:2543/grades?student.id=${stdId}`
    );
    const studGradeData = await studGradeRes.json();

    // Get number of courses the student is currently taking
    const coursesCurrTaking = studGradeData.filter(
      (grade) => grade.term.semester === semester && +grade.term.year === +year
    );
    const numCoursesCurrTaking = coursesCurrTaking.length;

    // See if the person is currently taking a different instance of this course
    const takingDiffInstance = studGradeData.filter(
      (grade) =>
        grade.term.semester === semester &&
        +grade.term.year === +year &&
        grade.course.name === courseName &&
        grade.course.code === code
    );

    // Filter out the grades for this course taken previously
    const prevGradesForCourse = studGradeData.filter(
      (grade) => grade.course.name === courseName
    );

    // Get grade distribution of previous attempt at course & see if they've previously withdrawn from this semester's instance of the course
    const gradeDist = { ...gradeMap };
    let withdrawn = false;
    prevGradesForCourse.forEach((grade) => {
      if (!gradeDist[grade.grade]) gradeDist[grade.grade] = 0;
      gradeDist[grade.grade]++;

      if (grade.course.id === courseId) withdrawn = true;
    });

    // Number of times student have taken the course (excluding withdraws)
    const numTaken =
      prevGradesForCourse.length - gradeDist["W"] - gradeDist["DW"];

    if (
      takingDiffInstance.length === 0 &&
      numCoursesCurrTaking < 4 &&
      !withdrawn &&
      (numTaken === 0 || (numTaken === 1 && gradeDist["F"] === 1))
    ) {
      // Get more details on the courses currently taking
      const allCurrCourseDetails = [];
      for (const crse of coursesCurrTaking) {
        const currCrseDetailRes = await fetch(
          `http://localhost:2543/classes/${crse.course.id}`
        );
        const currCrseDetailData = await currCrseDetailRes.json();
        allCurrCourseDetails.push(currCrseDetailData);
      }

      const allCourseTimes =
        allCurrCourseDetails.reduce(
          (allCourses, newCourse) => allCourses.concat(newCourse.time),
          courseInfo.time
        ) || courseInfo.time;
      const conflicts = checkConflicts(allCourseTimes);

      if (!conflicts) {
        // Checking to see if course is full
        const currCourse = await fetch(
          `http://localhost:2543/classes/${courseId}`
        );
        const currCourseInfo = await currCourse.json();

        if (currCourseInfo.capacity.available > 0) {
          // Decrementing Avaliable Seats By 1
          const updatedCourseInfo = {
            ...currCourseInfo,
            capacity: {
              max: currCourseInfo.capacity.max,
              available: +currCourseInfo.capacity.available - 1,
            },
          };

          const updateRes = await fetch(
            `http://localhost:2543/classes/${courseId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedCourseInfo),
            }
          );

          if (!updateRes.ok)
            return {
              status: "error",
              title: "Failed to Enroll",
              details: "An unknown error has occur when updating the database",
            };

          // Creating & posting "grade" object to server
          const gradeObj = {
            id: uuidv4(),
            course: {
              code,
              id: courseId,
              name: courseName,
            },
            instructor,
            student: {
              id: stdId,
              name: stdName,
            },
            term: {
              semester,
              year,
            },
            grade: "",
          };

          const gradePostRes = await fetch("http://localhost:2543/grades", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(gradeObj),
          });

          if (gradePostRes.ok)
            return {
              status: "success",
              title: "Successfully Enrolled",
              details: "Successfully enrolled into course",
            };
          return {
            status: "error",
            title: "Failed to Enroll",
            details: "Failed to post to server",
          };
        } else {
          // Add student to waitlist
          const updatedCourseInfo = {
            ...currCourseInfo,
            waitList: [
              ...currCourseInfo.waitList,
              {
                id: stdId,
                name: stdName,
              },
            ],
          };

          const updateResponse = await fetch(
            `http://localhost:2543/classes/${courseId}`,
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
              status: "success",
              title: "Successfully Joined Waitlist",
              details: "Successfully updated waitlist",
            };
          return {
            status: "error",
            title: "Failed to Update",
            details: "Failed to update waitlist with new student",
          };
        }
      } else {
        return {
          status: "error",
          title: "Time Conflicts",
          details:
            "Adding this course will lead to time conflicts with some of the other enrolled courses",
        };
      }
    } else {
      // Taken Class Twice (Both F)
      if (numTaken === 2 && gradeDist["F"] === 2)
        return {
          status: "error",
          title: "Expulsion",
          details: "Failed course twice",
        };

      // Taking a different instance of the course
      if (takingDiffInstance.length > 0)
        return {
          status: "error",
          title: "Currently Taking Course",
          details: "Taking this course with a different instructor currently",
        };

      // Taken class once or twice but didn't get an F the 2nd time (or a "W" or "DW")
      if (numTaken === 1 || numTaken === 2)
        return {
          status: "error",
          title: "Passed",
          details: "Passed course already",
        };

      // Taking 4 classes
      if (numCoursesCurrTaking === 4)
        return {
          status: "error",
          title: "Course Limit",
          details: "Taking the max number of courses allowed",
        };

      // Withdrawn from this course already
      if (withdrawn)
        return {
          status: "error",
          title: "Withdrawn",
          details: "Student have withdrawn from this course",
        };

      return {
        status: "error",
        title: "Unknown",
        details: "Some other factor that doesn't allow the student to enroll",
      };
    }
  };

  // Function to remove a user from the waitlist of a cousre
  const leaveWaitlist = async (userId, courseId) => {
    const latestCourseRes = await fetch(
      `http://localhost:2543/classes/${courseId}`
    );
    const latestCourseData = await latestCourseRes.json();

    const updatedCourseData = {
      ...latestCourseData,
      waitList: latestCourseData.waitList.filter((std) => std.id !== userId),
    };

    const res = await fetch(`http://localhost:2543/classes/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCourseData),
    });

    if (res.ok)
      return { status: "success", message: "Successfully left waitlist" };
    return { status: "error", message: "Failed to leave waitlist" };
  };

  // Function to unenroll a student from a course & add the next valid waitlist student
  const unEnrollCourse = async (userId, courseId, termInfo) => {
    const { phase, semester, year } = termInfo;

    if (phase === "grading")
      return {
        status: "error",
        message: "Cannot withdraw from course during Grading Period",
      };

    // Removing User From Course
    const gradeEntryRes = await fetch(
      `http://localhost:2543/grades?course.id=${courseId}&student.id=${userId}`
    );
    const gradeEntryData = await gradeEntryRes.json();
    const gradeEntry = gradeEntryData[0];

    const updatedGradeEntry = {
      ...gradeEntry,
      grade: "W",
    };

    const res = await fetch(`http://localhost:2543/grades/${gradeEntry.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedGradeEntry),
    });

    if (!res.ok) return { status: "error", message: "Failed to leave course" };

    // Check to see if user has dropped all courses - if they did, they're suspended (add 3 warnings)
    if (phase === "running") {
      const currTakingRes = await fetch(
        `http://localhost:2543/grades?student.id=${userId}&term.semester=${semester}&term.year=${year}&grade_ne=W&grade_ne=DW`
      );
      const currTakingData = await currTakingRes.json();

      if (currTakingData.length === 0) {
        await addWarning(
          gradeEntry.student,
          "Student has dropped all their courses",
          3
        );
      }
    }

    // Auto enrollment from waitlist only during registration phase
    if (phase === "registration") {
      // Updating Course Info [add waitlist person (given they don't have time conflicts & have < 4 courses) or then increment avaliable to 1]
      const courseInfoRes = await fetch(
        `http://localhost:2543/classes/${courseId}`
      );
      const courseInfoData = await courseInfoRes.json();
      let waitlist = courseInfoData.waitList;

      let success = false;

      while (!success && waitlist.length > 0) {
        // call addStudentFromWaitlist function
        const waitlistStd = waitlist[0];
        const result = await addStudentFromWaitlist(
          waitlistStd,
          courseId,
          termInfo
        );
        waitlist.shift();

        if (result.status === "error") continue;
        success = true;
      }

      let updatedCourseData = {
        ...courseInfoData,
        waitList: waitlist,
      };

      if (!success) {
        // Increment "avaliable" by 1 of the class' capacity
        updatedCourseData = {
          ...updatedCourseData,
          capacity: {
            ...updatedCourseData.capacity,
            available: +updatedCourseData.capacity.available + 1,
          },
        };
      }

      await fetch(`http://localhost:2543/classes/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCourseData),
      });

      return {
        status: "success",
        message:
          "Successfully left course & added next available waitlist student to course",
      };
    } else {
      // Update course avalability
      const courseInfoRes = await fetch(
        `http://localhost:2543/classes/${courseId}`
      );
      const courseInfoData = await courseInfoRes.json();

      await fetch(`http://localhost:2543/classes/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...courseInfoData,
          capacity: {
            max: courseInfoData.max,
            available: courseInfoData.available + 1,
          },
        }),
      });

      return {
        status: "success",
        message: "Successfully left course",
      };
    }
  };

  // Function to add a student from the waitlist to the course (given they're allowed to enroll)
  const addStudentFromWaitlist = async (stdInfo, courseId, termInfo) => {
    const { id: stdId, name: stdName } = stdInfo;
    const { semester, year } = termInfo;

    const courseInfoRes = await fetch(
      `http://localhost:2543/classes/${courseId}`
    );
    const courseInfoData = await courseInfoRes.json();

    const stdRes = await fetch(
      `http://localhost:2543/grades?student.id=${stdId}&term.semester=${semester}&term.year=${year}`
    );
    const stdCourses = await stdRes.json();

    if (stdCourses.length === 4)
      return {
        status: "error",
        message: "Student is already taking the maximum number of courses",
      };

    const allCourseTimes =
      stdCourses.reduce(
        (allCourses, newCourse) => allCourses.concat(newCourse.time),
        courseInfoData.time
      ) || courseInfoData.time;
    const conflicts = checkConflicts(allCourseTimes);

    if (conflicts)
      return {
        status: "error",
        message: "Student has conflict with other courses",
      };

    // enroll student into course, return "success" object
    const gradeObj = {
      id: uuidv4(),
      course: {
        ...courseInfoData.course,
        id: courseId,
      },
      instructor: courseInfoData.instructor,
      student: {
        id: stdId,
        name: stdName,
      },
      term: {
        semester,
        year,
      },
      grade: "",
    };

    const postRes = await fetch("http://localhost:2543/grades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gradeObj),
    });

    // Remove student from waitlist
    await removeStudentFromWaitlist(stdId, courseId);

    if (postRes.ok) {
      return {
        status: "success",
        message: `${stdName} successfully enrolled into ${courseInfoData.course.name}`,
      };
    }
    return { status: "error", message: "Database failed to enroll student" };
  };

  // Function to remove the student from the waitlist
  const removeStudentFromWaitlist = async (stdId, courseId) => {
    const courseRes = await fetch(`http://localhost:2543/classes/${courseId}`);
    const courseData = await courseRes.json();
    const updatedCourseData = {
      ...courseData,
      waitList: courseData.waitList.filter((std) => std.id !== stdId),
    };

    const res = await fetch(`http://localhost:2543/classes/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCourseData),
    });

    return res.ok;
  };

  const getCourseList = async (termInfo) => {
    const { semester, year } = termInfo;

    const res = await fetch(
      `http://localhost:2543/classes?term.semester=${semester}&term.year=${year}&_sort=course.name`
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
    const enrolledInfo = enrolledData.map((grade) => ({
      id: grade.student.id,
      name: grade.student.name,
      grade: grade.grade,
    }));

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

  // Check if user is enrolled into course
  const checkIsEnrolled = async (stdId, courseId) => {
    const res = await fetch(
      `http://localhost:2543/grades?student.id=${stdId}&course.id=${courseId}`
    );
    const data = await res.json();
    return data.length === 1;
  };

  // Check if user is in the waitlist of a course
  const checkIfWaitlist = async (stdId, courseId) => {
    const res = await fetch(`http://localhost:2543/classes/${courseId}`);
    const data = await res.json();
    return data.waitList.some((std) => (std.id = stdId));
  };

  // Set grade for student in a course
  const setStdGrade = async (stdId, courseId, grade) => {
    const stdGradeRes = await fetch(
      `http://localhost:2543/grades?student.id=${stdId}&course.id=${courseId}`
    );
    const studGradeObjData = await stdGradeRes.json();

    const newStdGradeObj = {
      ...studGradeObjData[0],
      grade,
    };

    const res = await fetch(
      `http://localhost:2543/grades/${studGradeObjData[0].id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStdGradeObj),
      }
    );

    return res.ok;
  };

  // Group an array of classes by their major
  const groupClassByMajor = async (classArr) => {
    const coursesRes = await fetch("http://localhost:2543/courses");
    const coursesData = await coursesRes.json();

    const coursesMap = {};

    classArr.forEach((course) => {
      const courseEntry = coursesData.find(
        (x) => x.code === course.course.code
      );

      if (!coursesMap[courseEntry.department])
        coursesMap[courseEntry.department] = [];

      coursesMap[courseEntry.department] = [
        ...coursesMap[courseEntry.department],
        course,
      ];
    });

    return coursesMap;
  };

  // Check to see if the semester has courses
  const semesterHasCourse = async (semester, year) => {
    const coursesRes = await fetch(
      `http://localhost:2543/classes?term.semester=${semester}&term.year=${year}`
    );
    const coursesData = await coursesRes.json();

    return coursesData.length > 0;
  };

  // Get a class' GPA
  const getClassGPA = async (courseId) => {
    const gradesRes = await fetch(
      `http://localhost:2543/grades?course.id=${courseId}`
    );
    const gradesData = await gradesRes.json();

    const justGrades = gradesData
      .map((grade) => grade.grade)
      .filter((grade) => grade.length !== "");

    const gpa = calculateGPA(justGrades);
    return isNaN(parseInt(gpa)) ? null : +gpa;
  };

  // Get Course Rating
  const getCourseAvgRating = async (courseName, courseCode) => {
    const courseReviewsRes = await fetch(
      `http://localhost:2543/reviews?course.name=${courseName}&course.code=${courseCode}`
    );
    const courseReviewsData = await courseReviewsRes.json();

    if (courseReviewsData.length === 0) return null;

    return calcAvgRating(courseReviewsData);
  };

  // Update Base Course Rating [template course]
  const updateBaseCourseRating = async (name, code) => {
    const baseCourseRes = await fetch(
      `http://localhost:2543/courses?code=${code}&name=${name}`
    );
    const baseCourseData = await baseCourseRes.json();
    const baseCourse = baseCourseData[0];

    const reviewsRes = await fetch(
      `http://localhost:2543/reviews?course.code=${code}&course.name=${name}`
    );
    const reviewsData = await reviewsRes.json();

    const newRating =
      reviewsData.length === 0 ? null : calcAvgRating(reviewsData);

    if (!newRating) return true;

    const res = await fetch(`http://localhost:2543/courses/${baseCourse.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ...baseCourse,
        rating: newRating,
      }),
    });

    return res.ok;
  };

  // Update All (Base) Class Ratings for the course that courses that just concluded
  const updateAllClassRatings = async (semester, year) => {
    const queryString = semester
      ? `?term.semester=${semester}&term.year=${year}`
      : "";

    const courseRes = await fetch(
      `http://localhost:2543/classes${queryString}`
    );
    const courseData = await courseRes.json();

    for (const completedClass of courseData) {
      await updateBaseCourseRating(
        completedClass.course.name,
        completedClass.course.code
      );
    }
  };

  // Function to get the top 3 and bottom 3 rated classes
  const getProgramClassStats = async () => {
    const top3Res = await fetch(
      `http://localhost:2543/courses?_sort=rating&rating_ne=null&_order=desc&_limit=3&rating_ne=null`
    );
    const top3Data = await top3Res.json();

    const bottom3Res = await fetch(
      `http://localhost:2543/courses?_sort=rating&_order=asc&_limit=3&rating_ne=null`
    );
    const bottom3Data = await bottom3Res.json();

    return { top3: top3Data, bottom3: bottom3Data };
  };

  // Function to get the basic courses (not course by semester)
  const getBasicCourse = async () => {
    const res = await fetch(`http://localhost:2543/courses`);
    const data = await res.json();
    return data;
  };

  // Function to get the basic course info from the basic course's id (template course id)
  const getBasicCourseById = async (id) => {
    const res = await fetch(`http://localhost:2543/courses/${id}`);
    const data = await res.json();
    return data;
  };

  // Function to get the all the previous and current instances of a course
  const getBasicCourseInstances = async (name, code) => {
    const res = await fetch(
      `http://localhost:2543/classes?course.code=${code}&course.name=${name}`
    );
    const data = await res.json();
    return data;
  };

  // Function to get number of instances of a course in semester
  const numCourseInstanceInSemester = async (semester, year, name, code) => {
    const res = await fetch(
      `http://localhost:2543/classes?term.semester=${semester}&term.year=${year}&course.code=${code}&course.name=${name}`
    );
    const data = await res.json();
    return data.length;
  };

  return {
    addCourse,
    deleteCourse,
    enrollCourse,
    unEnrollCourse,
    leaveWaitlist,
    getCourseInfo,
    getCourseList,
    getAllBaseCourses,
    checkIsEnrolled,
    checkIfWaitlist,
    addStudentFromWaitlist,
    removeStudentFromWaitlist,
    setStdGrade,
    groupClassByMajor,
    cancelCourse,
    listToBeCancelledCourse,
    semesterHasCourse,
    getClassGPA,
    getCourseAvgRating,
    updateBaseCourseRating,
    updateAllClassRatings,
    getProgramClassStats,
    getBasicCourse,
    getBasicCourseById,
    getBasicCourseInstances,
    numCourseInstanceInSemester,
  };
};

export default useCourseFetch;
