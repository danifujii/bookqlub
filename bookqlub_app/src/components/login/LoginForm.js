import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid, TextField } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";

import { OrDivider } from "../common/OrDivider";
import { onMutation } from "../common/FormUtils";

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

  useEffect(() => {
    if (data) {
      props.onUser(data.login);
    }
  }, [data]);

  const loginDemoUser = () => {
    onMutation(
      login,
      {
        username: process.env.REACT_APP_BOOKQLUB_DEMO_USERNAME,
        password: process.env.REACT_APP_BOOKQLUB_DEMO_PASSWORD,
      },
      setInputError
    );
  };

  const submit = (event) => {
    event.preventDefault();
    onMutation(login, { username, password }, setInputError);
  };

  return (
    <form onSubmit={submit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="username-input"
            label="Username"
            variant="outlined"
            className="LoginInput"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="password-input"
            label="Password"
            variant="outlined"
            type="password"
            className="LoginInput"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        {(error || inputError) && (
          <Grid item xs={12}>
            <p className="ErrorMsg LoginErrorMsg">
              {inputError || error.message}
            </p>
          </Grid>
        )}
        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                style={{ marginLeft: 16 }}
                onClick={loginDemoUser}
              >
                Demo
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </form>
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
