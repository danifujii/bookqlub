import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";

import { ReviewGrid } from "./ReviewsGrid";
import { ReviewYearSelector } from "./ReviewYearSelector";

const GET_REVIEW_YEARS = gql`
  {
    reviewsYears
  }
`;

export const ReviewsContainer = () => {
  const [selectedYear, setSelectedYear] = useState(undefined);
  const [years, setYears] = useState(undefined);
  const { loading, error, data } = useQuery(GET_REVIEW_YEARS);

  useEffect(() => {
    const yearsData = data && data.reviewsYears;
    if (yearsData) {
      yearsData.sort((a, b) => b - a); // Desceding order of years
      setSelectedYear(yearsData[0]);
      setYears(yearsData);
    }
  }, [data]);

  if (error) {
    return (
      <p className="ErrorMsg">
        There was an error fetching your review information. Please try again
        later.
      </p>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (!years) {
    return (
      <p>
        No reviews have been found. Add some by pressing on the{" "}
        <b>Add review</b> button.
      </p>
    );
  }

  return (
    <div>
      <h1 className="ReviewHeader">My reviews</h1>
      {years && (
        <ReviewYearSelector onYearChanged={setSelectedYear} years={years} />
      )}
      {selectedYear && <ReviewGrid year={selectedYear} />}
    </div>
  );
};
