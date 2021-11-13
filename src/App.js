import "./styles/App.scss";
import { Container } from "react-bootstrap";

import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";
/* For page routing */
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import RegistrarRoute from "./components/Routes/RegistrarRoute";

import NavBar from "./components/NavBar";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Classes from "./components/pages/Classes";
import Profile from "./components/pages/Profile";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import ApplyPage from "./components/pages/ApplyPage";
import CreateUserForm from "./components/RegisterView/Applications/CreateUserForm";
import CreateCourseForm from "./components/pages/CreateCourseForm";
import ApplicationsPage from "./components/RegisterView/Applications/ApplicationsPage";
import Applicant from "./components/RegisterView/Applications/Applicant";
import NotFound from "./components/pages/NotFound";

const App = () => {
  const { isLoggedIn, user } = useContext(GlobalContext);

  return (
    <Router>
      <NavBar />
      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/classes" component={Classes} />
          <Route path="/about" component={About} />
          <Route path="/profile" component={Profile} />

          {/* Not logged in users only*/}
          <PublicRoute path="/apply" isAuthenticated={isLoggedIn}>
            <ApplyPage />
          </PublicRoute>
          <PublicRoute path="/login" isAuthenticated={isLoggedIn}>
            <Login />
          </PublicRoute>

          {/* Logged in users only */}
          <ProtectedRoute path="/logout" isAuthenticated={isLoggedIn}>
            <Logout />
          </ProtectedRoute>

          {/* Registrar users only */}
          <RegistrarRoute
            path="/create/user"
            isAuthenticated={isLoggedIn}
            user={user}
            component={CreateUserForm}
          />
          <RegistrarRoute
            path="/create/course"
            isAuthenticated={isLoggedIn}
            user={user}
          >
            <CreateCourseForm />
          </RegistrarRoute>
          <RegistrarRoute
            exact
            path="/applications"
            isAuthenticated={isLoggedIn}
            user={user}
          >
            <ApplicationsPage />
          </RegistrarRoute>
          <RegistrarRoute
            path="/applications/:id"
            isAuthenticated={isLoggedIn}
            user={user}
          >
            <Applicant />
          </RegistrarRoute>

          {/* Page not found */}
          <Route path="*" component={NotFound} />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
