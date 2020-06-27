import React from "react";
import Container from "@material-ui/core/Container";

import { Header } from "./common/Header";
import { ReviewsContainer } from "./review_grid/ReviewsContainer";
import { Footer } from "./common/Footer";
import { Navbar } from "./common/Navbar";

export const Homepage = () => {
  return (
    <div style={{ height: "100%" }}>
      <Container maxWidth="lg" className="HomepageContainer">
        <Header />
        <Navbar />
        <ReviewsContainer />
        <Footer />
      </Container>
    </div>
  );
};
