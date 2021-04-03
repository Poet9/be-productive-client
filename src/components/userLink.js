import React from "react";
import { NavLink } from "react-router-dom";

const userlink = (props) => {
  if (props.loggedIn) {
    return (
      <li>
        <NavLink
          id="navtagslinks"
          to="/user"
          exact
          activeStyle={{ borderBottom: "2px solid white" }}
        >
          Task
        </NavLink>
      </li>
    );
  }
};
export default userlink;
