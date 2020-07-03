import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Button } from "@material-ui/core";
import LibraryAddRoundedIcon from "@material-ui/icons/LibraryAddRounded";

export const SuggestionForm = (props) => {
  const [releaseDate, setReleaseDate] = useState(undefined);

  return (
    <div>
      <form>
        <h3 className="SuggestInputHeader">Title</h3>
        <TextField
          label="Book title"
          variant="outlined"
          className="SuggestInput"
          required
        />

        <h3 className="SuggestInputHeader">Author</h3>
        <TextField
          label="Book author"
          variant="outlined"
          className="SuggestInput"
          required
        />

        <h3 className="SuggestInputHeader">Cover URL</h3>
        <TextField
          label="Book cover"
          variant="outlined"
          className="SuggestInput"
        />

        <h3 className="SuggestInputHeader">Release date</h3>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            disableFuture
            variant="inline"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            value={releaseDate}
            onChange={(date) => setReleaseDate(date)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            fullWidth
            style={{ marginTop: 0 }}
          />
        </MuiPickersUtilsProvider>

        <div className="SuggestButton">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<LibraryAddRoundedIcon />}
          >
            Suggest
          </Button>
        </div>
      </form>
    </div>
  );
};
