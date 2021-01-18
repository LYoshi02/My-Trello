import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

import axios from "./axios-instance";
import Board from "./containers/Board/board";
import Boards from "./containers/Boards/boards";
import Card from "./containers/Card/card";
import Layout from "./components/Layout/layout";
import Login from "./containers/Auth/Login/login";
import Signup from "./containers/Auth/Signup/signup";

import "./App.scss";
import "./styles/tag-colors.scss";

function App() {
  const history = useHistory();
  const [authData, setAuthData] = useState({
    isAuth: false,
    token: null,
    userId: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setAuthData({
      isAuth: true,
      token,
      userId,
    });
    setAutoLogout(remainingMilliseconds);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryDate");
  };

  const setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const loginHandler = (user) => {
    axios
      .post("auth/login", user)
      .then((res) => {
        console.log(res);
        setAuthData({
          isAuth: true,
          token: res.data.token,
          userId: res.data.userId,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        const remainingMilliseconds = 60 * 60 * 24000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
        history.push("/boards");
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(user);
  };

  const signupHandler = (user) => {
    axios
      .put("auth/signup", user)
      .then((res) => {
        console.log(res);
        history.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(user);
  };

  let routes = (
    <Switch>
      <Route
        path="/signup"
        render={() => <Signup onSignup={signupHandler} />}
      />
      <Route path="/login" render={() => <Login onLogin={loginHandler} />} />
      <Redirect to="/login" />
    </Switch>
  );

  if (authData.isAuth) {
    console.log(authData.token);
    routes = (
      <Switch>
        <Route
          path="/boards"
          exact
          render={() => <Boards token={authData.token} />}
        />
        <Route
          path="/board/:boardId"
          render={(props) => <Board {...props} token={authData.token} />}
        />
        <Route
          path="/card/:cardId"
          render={(props) => <Card {...props} token={authData.token} />}
        />
        <Redirect to="/boards" />
      </Switch>
    );
  }

  return (
    <Router>
      <Layout>{routes}</Layout>
    </Router>
  );
}

export default App;
