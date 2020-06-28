import React from "react";
import Container from "@material-ui/core/Container";

import { Header } from "./common/Header";
import { ReviewsContainer } from "./review_grid/ReviewsContainer";
import { Footer } from "./common/Footer";
import { Navbar } from "./common/Navbar";
import { Switch, Route } from "react-router-dom";
import { BacklogContainer } from "./backlog/BacklogContainer";

export const Homepage = () => {
  return (
    <div style={{ height: "100%" }}>
      <Container maxWidth="lg" className="HomepageContainer">
        <Header />
        <Navbar />
        <Switch>
          <Route exact path="/" component={ReviewsContainer} />
          <Route path="/backlog" component={BacklogContainer} />
        </Switch>
        <Footer />
      </Container>
    </div>
  );
};
