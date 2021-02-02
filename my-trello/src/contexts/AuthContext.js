import React, { useContext, useState, useEffect, useCallback } from "react";

import axios from "../axios-instance";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

const ACCESS_TOKEN_DURATION = 60 * 60 * 1000; // 1 hour

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTimeoutId, setDeleteTimeoutId] = useState(null);

  function login(user) {
    return axios
      .post("auth/login", user)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        const remainingMilliseconds = ACCESS_TOKEN_DURATION;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        const timerId = deleteExpiredToken(remainingMilliseconds);

        setToken(res.data.token);
        setCurrentUser(res.data.user);
        setDeleteTimeoutId(timerId);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err.message;
        throw new Error(message);
      });
  }

  function signup(user) {
    return axios
      .put("auth/signup", user)
      .then(() => {})
      .catch((err) => {
        const message = err.response ? err.response.data.message : err.message;
        throw new Error(message);
      });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      localStorage.removeItem("refreshToken");
      axios
        .post("auth/logout", { token: refreshToken })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }

    setToken(null);
    setCurrentUser(null);
    setDeleteTimeoutId(null);
  }

  const deleteExpiredToken = useCallback((milliseconds) => {
    return setTimeout(() => {
      setLoading(true);
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      setToken(null);
      setCurrentUser(null);
    }, milliseconds);
  }, []);

  const refreshAccessToken = useCallback(() => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken == null) {
      return logout();
    }

    setLoading(true);
    axios
      .post("auth/refresh-token", { refreshToken })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        const remainingMilliseconds = ACCESS_TOKEN_DURATION;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        const timerId = deleteExpiredToken(remainingMilliseconds);

        setToken(res.data.token);
        setCurrentUser(res.data.user);
        setDeleteTimeoutId(timerId);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleteExpiredToken]);

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token && refreshToken) {
      refreshAccessToken();
    }

    return () => {
      clearTimeout(deleteTimeoutId);
    };
  }, [token, refreshAccessToken, deleteTimeoutId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token || !expiryDate || !refreshToken) {
      return setLoading(false);
    }

    if (new Date(expiryDate) <= new Date()) {
      return refreshAccessToken();
    }

    axios
      .post("auth/user", { token })
      .then((res) => {
        const remainingMilliseconds =
          new Date(expiryDate).getTime() - new Date().getTime();
        const timerId = deleteExpiredToken(remainingMilliseconds);

        setDeleteTimeoutId(timerId);
        setToken(token);
        setCurrentUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [refreshAccessToken, deleteExpiredToken]);

  const value = {
    currentUser,
    token,
    login,
    signup,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
