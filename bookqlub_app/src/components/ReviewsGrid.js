import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { LinearProgress, Grid } from "@material-ui/core";

import { Review } from "./Review";

const GET_REVIEWS = gql`
  {
    reviews {
      created
      value
      book {
        author
        title
        coverUrl
      }
    }
  }
`;

export const ReviewGrid = (props) => {
  const { loading, error, data } = useQuery(GET_REVIEWS);

  if (loading) {
    return (
      <div className="ReviewLoading">
        <LinearProgress />
      </div>
    );
  }

  if (error) {
    return (
      <p className="ErrorMsg">{`There was an error loading your reviews in this year.`}</p>
    );
  }

  return (
    <div>
      <h2>January</h2>
      <Grid container spacing={2}>
        {data.reviews.map((review, idx) => (
          <Grid item lg={4} md={6} xs={12} key={idx}>
            <Review review={review} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
