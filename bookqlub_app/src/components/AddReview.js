import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Fab from "@material-ui/core/Fab";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import AddIcon from "@material-ui/icons/Add";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const REVIEW_VALUES = ["Excellent", "Great", "Good", "Ok"];

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
      <AddReviewModalContent />
    </div>
  );
};

const AddReviewModalContent = (props) => {
  const [reviewDate, setReviewDate] = useState(new Date());

  return (
    <div className="AddReviewContentContainer">
      <h1>Add review</h1>

      <h3 className="AddReviewSubtitle">Title</h3>
      <Input placeholder="Book title" fullWidth />

      <h3 className="AddReviewSubtitle">Value</h3>
      <Select fullWidth placeholder="Value">
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
