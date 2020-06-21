import React, { useContext } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import IconButton from "@material-ui/core/IconButton";
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded";
import { Tooltip } from "@material-ui/core";

import { UserContext } from "../App";

export const Header = () => {
  const { setUsername } = useContext(UserContext);
  const apolloClient = useApolloClient();

  return (
    <div className="HeaderContainer">
      <div className="HeaderContent">
        <a href="/">
          <h1 className="LoginHeader HeaderTitle">Bookqlub</h1>
        </a>

        <Tooltip title="Logout">
          <IconButton
            className="HeaderButton"
            onClick={() => logout(setUsername, apolloClient)}
          >
            <MeetingRoomRoundedIcon className="HeaderButtonIcon" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="HeaderDivider" />
    </div>
  );
};

const logout = (setUsername, apolloClient) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  apolloClient.resetStore();
  setUsername(undefined);
};
