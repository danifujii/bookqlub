import React, { useState } from "react";
import { AboutDialog } from "./AboutDialog";

export const Footer = () => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div className="FooterContainer">
      <div className="FooterDivider" />
      <p>&copy; 2020, designed and built by Daniel Fujii &middot;</p>
      <a href="" onClick={handleLinkClick}>
        <p>&nbsp;About</p>
      </a>
      <AboutDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
};
