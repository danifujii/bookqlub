<a href="https://bookqlub.com/"><img src="logo.png" height=64 alt="Bookqlub"/></a> 

## [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/danifujii/bookqlub/blob/master/LICENSE) [![Version](https://img.shields.io/github/v/release/danifujii/bookqlub)](https://github.com/danifujii/bookqlub/releases) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/danifujii/bookqlub/tree/master/bookqlub_api#contributing)

_Bookqlub_ is a minimalistic, simple to use book review site, built to gain experience with GraphQL and develop a useful app. 

## Structure

The application consists of two parts:
  - Web server that exposes a [GraphQL API](https://graphql.org/learn/). Build with [Flask](https://flask.palletsprojects.com/en/1.1.x/)
    and used [Graphene](https://graphene-python.org/) for the GraphQL integration.
  - Web application built with [React](https://reactjs.org/). 
    Used [Apollo Client](https://www.apollographql.com/docs/) for the GraphQL integration and 
    [Material-UI](https://material-ui.com/) for the UI components.

I used all functional components in the web application, taking full advantage of [React hooks](https://reactjs.org/docs/hooks-intro.html).
For authentication between the application and the server, I used [JSON Web Tokens (JWT)](https://jwt.io/).

## Setup

If you would like to setup the API, follow [these instructions](https://github.com/danifujii/bookqlub/tree/master/bookqlub_api#setup).
And if you want to setup the web application, follow [these instructions](https://github.com/danifujii/bookqlub/tree/master/bookqlub_app#setup).
