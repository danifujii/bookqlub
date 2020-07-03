import React from "react";
import { NavLink } from "react-router-dom";

const linkTitles = {
  "/": "Reviews",
  "/suggest_book": "Suggest book",
};

export const Navbar = () => {
  return (
    <div className="NavbarContainer">
      {Object.keys(linkTitles).map((link) => (
        <NavLink to={link} exact activeClassName="NavLinkActive" key={link}>
          {linkTitles[link]}
        </NavLink>
      ))}
    </div>
  );
};
