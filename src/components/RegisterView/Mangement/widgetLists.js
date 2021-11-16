import {
  FaClipboardList,
  FaUserPlus,
  FaChalkboardTeacher,
  FaCommentSlash,
  FaTasks,
  FaGraduationCap,
  FaClipboard,
} from "react-icons/fa";

const widgetLists = [
  {
    icon: <FaTasks />,
    label: "Semester Management",
    linkTo: "/semester",
  },
  {
    icon: <FaClipboard />,
    label: "View Reports",
    linkTo: "/reports",
  },
  {
    icon: <FaClipboardList />,
    label: "View Applications",
    linkTo: "/applications",
  },
  {
    icon: <FaGraduationCap />,
    label: "Graduation Applications",
    linkTo: "/grad-apps",
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
];

export default widgetLists;
