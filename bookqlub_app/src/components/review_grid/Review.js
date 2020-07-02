import React, { useState } from "react";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import SubjectRoundedIcon from "@material-ui/icons/SubjectRounded";
import {
  IconButton,
  ClickAwayListener,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { ReviewDeleteDialog } from "./ReviewDelete";

export const Review = (props) => {
  const { review, onDelete } = props;

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
        <img
          src={review.book.coverUrl}
          alt={`${review.book.title} cover`}
          height="200px"
        />
      </div>

      <div className="ReviewDetailContainer">
        <p className="ReviewDetailTitle">{review.book.title}</p>
        <p>
          <i>{review.book.author}</i>
        </p>
        <p className="ReviewDetailValue">{review.value}</p>
        <p className="ReviewDetailDate">{getDate(review.created)}</p>

        {hovering && (
          <div className="ReviewDeleteButton">
            <ReviewComment comment={review.comment} />
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
