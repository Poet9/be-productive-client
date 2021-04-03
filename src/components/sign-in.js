import React from "react";
import jwt from 'jsonwebtoken';
import Class from "./sign-in.module.css";
import showP from "../icons/eye-outline.svg";
import hideP from "../icons/eye-off-outline.svg";

const signIn = (props) => {
  const signedIn = async (e) => {
    e.preventDefault();
    const email = document.querySelector(".username").value;
    const password = document.querySelector(".password").value;
    const signedPassword = jwt.sign({password: password}, process.env.REACT_APP_SECRET_KEY);
    const errorDisplayer = document.querySelector("#authenticationError");
    try {
      const result = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/api/users/users/login`,
        {
          method: "POST",
          mode: "cors",
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            email,
            password: signedPassword
          }),
          credentials: "include"
        }
      );
      const resData = await result.json();
      if(result.status === 200){
        localStorage.setItem('Authorization', resData.token);
        document.querySelector(".username").value = "";
        document.querySelector(".password").value = "";
        props.authenticated(true);
        props.history.push("/user");
        errorDisplayer.textContent = "";
      } else {
        errorDisplayer.textContent = "Error: unvalid email or password.";
      }
    } catch (e) {
      errorDisplayer.textContent = "Error: No internet connection.";
    }
  };
  /********** show or hide password function ******/
  const hideOrshowPass = (e)=>{
    if(document.querySelector('#passField').type === 'password'){
      e.target.src = hideP;
      document.querySelector('#passField').type = "text";
    } else {
      e.target.src = showP;
      document.querySelector('#passField').type = "password";
    }
  }

  return (
    <div id="signin-form" className={Class.forms}>
      <form className={Class.sign} onSubmit={signedIn}>
        <p>Sign in</p>
        <input
          className="username"
          type="email"
          placeholder="Email..."
          required
        />
        <label className={Class.passLabel}>
        <input
          id="passField"
          className="password"
          type="password"
          placeholder="password..."
          required
        />
        <img src={showP} onClick={(e)=>{hideOrshowPass(e)}} className={Class.passIcon} alt="" />
        </label>
        <span id='authenticationError' className={Class.errorSpan}></span>
        <button className="submit-btn" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};
export default signIn;
