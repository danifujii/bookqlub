import React from "react";

export const Review = (props) => {
  const { review } = props;

  return (
    <div className="ReviewContainer">
      <div className="ReviewCover">
        <img
          src={review.book.coverUrl}
          alt={`${review.book.title} cover`}
          width="100%"
          height="100%"
        />
      </div>

      <div>
        <div className="ReviewDetailContainer">
          <p className="ReviewDetailTitle">{review.book.title}</p>
          <p>
            <i>{review.book.author}</i>
          </p>
          <p className="ReviewDetailValue">{review.value}</p>
          <p className="ReviewDetailDate">{getDate(review.created)}</p>
        </div>
      </div>
    </div>
  );
};

function getDate(createdDate) {
  const date = new Date(createdDate);
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${date.getDate()} ${monthName}`;
}
