import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid, TextField } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";

import { OrDivider } from "../common/OrDivider";
import { onMutation, getFormError } from "../common/FormUtils";
import { useForm } from "react-hook-form";

const REGISTER = gql`
  mutation CreateUser(
    $full_name: String!
    $username: String!
    $password: String!
  ) {
    createUser(fullName: $full_name, username: $username, password: $password) {
      user {
        username
      }
      token
    }
  }
`;

export const RegisterForm = (props) => {
  const { onLogin } = props;
  const [registerUser, { data, loading, error }] = useMutation(REGISTER);
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    if (data) {
      props.onUser(data.createUser);
    }
  }, [data]);

  const submit = (data, event) => {
    event.preventDefault();
    onMutation(registerUser, {
      full_name: data.full_name,
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="fullname-input"
              label="Full name"
              variant="outlined"
              className="LoginInput"
              name="full_name"
              inputRef={register({
                required: true,
                minLength: 3,
                maxLength: 150,
              })}
              error={errors.full_name}
              helperText={getFormError(errors.full_name)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="username-input"
              label="Username"
              variant="outlined"
              className="LoginInput"
              name="username"
              inputRef={register({
                required: true,
                minLength: 3,
                maxLength: 80,
              })}
              error={errors.username}
              helperText={getFormError(errors.username)}
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
              inputRef={register({
                required: true,
                minLength: 8,
                maxLength: 56, // To avoid bumping into bcrypt limit
              })}
              error={errors.password}
              helperText={getFormError(errors.password)}
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
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
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
      </form>
    </div>
  );
};
