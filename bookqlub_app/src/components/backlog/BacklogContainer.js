import React from "react";

import "./Backlog.css";
import { BacklogAdd } from "./BacklogAdd";

export const BacklogContainer = () => {
  return (
    <div>
      <h1 className="SectionHeader">My backlog</h1>
      <p>
        Keep track of the books you would like to read. They will be removed
        automatically as you read them.
      </p>

      <BacklogAdd />
    </div>
  );
};
