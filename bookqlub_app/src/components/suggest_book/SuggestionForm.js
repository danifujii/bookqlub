import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Button } from "@material-ui/core";
import LibraryAddRoundedIcon from "@material-ui/icons/LibraryAddRounded";
import { useForm } from "react-hook-form";

const URL_REGEX = /https?:\/\/(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

export const SuggestionForm = (props) => {
  const [releaseDate, setReleaseDate] = useState(undefined);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h3 className="SuggestInputHeader">Title</h3>
        <TextField
          label="Book title"
          variant="outlined"
          className="SuggestInput"
          name="title"
          inputRef={register({
            required: true,
            minLength: 3,
            maxLength: 300,
          })}
          error={errors.title !== undefined}
          helperText={errors.title && "Invalid book title"}
        />

        <h3 className="SuggestInputHeader">Author</h3>
        <TextField
          label="Book author"
          variant="outlined"
          className="SuggestInput"
          name="author"
          inputRef={register({ required: true, minLength: 10, maxLength: 200 })}
          error={errors.author !== undefined}
          helperText={errors.author && "Invalid author"}
        />

        <h3 className="SuggestInputHeader">Cover URL</h3>
        <TextField
          label="Book cover"
          variant="outlined"
          className="SuggestInput"
          name="cover"
          inputRef={register({ pattern: URL_REGEX })}
          error={errors.cover !== undefined}
          helperText={errors.cover && "Invalid URL"}
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
            type="submit"
            startIcon={<LibraryAddRoundedIcon />}
          >
            Suggest
          </Button>
        </div>
      </form>
    </div>
  );
};
