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
import Apply from "./components/pages/Apply";
import CreateUserForm from "./components/pages/CreateUserForm";
import CreateCourse from "./components/pages/CreateCourse";
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
            <Apply />
          </PublicRoute>
          <PublicRoute path="/login" isAuthenticated={isLoggedIn}>
            <Login />
          </PublicRoute>

          {/* Logged in users only */}
          <ProtectedRoute path="/logout" isAuthenticated={isLoggedIn}>
            <Logout />
          </ProtectedRoute>

          {/* Registrar users only */}
          <RegistrarRoute path="/create/user" isAuthenticated={isLoggedIn} user={user}>
            <CreateUserForm />
          </RegistrarRoute>
          <RegistrarRoute path="/create/course" isAuthenticated={isLoggedIn} user={user}>
            <CreateCourse />
          </RegistrarRoute>

          {/* Page not found */}
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
