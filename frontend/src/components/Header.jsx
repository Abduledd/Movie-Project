import React from "react";
import logowhite from "../assets/logowhite.png";
const Header = () => {
  return (
    <div
      className="flex items-center bg-black h-16 w-full text-white"
      style={{ fontFamily: "Poppins" }}>
      <img src={logowhite} alt="" className="w-16 h-16" />
      <h1 className="flex-grow ml-2 text-center">
        Welcome to Movies Recommendations System
      </h1>
    </div>
  );
};

export default Header;
