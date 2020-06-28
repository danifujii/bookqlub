import React from "react";
import { NavLink } from "react-router-dom";

const linkTitles = {
  "/": "Reviews",
};

export const Navbar = () => {
  return (
    <div className="NavbarContainer">
      {Object.keys(linkTitles).map((link) => (
        <NavLink to={link} exact activeClassName="NavLinkActive">
          {linkTitles[link]}
        </NavLink>
      ))}
    </div>
  );
};
