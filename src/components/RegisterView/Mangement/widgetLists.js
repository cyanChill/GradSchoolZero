import {
  FaClipboardList,
  FaUserPlus,
  FaChalkboardTeacher,
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
];

export default widgetLists;
