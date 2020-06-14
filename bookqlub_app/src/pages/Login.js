import React, { useState, useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import { UserContext } from "../App";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { WelcomeMsg } from "../components/WelcomeMsg";
import { ReactComponent as Logo } from "../logo.svg";

const onUser = (data, setUsername) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.user.username);
  setUsername(data.user.username);
};

export const Login = () => {
  const [onLogin, setOnLogin] = useState(true);
  const { setUsername } = useContext(UserContext);
  const theme = useTheme();
  const bigDevice = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <div className="LoginWrapper">
      {bigDevice && (
        <div className="LoginContainer LoginWelcomeContainer">
          <div className="LoginContainerContent">
            <WelcomeMsg />
          </div>
        </div>
      )}
      <div className="LoginContainer">
        <div className="LoginContainerContent">
          <div className="LoginLogoContainer">
            <Logo className="LoginLogo" />
            <h1 className="LoginHeader">Bookqlub</h1>
          </div>
          <p className="LoginSubheader">
            {onLogin ? "Login to your account" : "Create a new account"}
          </p>
          {onLogin ? (
            <LoginForm
              onRegister={() => setOnLogin(false)}
              onUser={(ud) => onUser(ud, setUsername)}
            />
          ) : (
            <RegisterForm
              onLogin={() => setOnLogin(true)}
              onUser={(ud) => onUser(ud, setUsername)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
