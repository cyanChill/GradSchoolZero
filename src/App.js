import "./styles/App.scss";

/* For page routing */
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import RegistrarRoute from "./components/Routes/RegistrarRoute";

import NavBar from "./components/NavBar";
import Home from "./components/pages/Home/Home";
import About from "./components/pages/About/About";
import Courses from "./components/pages/Courses/Courses";
import Profile from "./components/pages/Profile/Profile";
import Login from "./components/pages/Login/Login";
import Logout from "./components/pages/Logout";
import ApplyPage from "./components/pages/Apply/ApplyPage";
import CreateUserForm from "./components/RegisterView/Applications/CreateUserForm";
import CreateCourseForm from "./components/RegisterView/Course/CreateCourseForm";
import ApplicationsPage from "./components/RegisterView/Applications/ApplicationsPage";
import Applicant from "./components/RegisterView/Applications/Applicant";
import RegistrarMangementPage from "./components/RegisterView/Mangement/RegistrarManagementPage";
import NotFound from "./components/pages/NotFound";
import ManageTaboo from "./components/RegisterView/Taboo/ManageTaboo";
import SemesterManagement from "./components/RegisterView/Mangement/SemesterManagement";
import Settings from "./components/pages/Settings";
import InfractionsPage from "./components/RegisterView/Infractions/InfractionsPage";
import ComplaintsPage from "./components/RegisterView/Complaints/ComplaintsPage";
import GradAppsPage from "./components/RegisterView/Applications/GradAppsPage";
import CoursePage from "./components/pages/Courses/CoursePage";
import Students from "./components/pages/Students";
import Instructors from "./components/pages/Instructors";
import AllCourses from "./components/pages/Courses/AllCourses";
import CourseHub from "./components/pages/Courses/CourseHub";
import RefreshStats from "./components/RegisterView/RefreshStats";

const App = () => {
  return (
    <Router>
      <NavBar />

      <div className="offset-height">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/allcourses" component={AllCourses} />
          <Route path="/allcourses/:id" component={CourseHub} />
          <Route exact path="/courses" component={Courses} />
          <Route path="/courses/:id" component={CoursePage} />
          <Route path="/about" component={About} />
          <Route path="/students" component={Students} />
          <Route path="/instructors" component={Instructors} />

          <ProtectedRoute exact path="/profile">
            <Profile />
          </ProtectedRoute>
          <Route path="/profile/:id" component={Profile} />

          <Route path="/logout" component={Logout} />

          {/* Not logged in users only*/}
          <PublicRoute path="/apply">
            <ApplyPage />
          </PublicRoute>
          <PublicRoute path="/login">
            <Login />
          </PublicRoute>

          {/* Logged in users only */}
          <ProtectedRoute path="/settings">
            <Settings />
          </ProtectedRoute>

          {/* Registrar users only */}
          <RegistrarRoute path="/registrar">
            <RegistrarMangementPage />
          </RegistrarRoute>
          <RegistrarRoute path="/create/user">
            <CreateUserForm />
          </RegistrarRoute>
          <RegistrarRoute path="/create/course">
            <CreateCourseForm />
          </RegistrarRoute>
          <RegistrarRoute exact path="/applications">
            <ApplicationsPage />
          </RegistrarRoute>
          <RegistrarRoute path="/applications/:id">
            <Applicant />
          </RegistrarRoute>
          <RegistrarRoute path="/taboo">
            <ManageTaboo />
          </RegistrarRoute>
          <RegistrarRoute path="/semester">
            <SemesterManagement />
          </RegistrarRoute>
          <RegistrarRoute exact path="/infractions">
            <InfractionsPage />
          </RegistrarRoute>
          <RegistrarRoute exact path="/complaints">
            <ComplaintsPage />
          </RegistrarRoute>
          <RegistrarRoute exact path="/grad-apps">
            <GradAppsPage />
          </RegistrarRoute>
          <RegistrarRoute exact path="/refresh">
            <RefreshStats />
          </RegistrarRoute>

          {/* Page not found */}
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
