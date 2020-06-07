import React from "react";
import { Review } from "./Review";
import { Grid } from "@material-ui/core";

export const ReviewGrid = () => {
  return (
    <div>
      <h2>January</h2>
      <Grid container spacing={2}>
        <Grid item lg={4} md={6}>
          <Review />
        </Grid>
        <Grid item lg={4} md={6}>
          <Review />
        </Grid>
        <Grid item lg={4} md={6}>
          <Review />
        </Grid>
      </Grid>
    </div>
  );
};
