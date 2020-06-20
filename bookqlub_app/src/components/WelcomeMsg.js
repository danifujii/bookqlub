import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";

import { AboutDialog } from "./AboutDialog";

export const WelcomeMsg = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="WelcomeContent">
        <h2 className="WelcomeHeaderSmall">Welcome to</h2>
        <h1 className="WelcomeHeaderLarge">Bookqlub</h1>
        <div className="WelcomeSubheaderContainer">
          <p className="WelcomeSubheader">Your personal book review site</p>
          <IconButton onClick={() => setOpen(true)}>
            <InfoRoundedIcon className="WelcomeSubheaderButton" />
          </IconButton>
          <AboutDialog open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};
