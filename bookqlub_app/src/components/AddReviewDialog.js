import React, { useState } from "react";
import { gql } from "apollo-boost";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { CircularProgress, useTheme, useMediaQuery } from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import { BookTitleInput } from "./BookTitleInput";

const REVIEW_VALUES = ["Excellent", "Great", "Good", "Ok"];

const ADD_REVIEW = gql`
  mutation CreateReview(
    $book_id: ID!
    $comment: String!
    $value: ReviewValue!
    $date: Date
  ) {
    createReview(
      bookId: $book_id
      comment: $comment
      value: $value
      date: $date
    ) {
      review {
        bookId
      }
    }
  }
`;

export const AddReviewDialog = (props) => {
  const { open, onClose } = props;
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="md"
      fullScreen={smallDevice}
    >
      <AddReviewModalForm closeDialog={onClose} {...props} />
    </Dialog>
  );
};

const AddReviewModalForm = (props) => {
  const [book, setBook] = useState(undefined);
  const [value, setValue] = useState(REVIEW_VALUES[0]);
  const [reviewDate, setReviewDate] = useState(new Date());
  const [comment, setComment] = useState("");

  const [formError, setFormError] = useState(undefined);
  const [titleError, setTitleError] = useState(undefined);

  const [
    addReview,
    { loading: onAddingReview, error: addReviewError },
  ] = useMutation(ADD_REVIEW);

  const handleSubmit = (_) => {
    if (book) {
      setFormError(undefined);
      addReview({
        variables: {
          book_id: book.id,
          comment: comment,
          value: value.toUpperCase(),
          date: reviewDate.toISOString().split("T")[0],
        },
      })
        .then(() => {
          props.closeDialog();
          props.onSubmit();
        })
        .catch((e) => console.log(e));
    } else setFormError("No book selected for this review");
  };

  return (
    <div className="AddReviewContentContainer">
      <h1>Add review</h1>

      <h3 className="AddReviewSubtitle">Title</h3>
      <BookTitleInput onSetBook={setBook} onError={setTitleError} />

      <h3 className="AddReviewSubtitle">Value</h3>
      <Select
        fullWidth
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {REVIEW_VALUES.map((value) => (
          <MenuItem value={value} key={value}>
            {value}
          </MenuItem>
        ))}
      </Select>

      <h3 className="AddReviewSubtitle">Finish date</h3>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          value={reviewDate}
          onChange={(date) => setReviewDate(date)}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          style={{ marginTop: 0 }}
          fullWidth
        />
      </MuiPickersUtilsProvider>

      <h3 className="AddReviewSubtitle">Comment</h3>
      <Input
        placeholder="Review comments"
        fullWidth
        multiline
        rows={3}
        onChange={(e) => setComment(e.target.value)}
      />

      {(formError || titleError || addReviewError) && (
        <p className="ErrorMsg">
          {formError ||
            (titleError && titleError.message) ||
            (addReviewError && addReviewError.message)}
        </p>
      )}

      <div className="AddReviewButtons">
        {onAddingReview ? (
          <CircularProgress className="AddReviewLoading" />
        ) : (
          <DialogActions>
            <Button color="primary" onClick={() => props.closeDialog()}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add review
            </Button>
          </DialogActions>
        )}
      </div>
    </div>
  );
};
