import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

import { AddReviewDialog } from "./AddReviewDialog";

export const AddReviewButton = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="Fab">
      <Fab
        variant="extended"
        color="primary"
        onClick={(_) => setModalOpen(true)}
      >
        <AddIcon className="FabIcon" />
        Add review
      </Fab>

      <AddReviewDialog
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        {...props}
      />
    </div>
  );
};
