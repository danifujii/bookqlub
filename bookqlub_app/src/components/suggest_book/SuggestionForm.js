import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Button, CircularProgress } from "@material-ui/core";
import LibraryAddRoundedIcon from "@material-ui/icons/LibraryAddRounded";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";

import { getFormError } from "../common/FormUtils";

const URL_REGEX = /https?:\/\/(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

const BOOK_SUGG_MUTATION = gql`
  mutation CreateBookSuggestion(
    $author: String!
    $title: String!
    $release_date: Date
    $cover_url: String
  ) {
    createBookSuggestion(
      author: $author
      title: $title
      releaseDate: $release_date
      coverUrl: $cover_url
    ) {
      book {
        title
      }
    }
  }
`;

export const SuggestionForm = () => {
  const [releaseDate, setReleaseDate] = useState(new Date());
  const { register, handleSubmit, errors } = useForm();

  const [addBookSugg, { loading, error }] = useMutation(BOOK_SUGG_MUTATION);

  const onSubmit = (data, e) => {
    const variables = {
      author: data.author,
      title: data.title,
      cover_url: data.cover,
      release_date: releaseDate.toISOString().split("T")[0],
    };
    addBookSugg({ variables: variables })
      .then(() => e.target.reset())
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h3 className="SuggestInputHeader">Title</h3>
        <TextField
          label="Book title *"
          variant="outlined"
          className="SuggestInput"
          name="title"
          inputRef={register({
            required: true,
            minLength: 3,
            maxLength: 300,
          })}
          error={errors.title !== undefined}
          helperText={getFormError(errors.title)}
        />

        <h3 className="SuggestInputHeader">Author</h3>
        <TextField
          label="Book author *"
          variant="outlined"
          className="SuggestInput"
          name="author"
          inputRef={register({ required: true, minLength: 10, maxLength: 200 })}
          error={errors.author !== undefined}
          helperText={getFormError(errors.author)}
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

        {error && <p className="ErrorMsg">{error.message}</p>}

        <div className="SuggestButton">
          {loading ? (
            <CircularProgress className="SuggestionProgressBar" />
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              startIcon={<LibraryAddRoundedIcon />}
            >
              Suggest
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
