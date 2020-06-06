import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import "./components/Components.css";
import "./pages/Pages.css";
import { Login } from "./pages/Login";

export const API_URL = process.env.BOOKQLUB_API_URL;

const client = new ApolloClient({
  uri: API_URL,
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#D81E5B",
    },
  },
});

function App() {
  return (
    <div style={{ height: "100%" }}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
