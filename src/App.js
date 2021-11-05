import "./styles/App.scss";
import { Container } from "react-bootstrap";

/* For page routing */
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Classes from "./components/pages/Classes";
import Profile from "./components/pages/Profile";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import Apply from "./components/pages/Apply";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/classes">
            <Classes />
          </Route>
          <Route path="/about" component={About} />
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/apply" component={Apply} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
