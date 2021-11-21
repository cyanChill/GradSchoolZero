import {
  FaClipboardList,
  FaUserPlus,
  FaChalkboardTeacher,
  FaCommentSlash,
  FaTasks,
  FaGraduationCap,
  FaClipboard,
  FaGavel,
} from "react-icons/fa";

const widgetLists = [
  {
    icon: <FaTasks />,
    label: "Semester Management",
    linkTo: "/semester",
  },
  {
    icon: <FaClipboard />,
    label: "View Complaints",
    linkTo: "/complaints",
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
  {
    icon: <FaGavel />,
    label: "User Infractions",
    linkTo: "/infractions",
  },
];

export default widgetLists;
