import React from "react";
import Navbar from "./Navbar/navbar";

const Layout = (props) => {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
};

export default Layout;
