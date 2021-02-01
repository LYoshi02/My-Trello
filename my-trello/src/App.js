import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Board from "./containers/Board/board";
import Boards from "./containers/Boards/boards";
import Card from "./containers/Card/card";
import Layout from "./components/Layout/layout";
import Login from "./containers/Auth/Login/login";
import Signup from "./containers/Auth/Signup/signup";
import { useAuth } from "./contexts/AuthContext";

import "./App.scss";
import "./styles/app-colors.scss";

function App() {
  const { currentUser } = useAuth();

  let routes;
  if (currentUser) {
    routes = (
      <Switch>
        <Route path="/boards" exact component={Boards} />
        <Route exact path="/board/:boardId" component={Board} />
        <Route path="/card/:cardId" component={Card} />
        <Redirect to="/boards" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    );
  }

  return <Layout>{routes}</Layout>;
}

export default App;
