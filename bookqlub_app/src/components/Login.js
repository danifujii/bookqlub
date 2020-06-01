import React, { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

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

const Login = () => {
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
      <h1>Welcome to Bookqlub</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Username"
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) =>
              login({ variables: { username, password } }).catch((_) => {})
            }
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
