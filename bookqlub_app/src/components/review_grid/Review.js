import React, { useState } from "react";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import { IconButton } from "@material-ui/core";

export const Review = (props) => {
  const { book, review, onDeleteClick } = props;

  const [hovering, setHovering] = useState(false);

  const handleDeleteClick = () => {
    setHovering(false);
    onDeleteClick();
  };

  return (
    <div
      className="ReviewContainer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="ReviewCover">
        <img src={book.coverUrl} alt={`${book.title} cover`} height="200px" />
      </div>

      <div className="ReviewDetailContainer">
        <div>
          <p className="ReviewDetailTitle">{book.title}</p>
          <p className="ReviewDetailAuthor">
            <i>{book.author}</i>
          </p>
          {review && (
            <div>
              <p className="ReviewDetailValue">{review.value}</p>
              <p className="ReviewDetailDate">{getDate(review.created)}</p>
            </div>
          )}

          {hovering && onDeleteClick && (
            <div className="ReviewDeleteButton">
              <IconButton onClick={handleDeleteClick}>
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </div>
          )}
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
