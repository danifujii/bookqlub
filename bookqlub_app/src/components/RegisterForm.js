import React, { useState } from "react";
import { Button, CircularProgress, Grid, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { OrDivider } from "./OrDivider";

const REGISTER = gql`
  mutation CreateUser($full_name: String!, $username: String!, $pass: String!) {
    createUser(fullName: $full_name, username: $username, password: $pass) {
      token
    }
  }
`;

export const RegisterForm = (props) => {
  const { onLogin } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [register, { data, loading, error }] = useMutation(REGISTER);

  return (
    <div>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full name"
              variant="outlined"
              className="LoginInput"
              onChange={(e) => setFullname(e.target.value)}
            />
          </Grid>
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
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() =>
                  register(fullname, username, password).catch((_) => {})
                }
              >
                Register
              </Button>
            )}
          </Grid>
        </Grid>
        <div className="DividerWrapper">
          <OrDivider />
        </div>
        <Button size="large" color="primary" onClick={() => onLogin()}>
          Login
        </Button>
      </div>
    </div>
  );
};
