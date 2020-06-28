import React, { useState } from "react";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import { IconButton } from "@material-ui/core";
import { ReviewDeleteDialog } from "./ReviewDelete";

export const Review = (props) => {
  const { book, review, onDelete } = props;

  const [hovering, setHovering] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onDeleteClick = () => {
    setHovering(false);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    onDelete();
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
        <p className="ReviewDetailTitle">{book.title}</p>
        <p>
          <i>{book.author}</i>
        </p>
        {review && (
          <div>
            <p className="ReviewDetailValue">{review.value}</p>
            <p className="ReviewDetailDate">{getDate(review.created)}</p>
          </div>
        )}

        {hovering && (
          <div className="ReviewDeleteButton">
            <IconButton onClick={onDeleteClick}>
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </div>
        )}
        <ReviewDeleteDialog
          bookId={review.book.id}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

function getDate(createdDate) {
  const date = new Date(createdDate);
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${date.getDate()} ${monthName}`;
}
