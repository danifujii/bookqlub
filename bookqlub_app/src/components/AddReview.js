import React, { useState } from "react";
import { gql } from "apollo-boost";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Fab from "@material-ui/core/Fab";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { CircularProgress, TextField } from "@material-ui/core";
import { useLazyQuery } from "@apollo/react-hooks";
import _ from "lodash";

const REVIEW_VALUES = ["Excellent", "Great", "Good", "Ok"];

const GET_BOOKS = gql`
  query BooksByTitle($title: String!) {
    booksByTitle(title: $title) {
      id
      title
    }
  }
`;

export const AddReviewButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="Fab">
      <Fab
        variant="extended"
        color="secondary"
        onClick={(_) => setModalOpen(true)}
      >
        <AddIcon className="FabIcon" />
        Add review
      </Fab>

      <Dialog
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        maxWidth="md"
      >
        <AddReviewModalBody />
      </Dialog>
    </div>
  );
};

const AddReviewModalBody = (props) => {
  const { imageUrl } = props;
  return (
    <div className="AddReviewModalContainer">
      <div className="AddReviewCoverContainer">
        {imageUrl ? (
          <img src={imageUrl} alt="Book cover" className="AddReviewCover" />
        ) : (
          <p>Book cover</p>
        )}
      </div>
      <AddReviewModalForm />
    </div>
  );
};

const AddReviewModalForm = () => {
  const [title, setTitle] = useState(undefined);
  const [reviewDate, setReviewDate] = useState(new Date());

  const [titleOpen, setTitleOpen] = useState(false);

  const [getBooks, { loading, error, data }] = useLazyQuery(GET_BOOKS);

  const handleUserInput = (event) => {
    event.persist();
    queryBooks(event);
  };

  const queryBooks = _.debounce((event) => {
    const titleQuery = event.target.value;
    if (titleQuery) {
      getBooks({ variables: { title: titleQuery } });
    }
  }, 500);

  return (
    <div className="AddReviewContentContainer">
      <h1>Add review</h1>

      <h3 className="AddReviewSubtitle">Title</h3>
      <Autocomplete
        open={titleOpen}
        fullWidth
        onOpen={() => setTitleOpen(true)}
        onClose={() => setTitleOpen(false)}
        onChange={(_, value) => setTitle(value)}
        getOptionLabel={(option) => option.title}
        options={(data && data.booksByTitle) || []}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Book title"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading && <CircularProgress color="primary" size={20} />}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            onChange={handleUserInput}
          />
        )}
      />

      <h3 className="AddReviewSubtitle">Value</h3>
      <Select fullWidth placeholder="Value" value={REVIEW_VALUES[0]}>
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
      <Input placeholder="Review comments" fullWidth multiline rows={3} />

      <div className="AddReviewButtons">
        <DialogActions>
          <Button color="primary">Cancel</Button>
          <Button variant="contained" color="primary">
            Add review
          </Button>
        </DialogActions>
      </div>
    </div>
  );
};
