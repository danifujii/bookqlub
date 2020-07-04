import React from "react";
import Container from "@material-ui/core/Container";

import { Header } from "./common/Header";
import { ReviewsContainer } from "./review_grid/ReviewsContainer";
import { Footer } from "./common/Footer";
import { Navbar } from "./common/Navbar";
import { Switch, Route } from "react-router-dom";
import { BacklogContainer } from "./backlog/BacklogContainer";
import { Page404 } from "./common/Page404";
import { SuggestionContainer } from "./suggest_book/SuggestionContainer";

export const Homepage = () => {
  return (
    <div style={{ height: "100%" }}>
      <Container maxWidth="lg" className="HomepageContainer">
        <Header />
        <Navbar />
        <Switch>
          <Route exact path="/" component={ReviewsContainer} />
          <Route exact path="/suggest_book" component={SuggestionContainer} />
          <Route exact path="/backlog" component={BacklogContainer} />
          <Route path="*" component={Page404} />
        </Switch>
        <Footer />
      </Container>
    </div>
  );
};
