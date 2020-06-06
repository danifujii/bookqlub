import React, { useState } from "react";

import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { WelcomeMsg } from "../components/WelcomeMsg";

export const Login = () => {
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
            <LoginForm onRegister={() => setOnLogin(false)} />
          ) : (
            <RegisterForm onLogin={() => setOnLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};
