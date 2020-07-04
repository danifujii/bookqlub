import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import LinearProgress from "@material-ui/core/LinearProgress";
import _ from "lodash";

import { AddReviewButton } from "../add_review/AddReviewButton";
import { ReviewGrid } from "./ReviewsGrid";
import { ReviewYearSelector } from "./ReviewYearSelector";

import "./Reviews.css";

const GET_REVIEW_YEARS = gql`
  {
    reviewsYears
  }
`;

export const ReviewsContainer = () => {
  const [selectedYear, setSelectedYear] = useState(undefined);
  const [years, setYears] = useState(undefined);
  const [getReviewYears, { loading, error, data }] = useLazyQuery(
    GET_REVIEW_YEARS,
    {
      fetchPolicy: "cache-and-network", // So that refetch goes to server
    }
  );

  useEffect(() => {
    getReviewYears();
  }, []);

  useEffect(() => {
    const yearsData =
      data && data.reviewsYears ? data.reviewsYears.concat() : [];
    if (yearsData && !_.isEmpty(yearsData)) {
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
    return <LinearProgress className="ReviewLoading" />;
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <h1 className="SectionHeader">My reviews</h1>
      {years && !_.isEmpty(years) ? (
        <ReviewYearSelector onYearChanged={setSelectedYear} years={years} />
      ) : (
        <p>
          No reviews have been found. Add some by pressing on the{" "}
          <b>Add review</b> button.
        </p>
      )}
      {selectedYear && (
        <ReviewGrid year={selectedYear} onDelete={() => getReviewYears()} />
      )}
      <AddReviewButton onSubmit={() => getReviewYears()} />
    </div>
  );
};
