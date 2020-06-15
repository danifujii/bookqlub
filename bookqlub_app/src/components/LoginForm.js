import React, { useState, useEffect } from "react";
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
              onClick={(_) =>
                onMutation(login, { username, password }, setInputError)
              }
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
