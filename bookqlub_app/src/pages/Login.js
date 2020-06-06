import React from "react";

import { LoginForm } from "../components/LoginForm";
import { WelcomeMsg } from "../components/WelcomeMsg";

export const Login = () => {
  return (
    <div className="LoginWrapper">
      <div className="LoginContainer LoginWelcomeContainer">
        <div className="LoginContainerContent">
          <WelcomeMsg />
        </div>
      </div>
      <div className="LoginContainer">
        <div className="LoginContainerContent">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
