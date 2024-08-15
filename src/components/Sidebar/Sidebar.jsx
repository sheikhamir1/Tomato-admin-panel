import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      {localStorage.getItem("token") ? (
        <div className="sidebar">
          <div className="sidebar-options">
            <NavLink to="/productCategory" className="sidebar-option">
              <img src={assets.add_icon} alt="" />
              <p>Product Category</p>
            </NavLink>
            <NavLink to="/product" className="sidebar-option">
              <img src={assets.add_icon} alt="" />
              <p>Products</p>
            </NavLink>
            <NavLink to="/orders" className="sidebar-option">
              <img src={assets.order_icon} alt="" />
              <p>Orders</p>
            </NavLink>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
