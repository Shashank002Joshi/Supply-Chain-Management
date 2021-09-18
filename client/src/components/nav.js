import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      <NavLink to="/home" className="header">
        Home
      </NavLink>
      <ul
        className="navbar-links"
        style={{ width: "35%", transform: open ? "translateX(0px)" : "" }}
      >
        <li>
          <NavLink to="/add" activeClassName="nav-active">
            Create New Item
          </NavLink>
        </li>
        <li>
          <NavLink to="/send" activeClassName="nav-active">
            Payment
          </NavLink>
        </li>
        <li>
          <NavLink to="/status" activeClassName="nav-active">
            Status
          </NavLink>
        </li>
      </ul>
      <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
    </nav>
  );
}
