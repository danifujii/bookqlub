import React, { useEffect } from "react";
import { Button, CircularProgress, Grid, TextField } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    if (data) {
      props.onUser(data.login);
    }
  }, [data]);

  const loginDemoUser = () => {
    onMutation(login, {
      username: process.env.REACT_APP_BOOKQLUB_DEMO_USERNAME,
      password: process.env.REACT_APP_BOOKQLUB_DEMO_PASSWORD,
    });
  };

  const submit = (data, event) => {
    event.preventDefault();
    onMutation(login, { username: data.username, password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="username-input"
            label="Username"
            variant="outlined"
            className="LoginInput"
            name="username"
            inputRef={register({ required: true })}
            error={errors.username}
            helperText={errors.username && "Username is required"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="password-input"
            label="Password"
            variant="outlined"
            type="password"
            className="LoginInput"
            name="password"
            inputRef={register({ required: true })}
            error={errors.password}
            helperText={errors.password && "Password is required"}
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <p className="ErrorMsg LoginErrorMsg">{error.message}</p>
          </Grid>
        )}
        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                type="submit"
              >
                Login
              </Button>
              <Button
                variant="contained"
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
