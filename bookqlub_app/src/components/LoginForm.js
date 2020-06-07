import React, { useState } from "react";
import { Button, CircularProgress, Grid, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { OrDivider } from "./OrDivider";
import { onMutation } from "./FormUtils";

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

const LoginFormFields = (props) => {
  const [login, { data, loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState(undefined);

  if (data) {
    props.onUser(data.login);
  }

  return (
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
      {(error || inputError) && (
        <Grid item xs={12}>
          <p className="LoginErrorMsg">{inputError || error.message}</p>
        </Grid>
      )}
      <Grid item xs={12}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={(_) =>
              onMutation(login, { username, password }, setInputError)
            }
          >
            Login
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export const LoginForm = (props) => {
  const { onRegister } = props;

  return (
    <div>
      <div>
        <LoginFormFields {...props} />
        <div className="DividerWrapper">
          <OrDivider />
        </div>
        <Button size="large" color="primary" onClick={() => onRegister()}>
          Register
        </Button>
      </div>
    </div>
  );
};
