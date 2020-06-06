import React from "react";
import Divider from "@material-ui/core/Divider";

export const OrDivider = () => {
  return (
    <div className="DividerContainer">
      <div className="DividerLineContainer">
        <Divider variant="middle" style={{ marginTop: "22px" }} />
      </div>
      <p className="DividerText">OR</p>
      <div className="DividerLineContainer">
        <Divider variant="middle" style={{ marginTop: "22px" }} />
      </div>
    </div>
  );
};
