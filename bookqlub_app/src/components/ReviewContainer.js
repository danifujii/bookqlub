import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export const ReviewContainer = () => {
  const [year, setYear] = useState(2020);

  return (
    <div>
      <h1 className="ReviewHeader">My reviews</h1>
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">Year</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          label="Year"
        >
          <MenuItem value={2020}>2020</MenuItem>
          <MenuItem value={2019}>2019</MenuItem>
          <MenuItem value={2018}>2018</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
