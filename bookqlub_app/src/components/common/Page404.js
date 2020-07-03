import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export const Page404 = () => {
  const history = useHistory();

  return (
    <div className="Page404Container">
      <h1>404</h1>
      <h2>
        Oops, page not found <span role="img">😢️</span>
      </h2>
      <br />
      <Button color="primary" onClick={() => history.push("/")}>
        Go to homepage
      </Button>
    </div>
  );
};
