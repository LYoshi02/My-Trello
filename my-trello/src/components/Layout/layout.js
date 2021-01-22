import React from "react";
import Navbar from "./Navbar/navbar";

const Layout = (props) => {
  return (
    <>
      <Navbar isAuth={props.isAuth} onLogout={props.logout} />
      {props.children}
    </>
  );
};

export default Layout;
