import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ReviewGrid } from "./ReviewsGrid";

const ReviewYearSelector = (props) => {
  const [year, setYear] = useState(props.years ? props.years[0] : undefined);

  if (!props.years) {
    return (
      <p>
        No reviews have been found. Add some by pressing on the "Add review"
        button.
      </p>
    );
  }

  return (
    <FormControl variant="outlined">
      <InputLabel id="demo-simple-select-outlined-label">Year</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        label="Year"
      >
        {props.years.map((year) => (
          <MenuItem value={year}>{year}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const ReviewsContainer = () => {
  return (
    <div>
      <h1 className="ReviewHeader">My reviews</h1>
      <ReviewYearSelector />
      <ReviewGrid />
    </div>
  );
};
