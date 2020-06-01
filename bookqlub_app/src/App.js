import React from "react";
import Container from "@material-ui/core/Container";
import Login from "./components/Login";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

export const API_URL = process.env.BOOKQLUB_API_URL;

const client = new ApolloClient({
  uri: API_URL,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Container maxWidth="md">
          <Login />
        </Container>
      </div>
    </ApolloProvider>
  );
}

export default App;
