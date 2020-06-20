import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";

export const AboutDialog = (props) => {
  const { open, onClose } = props;

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>About Bookqlub</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bookqlub is a book review site built by Daniel Fujii.
          </DialogContentText>
          <DialogContentText>
            You can find more information about the implementation and its
            source code in &nbsp;
            <a
              href="https://github.com/danifujii/bookqlub"
              target="_blank"
              rel="noopener noreferrer"
            >
              the Github repository.
            </a>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" autoFocus>
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
