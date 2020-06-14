import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded";
import { Tooltip } from "@material-ui/core";

export const Header = () => {
  return (
    <div className="HeaderContainer">
      <div className="HeaderContent">
        <h1 className="LoginHeader HeaderTitle">Bookqlub</h1>

        <Tooltip title="Logout">
          <IconButton className="HeaderButton">
            <MeetingRoomRoundedIcon className="HeaderButtonIcon" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="HeaderDivider" />
    </div>
  );
};
