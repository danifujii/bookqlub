import React from "react";

import "./SuggestBook.css";
import { SuggestionForm } from "./SuggestionForm";

export const SuggestionContainer = (props) => {
  return (
    <div>
      <h1 className="ReviewHeader">Book suggestion</h1>
      <p className="SuggestMessage">
        You can suggest a book that is missing from the current database.
      </p>

      <SuggestionForm />
    </div>
  );
};
