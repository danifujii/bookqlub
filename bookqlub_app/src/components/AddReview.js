import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";

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

      <AddReviewModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
    </div>
  );
};

const AddReviewModal = (props) => {
  const { handleClose, open } = props;
  return (
    <Modal onClose={handleClose} open={open} outline="0">
      <div>
        <Paper>
          <h1>Add review</h1>
        </Paper>
      </div>
    </Modal>
  );
};
