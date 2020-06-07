import React from "react";
import Container from "@material-ui/core/Container";

import { Header } from "../components/Header";
import { ReviewContainer } from "../components/ReviewContainer";

export const Homepage = () => {
  return (
    <div>
      <Container maxWidth="lg">
        <Header />
        <ReviewContainer />
      </Container>
    </div>
  );
};
