import React from "react";
import { Grid } from "@material-ui/core";

import { Review } from "../review_grid/Review";

export const BacklogGrid = (props) => {
  return (
    <div className="BacklogGrid">
      <Grid container spacing={2}>
        {props.backlog.map((backlog, idx) => (
          <Grid item lg={4} md={6} xs={12} key={idx}>
            <Review book={backlog.book} {...props} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
