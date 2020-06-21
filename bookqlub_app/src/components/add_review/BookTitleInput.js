import React, { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import _ from "lodash";

const GET_BOOKS = gql`
  query BooksByTitle($title: String!) {
    booksByTitle(title: $title) {
      id
      title
      coverUrl
    }
  }
`;

export const BookTitleInput = (props) => {
  const { onError, onSetBook } = props;

  const [getBooks, { loading, error, data }] = useLazyQuery(GET_BOOKS);
  const [titleOpen, setTitleOpen] = useState(false);

  useEffect(() => {
    onError(error);
  }, [error, onError]);

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
    <Autocomplete
      open={titleOpen}
      fullWidth
      onOpen={() => setTitleOpen(true)}
      onClose={() => setTitleOpen(false)}
      onChange={(_, value) => onSetBook(value)}
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
  );
};
