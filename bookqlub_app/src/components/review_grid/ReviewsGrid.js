import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { LinearProgress, Grid } from "@material-ui/core";

import { Review } from "./Review";

const GET_REVIEWS = gql`
  query Reviews($year: Int!) {
    reviews(year: $year) {
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const ReviewGrid = (props) => {
  const [getReviews, { loading, error, data }] = useLazyQuery(GET_REVIEWS, {
    variables: { year: props.year },
    fetchPolicy: "cache-and-network",
  });
  const [reviewsPerMonth, setReviewsPerMonth] = useState(undefined);

  const trackScrolling = (event) => {
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight;
    if (atBottom) {
      console.log("At bottom");
      // Fetch next page
    }
  };

  useEffect(() => {
    getReviews();
    document.addEventListener("scroll", trackScrolling);

    return () => {
      document.removeEventListener("scroll", trackScrolling);
    };
  }, []);

  useEffect(() => {
    if (data && data.reviews) {
      setReviewsPerMonth(getReviewsByMonth(data.reviews));
    }
  }, [data]);

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
      {reviewsPerMonth &&
        MONTHS.concat()
          .reverse()
          .map(
            (month) =>
              reviewsPerMonth[month] && (
                <ReviewMonthSection
                  month={month}
                  reviews={reviewsPerMonth[month]}
                  key={month}
                />
              )
          )}
    </div>
  );
};

const ReviewMonthSection = (props) => {
  return (
    <div>
      <h2>{props.month}</h2>
      <Grid container spacing={2}>
        {props.reviews.map((review, idx) => (
          <Grid item lg={4} md={6} xs={12} key={idx}>
            <Review review={review} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

function getReviewsByMonth(reviews) {
  const reviewsByMonth = {};
  reviews.forEach((review) => {
    const createdDate = new Date(review.created);
    const month = MONTHS[createdDate.getMonth()];
    if (!(month in reviewsByMonth)) reviewsByMonth[month] = [];
    reviewsByMonth[month].push(review);
  });
  return reviewsByMonth;
}
