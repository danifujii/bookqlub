import React, { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { OrDivider } from "./OrDivider";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        username
      }
      token
    }
  }
`;

export const LoginForm = () => {
  const [login, { data, loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data.login);
  }

  return (
    <div>
      <div>
        <h1 className="LoginHeader">Bookqlub</h1>
        <p className="LoginSubheader">Login to your account</p>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              variant="outlined"
              className="LoginInput"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              className="LoginInput"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={(e) =>
                login({ variables: { username, password } }).catch((_) => {})
              }
            >
              Login
            </Button>
          </Grid>
        </Grid>
        <div className="DividerWrapper">
          <OrDivider />
        </div>
        <Button size="large" color="primary">
          Register
        </Button>
      </div>
    </div>
  );
};
