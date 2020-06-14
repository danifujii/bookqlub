import React, { useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded";
import { Tooltip } from "@material-ui/core";

import { UserContext } from "../App";

export const Header = () => {
  const { setUsername } = useContext(UserContext);

  return (
    <div className="HeaderContainer">
      <div className="HeaderContent">
        <h1 className="LoginHeader HeaderTitle">Bookqlub</h1>

        <Tooltip title="Logout">
          <IconButton
            className="HeaderButton"
            onClick={() => logout(setUsername)}
          >
            <MeetingRoomRoundedIcon className="HeaderButtonIcon" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="HeaderDivider" />
    </div>
  );
};

const logout = (setUsername) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  setUsername(undefined);
};
