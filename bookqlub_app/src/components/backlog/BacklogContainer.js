import React, { useEffect } from "react";
import { LinearProgress } from "@material-ui/core";
import { gql, useLazyQuery } from "@apollo/client";

import "./Backlog.css";
import { BacklogAdd } from "./BacklogAdd";
import { BacklogGrid } from "./BacklogGrid";

const GET_BACKLOG = gql`
  {
    backlog {
      book {
        id
        author
        title
        coverUrl
      }
    }
  }
`;

export const BacklogContainer = () => {
  const [getBooks, { data, loading, error }] = useLazyQuery(GET_BACKLOG, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div>
      <h1 className="SectionHeader">My backlog</h1>
      <p>
        Keep track of the books you would like to read. They will be removed
        automatically as you read them.
      </p>

      <BacklogAdd onSuccessfulAdd={getBooks} />
      {error && <p className="ErrorMsg">{error.message}</p>}
      {loading ? (
        <LinearProgress />
      ) : (
        data && <BacklogGrid backlog={data.backlog} onDelete={getBooks} />
      )}
    </div>
  );
};
