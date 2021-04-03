import React from "react";
import jwt from "jsonwebtoken";
import Class from "./sign-in.module.css";
import showP from "../icons/eye-outline.svg";
import hideP from "../icons/eye-off-outline.svg";

const signUp = (props) => {
  /***************** comunicate with the backend ***********/
  const signingUp = (e) => {
    e.preventDefault();
    const username = document.querySelector(".username").value;
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    const signedPassword = jwt.sign({password: password}, process.env.REACT_APP_SECRET_KEY);
    /********************** try/catch block to handle communication *******/
    fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/users`,
      {
        method: "POST",
        mode: "cors",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username,
          email,
          password: signedPassword
        }),
        credentials: "include"
      }).then((res)=>{
      if(res.status === 400){
        throw new Error('could not save user.');
      }
      else if(res.status !== 201){
        document.querySelector('#authenticationError').textContent ="Error: Email already used.";
        throw new Error();
      }
      props.authenticated(true);
      window.location.pathname = "/";
    })
    .catch(e => 
      document.querySelector('#authenticationError').textContent=== `Error: No internet connection.`);
  }
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
    <div id="signup-form" className={Class.forms}>
      <form className={Class.sign} onSubmit={signingUp}>
        <p>Sign up</p>
        <input
          className="username"
          type="text"
          placeholder="username..."
          required
        />
        <input className="email" type="email" placeholder="email..." required />
        <label className={Class.passLabel}>
          <input
            id="passField"
            className="password"
            type="password"
            minLength={7}
            placeholder="password..."
            required
          />
          <img src={showP} onClick={(e)=>{hideOrshowPass(e)}} className={Class.passIcon} alt="" />
        </label>
        <span id='authenticationError' className={Class.errorSpan}></span>
        <button  className="submit-btn" type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
};
export default signUp;
