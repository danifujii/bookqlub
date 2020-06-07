import React from "react";

export const Review = () => {
  return (
    <div className="ReviewContainer">
      <div className="ReviewCover">
        <img
          src="https://images-na.ssl-images-amazon.com/images/I/91twTG-CQ8L.jpg"
          width="100%"
          height="100%"
        />
      </div>

      <div>
        <div className="ReviewDetailContainer">
          <p className="ReviewDetailTitle">Little Fires Everywhere</p>
          <p>
            <i>Celeste Ng</i>
          </p>
          <p className="ReviewDetailValue">GREAT</p>
          <p className="ReviewDetailDate">14 January</p>
        </div>
      </div>
    </div>
  );
};
