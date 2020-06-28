import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Button, CircularProgress } from "@material-ui/core";
import AddRoundedIcon from "@material-ui/icons/AddRounded";

import { BookTitleInput } from "../add_review/BookTitleInput";

const ADD_BACKLOG_ENTRY = gql`
  mutation AddBacklogEntry($book_id: ID!) {
    addBacklogEntry(bookId: $book_id) {
      ok
    }
  }
`;

export const BacklogAdd = (props) => {
  const [book, setBook] = useState(undefined);
  const [bookError, setBookError] = useState(undefined);

  const [addBacklog, { loading, error }] = useMutation(ADD_BACKLOG_ENTRY);
  const onAdd = () => {
    addBacklog({ variables: { book_id: book.id } })
      .then(() => {
        if (props.onSuccessfulAdd) props.onSuccessfulAdd();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <div className="BacklogAddContainer">
        <div className="BacklogAddInput">
          <BookTitleInput onSetBook={setBook} onError={setBookError} />
        </div>
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Button
            startIcon={<AddRoundedIcon />}
            color="primary"
            variant="contained"
            disabled={!book}
            onClick={onAdd}
          >
            Add
          </Button>
        )}
      </div>
      {(bookError || error) && (
        <p className="ErrorMsg">
          {bookError ? bookError.message : error.message}
        </p>
      )}
    </div>
  );
};
