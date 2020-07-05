import React, { useState } from "react";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import SubjectRoundedIcon from "@material-ui/icons/SubjectRounded";
import { IconButton, Tooltip, withStyles } from "@material-ui/core";

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
        <img
          src={book.coverUrl}
          alt={`${book.title} cover`}
          className="ReviewCoverImg"
        />
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
              {review && <ReviewComment comment={review.comment} />}
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

const ReviewComment = (props) => {
  const { comment } = props;
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  if (!comment) {
    return null;
  }

  return (
    <div className="ReviewCommentContainer">
      <HtmlTooltip
        onClose={handleClose}
        open={open}
        title={
          <React.Fragment>
            <p>{comment}</p>
          </React.Fragment>
        }
      >
        <IconButton>
          <SubjectRoundedIcon onClick={() => setOpen(true)} />
        </IconButton>
      </HtmlTooltip>
    </div>
  );
};

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    maxWidth: 400,
    backgroundColor: "#f5f5f9",
    border: "1px solid #dadde9",
    color: "#323232",
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 400,
  },
}))(Tooltip);

function getDate(createdDate) {
  const date = new Date(createdDate);
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${date.getDate()} ${monthName}`;
}
