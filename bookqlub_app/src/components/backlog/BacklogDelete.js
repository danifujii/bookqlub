import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { Button, DialogContent, CircularProgress } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";

const DELETE_BACKLOG_ENTRY = gql`
  mutation DeleteBacklogEntry($book_id: ID!) {
    deleteBacklogEntry(bookId: $book_id) {
      ok
    }
  }
`;

export const BacklogDeleteDialog = (props) => {
  const { bookId, open, onClose, onDelete } = props;
  const [deleteBacklogEntry, { loading, error }] = useMutation(
    DELETE_BACKLOG_ENTRY
  );

  const handleDelete = () => {
    deleteBacklogEntry({ variables: { book_id: bookId } })
      .then(() => onDelete())
      .catch((e) => console.log(e));
  };

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown open={open}>
      <DialogTitle>Delete backlog entry</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this backlog entry?
        </DialogContentText>
        {error && (
          <DialogContentText>
            <p className="ErrorMsg">{error.message}</p>
          </DialogContentText>
        )}
      </DialogContent>
      <div>
        {loading ? (
          <CircularProgress className="ReviewDeleteProgress" />
        ) : (
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        )}
      </div>
    </Dialog>
  );
};
