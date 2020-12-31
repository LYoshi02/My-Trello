import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Layout from "./components/Layout/layout";
import Board from "./pages/Board/board";
import Boards from "./pages/Boards/boards";

import "./App.scss";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/boards" component={Boards} />
          <Route path="/board/:boardId" component={Board} />
          <Redirect to="/boards" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
