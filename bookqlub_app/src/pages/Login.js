import React, { useState } from "react";

import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { WelcomeMsg } from "../components/WelcomeMsg";

const onUser = (data, setUsername) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.user.username);
  setUsername(data.user.username);
};

export const Login = (props) => {
  const [onLogin, setOnLogin] = useState(true);

  return (
    <div className="LoginWrapper">
      <div className="LoginContainer LoginWelcomeContainer">
        <div className="LoginContainerContent">
          <WelcomeMsg />
        </div>
      </div>
      <div className="LoginContainer">
        <div className="LoginContainerContent">
          <h1 className="LoginHeader">Bookqlub</h1>
          <p className="LoginSubheader">
            {onLogin ? "Login to your account" : "Create a new account"}
          </p>
          {onLogin ? (
            <LoginForm
              onRegister={() => setOnLogin(false)}
              onUser={(ud) => onUser(ud, props.setUsername)}
            />
          ) : (
            <RegisterForm
              onLogin={() => setOnLogin(true)}
              onUser={(ud) => onUser(ud, props.setUsername)}
            />
          )}
        </div>
      </div>
    </div>
  );
};