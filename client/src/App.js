import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import add from "./components/add";
import send from "./components/send";
import status from "./components/status";
import Navbar from "./components/nav";
import home from "./components/home";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/add" component={add} />
            <Route exact path="/send" component={send} />
            <Route exact path="/status" component={status} />
            <Route exact path="/home" component={home} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
