import React, { useState } from "react";
import { Grid } from "@material-ui/core";

import { Review } from "../review_grid/Review";
import { BacklogDeleteDialog } from "./BacklogDelete";

export const BacklogGrid = (props) => {
  return (
    <div className="BacklogGrid">
      <Grid container spacing={2}>
        {props.backlog.map((backlog, idx) => (
          <Grid item lg={4} md={6} xs={12} key={idx}>
            <BacklogEntry book={backlog.book} {...props} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const BacklogEntry = (props) => {
  const { book, onDelete } = props;

  const [deleteOpen, setDeleteOpen] = useState(false);

  const onDeleteClick = () => {
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    onDelete();
  };

  return (
    <div>
      <Review onDeleteClick={onDeleteClick} book={book} />
      <BacklogDeleteDialog
        bookId={props.book.id}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};
