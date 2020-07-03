import React from "react";

import "./SuggestBook.css";
import { SuggestionForm } from "./SuggestionForm";
import { useTheme, useMediaQuery } from "@material-ui/core";

export const SuggestionContainer = (props) => {
  const theme = useTheme();
  const bigDevice = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <div>
      <h1 className="ReviewHeader">Book suggestion</h1>
      <p className="SuggestMessage">
        You can suggest a book that is missing from the current database.
      </p>

      <div>
        <div style={bigDevice ? { width: "80%" } : {}}>
          <SuggestionForm />
        </div>
      </div>
    </div>
  );
};
