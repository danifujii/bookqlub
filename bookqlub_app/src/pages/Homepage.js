import React from "react";
import Container from "@material-ui/core/Container";

import { Header } from "../components/Header";
import { ReviewsContainer } from "../components/ReviewsContainer";

export const Homepage = () => {
  return (
    <div>
      <Container maxWidth="lg">
        <Header />
        <ReviewsContainer />
      </Container>
    </div>
  );
};
