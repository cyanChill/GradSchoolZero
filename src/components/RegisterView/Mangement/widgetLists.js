import {
  FaClipboardList,
  FaUserPlus,
  FaChalkboardTeacher,
  FaCommentSlash,
  FaTasks,
} from "react-icons/fa";

const widgetLists = [
  {
    icon: <FaClipboardList />,
    label: "View Applications",
    linkTo: "/applications",
  },
  {
    icon: <FaUserPlus />,
    label: "Create User",
    linkTo: "/create/user",
  },
  {
    icon: <FaChalkboardTeacher />,
    label: "Create Course",
    linkTo: "/create/course",
  },
  {
    icon: <FaCommentSlash />,
    label: "Manage Taboo Words",
    linkTo: "/taboo",
  },
  {
    icon: <FaTasks />,
    label: "Semester Management",
    linkTo: "/semester",
  },
];

export default widgetLists;
