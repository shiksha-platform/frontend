import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ header, footer, children }) {
  return (
    <>
      <Header {...header} />
      {children}
      <Footer {...footer} />
    </>
  );
}
