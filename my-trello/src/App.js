import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Layout from "./components/Layout/layout";
import Board from "./containers/Board/board";
import Boards from "./containers/Boards/boards";
import Card from "./containers/Card/card";

import "./App.scss";
import "./styles/tag-colors.scss";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/boards" component={Boards} />
          <Route path="/board/:boardId" component={Board} />
          <Route path="/card/:cardId" component={Card} />
          <Redirect to="/boards" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
