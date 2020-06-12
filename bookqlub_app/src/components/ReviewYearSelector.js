import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export const ReviewYearSelector = (props) => {
  const [year, setYear] = useState(props.years[0]);

  const updateYear = (event) => {
    const selectedYear = event.target.value;
    props.onYearChanged(selectedYear);
    setYear(selectedYear);
  };

  return (
    <FormControl variant="outlined">
      <InputLabel id="demo-simple-select-outlined-label">Year</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        onChange={updateYear}
        value={year}
        label="Year"
      >
        {props.years.map((year) => (
          <MenuItem value={year} key={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
