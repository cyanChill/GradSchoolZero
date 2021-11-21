import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../../GlobalContext";

import { Container } from "react-bootstrap";
import useCourseFetch from "../../../hooks/useCourseFetch";
import CenterSpinner from "../../UI/CenterSpinner";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";

const Courses = () => {
  const { termHook } = useContext(GlobalContext);
  const { termInfo } = termHook;
  const { getCourseList } = useCourseFetch();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const populateCourseList = async () => {
      setLoading(true);
      const data = await getCourseList();
      setCourseList(data);
      setLoading(false);
    };

    populateCourseList();
  }, []);

  const coursesWidgets = courseList.map((course) => (
    <LinkBoxWidget
      key={course.id}
      to={`/courses/${course.id}`}
      text={course.courseInfo.name}
    />
  ));

  return (
    <Container>
      <h1 className="my-3 text-center">
        {`${termInfo.semester} ${termInfo.year}`} Courses:
      </h1>
      {loading && <CenterSpinner />}
      {!loading && coursesWidgets}
    </Container>
  );
};

export default Courses;
