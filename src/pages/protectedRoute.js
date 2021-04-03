import React from "react";
import { Redirect, Route } from "react-router-dom";

const protectedRoute = ({ component: Component, currentUser, loggedInFunc,...rest }) => {
  const isLogIn = rest.loggedInapproved;
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLogIn) {
          return <Component {...props} 
                  currentUser={currentUser} 
                  loggedInFunc={loggedInFunc} 
                  />;
        }
        return (
          <Redirect
            to={{
              pathname: "/",
              state: {
                from: props.location
              }
            }}
          />
        );
      }}
    />
  );
};
export default protectedRoute;
