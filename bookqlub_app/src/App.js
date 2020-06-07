import React, { useState, useEffect } from "react";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import "./components/Components.css";
import "./pages/Pages.css";
import { Login } from "./pages/Login";
import { Homepage } from "./pages/Homepage";

const authLink = setContext((_, { headers }) => {
  // TODO move to HttpOnly cookie
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: process.env.BOOKQLUB_API_URL || "http://127.0.0.1:5001/graphql",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#D81E5B",
    },
  },
});

function App() {
  const [userData, setUserData] = useState(localStorage.getItem("userData"));
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", userData);
    }
  }, [userData]);

  return (
    <div style={{ height: "100%" }}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          {userData ? <Homepage /> : <Login setUserData={setUserData} />}
        </ThemeProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
