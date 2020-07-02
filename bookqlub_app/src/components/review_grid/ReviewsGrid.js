import React, { useEffect, useRef, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { LinearProgress, Grid } from "@material-ui/core";

import { Review } from "./Review";

const GET_REVIEWS = gql`
  query Reviews($year: Int!, $page: Int!) {
    reviews(year: $year, page: $page) {
      items {
        created
        value
        comment
        book {
          id
          author
          title
          coverUrl
        }
      }
      pageInfo {
        currentPage
        totalPages
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
  const [
    getReviews,
    { loading, error, data, fetchMore },
  ] = useLazyQuery(GET_REVIEWS, { fetchPolicy: "cache-and-network" });
  const [reviewsPerMonth, setReviewsPerMonth] = useState(undefined);
  const [loadingMore, setLoadingMore] = useState(false);

  const dataRef = useRef(data);
  const fetchMoreRef = useRef(fetchMore);

  const trackScrolling = (_) => {
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight;
    if (atBottom && dataRef.current && fetchMoreRef.current && !loadingMore) {
      const currentData = dataRef.current && dataRef.current.reviews;
      if (currentData.pageInfo.currentPage < currentData.pageInfo.totalPages) {
        setLoadingMore(true);

        fetchMoreRef.current({
          query: GET_REVIEWS,
          variables: {
            year: props.year,
            page: currentData.pageInfo.currentPage + 1,
          },
          updateQuery: (previousData, { fetchMoreResult }) => {
            return {
              reviews: {
                pageInfo: fetchMoreResult.reviews.pageInfo,
                items: [
                  ...previousData.reviews.items,
                  ...fetchMoreResult.reviews.items,
                ],
              },
            };
          },
        });
      }
    }
  };

  // Initial render
  useEffect(() => {
    getReviews({ variables: { year: props.year, page: 1 } });
    document.addEventListener("scroll", trackScrolling);

    return () => {
      document.removeEventListener("scroll", trackScrolling);
    };
  }, []);

  useEffect(() => {
    if (data && data.reviews.items) {
      setReviewsPerMonth(getReviewsByMonth(data.reviews.items));
      setLoadingMore(false);
    }
    dataRef.current = data;
    fetchMoreRef.current = fetchMore;
  }, [data, fetchMore]);

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
                  {...props}
                />
              )
          )}
      {(loading || loadingMore) && (
        <div className="ReviewLoading">
          <LinearProgress />
        </div>
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
            <Review review={review} {...props} />
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
