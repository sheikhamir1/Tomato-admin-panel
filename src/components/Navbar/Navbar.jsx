import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <>
      {localStorage.getItem("token") ? (
        <div className="navbar">
          <img className="logo" src={assets.logo} alt="" />
          <img className="profile" src={assets.profile_image} alt="" />
          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
