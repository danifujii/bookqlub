import React from "react";
import Container from "@material-ui/core/Container";

import { Header } from "../components/common/Header";
import { ReviewsContainer } from "../components/ReviewsContainer";
import { Footer } from "../components/common/Footer";

export const Homepage = () => {
  return (
    <div style={{ height: "100%" }}>
      <Container maxWidth="lg" className="HomepageContainer">
        <Header />
        <ReviewsContainer />
        <Footer />
      </Container>
    </div>
  );
};
