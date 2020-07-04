import React, { useState } from "react";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import "./components/common/Common.css";
import "./components/Components.css";

import { Login } from "./components/login/Login";
import { Homepage } from "./components/Homepage";
import { BrowserRouter } from "react-router-dom";

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
  uri: process.env.REACT_APP_BOOKQLUB_API_URL,
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      ReviewList: {
        keyFields: ["pageInfo", ["currentPage"]],
      },
    },
  }),
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#C42D5F",
    },
    error: {
      main: "#B22222",
    },
  },
});

export const UserContext = React.createContext({
  username: localStorage.getItem("username"),
  setUsername: () => {},
});

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const value = { username, setUsername };

  return (
    <BrowserRouter>
      <div style={{ height: "100%" }}>
        <UserContext.Provider value={value}>
          <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
              {username ? <Homepage /> : <Login />}
            </ThemeProvider>
          </ApolloProvider>
        </UserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
