import React, { useState, useEffect, useCallback } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

import axios from "./axios-instance";
import Board from "./containers/Board/board";
import Boards from "./containers/Boards/boards";
import Card from "./containers/Card/card";
import Layout from "./components/Layout/layout";
import Login from "./containers/Auth/Login/login";
import Signup from "./containers/Auth/Signup/signup";

import "./App.scss";
import "./styles/app-colors.scss";

function App() {
  const history = useHistory();
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState(null);
  const [authData, setAuthData] = useState({
    isAuth: false,
    token: null,
    userId: null,
  });

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryDate");
    setAuthData({
      isAuth: false,
      token: null,
      userId: null,
    });
  }, []);

  const setAutoLogout = useCallback(
    (milliseconds) => {
      setTimeout(() => {
        logoutHandler();
      }, milliseconds);
    },
    [logoutHandler]
  );

  const logoutAction = () => {
    logoutHandler();
    history.push("/login");
  };

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
  }, [logoutHandler, setAutoLogout]);

  const loginHandler = (user) => {
    setReqLoading(true);
    setReqError(null);

    axios
      .post("auth/login", user)
      .then((res) => {
        setAuthData({
          isAuth: true,
          token: res.data.token,
          userId: res.data.userId,
        });
        setReqLoading(false);
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
        setReqLoading(false);
        setReqError(err.response.data.message);

        setTimeout(() => {
          setReqError(null);
        }, 5000);
      });
  };

  const signupHandler = (user) => {
    setReqLoading(true);
    setReqError(null);

    axios
      .put("auth/signup", user)
      .then(() => {
        setReqLoading(false);
        history.push("/login");
      })
      .catch((err) => {
        setReqLoading(false);
        setReqError(err.response.data.message);

        setTimeout(() => {
          setReqError(null);
        }, 5000);
      });
  };

  let routes = (
    <Switch>
      <Route
        path="/signup"
        render={() => (
          <Signup
            onSignup={signupHandler}
            loading={reqLoading}
            error={reqError}
          />
        )}
      />
      <Route
        path="/login"
        render={() => (
          <Login onLogin={loginHandler} loading={reqLoading} error={reqError} />
        )}
      />
      <Redirect exact from="/" to="/login" />
    </Switch>
  );

  if (authData.isAuth) {
    routes = (
      <Switch>
        <Route
          path="/boards"
          exact
          render={() => <Boards token={authData.token} />}
        />
        <Route
          exact
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
    <Layout isAuth={authData.isAuth} logout={logoutAction}>
      {routes}
    </Layout>
  );
}

export default App;
