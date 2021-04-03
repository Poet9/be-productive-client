import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Styles from './accountSet.module.css';

const MyAccount = (props) =>{
   const [userInfo, setUserInfo] = useState(false);
   let myUser = {
      username: props.currentUser?.username,
      email: props.currentUser?.email,
      password: ""
   };
   const [user, setUser] = useState(myUser);
   /******* getting user on first render  ****/ 
   useEffect(()=>{
      if(!user.username){
         fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/users/me`, {
            mode: "cors",
            headers: {"content-type": "application/json"},
            credentials: "include"
         }).then((res)=>{
            if(res.status !== 200){
               throw new Error("not authenticated.");
            }
            return res.json();
         }).then((data)=>{
            setUser(()=>{
               return {username: data.username, email: data.email};
            });
         }).catch((err)=>{
            window.location.pathname = "/";
         })
      }
   }, [user]);
   const submitChange =(e)=>{
      e.preventDefault();
      const change= {};
      if(document.querySelector("#_new_username").value){
         change.username = document.querySelector("#_new_username").value;
      } 
      if(document.querySelector("#_new_email").value){
         change.email = document.querySelector("#_new_email").value;
      } 
      if(document.querySelector("#_new_password").value){
         change.password = document.querySelector("#_new_password").value;
      }
      if(change.password && change.password.length < 7){
         document.getElementById("myUserErrorP").textContent= "Password must be longer than 7 characters.";
         return;
      }
      if(change.password){
         change.password = jwt.sign({password: change.password}, process.env.REACT_APP_SECRET_KEY);
      }
      fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/users/me`, {
         method: "PATCH",
         mode: "cors",
         headers: {'content-type': 'application/json'},
         body: JSON.stringify({...change}),
         credentials: "include"
      }).then(res =>{
         if(res.status !== 200){
            throw new Error();
         }
         return res.json()
      }).then(data =>{
         setUser({
            username: data.username,
            email: data.email,
            password: ""
         });
         setUserInfo(false);
      }).catch(err => {return;});
   }
   /****** on change in input *****/
   const filledInput = (e)=>{
      const container = e.target.parentNode;
      if(e.target.value){
         container.querySelector('span').style.backgroundColor= "#333";
         return;
      }

      container.querySelector('span').style.backgroundColor= "#ac0f0f";
   }
   /******* delete user button *****/
   const deleteUserFunc = (e)=>{
      fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/users/me`, {
         method: "DELETE",
         mode: "cors",
         headers: {"content-type": "application/json"},
         credentials: "include"
      }).then((res)=>{
         if(res.status !== 200){
            throw new Error()
         }
         setUser({});
      }).catch(err=>{return;});
   }
   /***** username display ******/
   const userDisplay= ()=>{
      if(userInfo){
         return(
            <form className={Styles.userSpan} onSubmit={submitChange}>
               <div className={Styles.usernameDiv}>
                  <input id="_new_username" 
                  type="text" placeholder="username..." 
                  onChange={filledInput} 
                  />
                  <span className={Styles.changedSpan}>DO NOT CHANGE</span>
               </div>
               <div className={Styles.emailDiv}>
                  <input type="email" placeholder="email..." 
                  id="_new_email"
                  onChange={filledInput}
                  />
                  <span className={Styles.changedSpan}>DO NOT CHANGE</span>
               </div>
               <div className={Styles.usernameDiv}>
                  <input type="password" placeholder="password..." 
                  id="_new_password"
                  onChange={filledInput}
                  />
                  <span className={Styles.changedSpan}>DO NOT CHANGE</span>
               </div>
               <p id="myUserErrorP" className={Styles.userSetErrorP}></p>
               <button type="submit" className={Styles.userChangeSubmit}>SUBMIT CHANGE</button>
            </form>)
      } else {
         return (
            <div className={Styles.userSpan}>
               <p className={Styles.infoDisplay}><strong>USERNAME: </strong>{user.username}</p>
               <p className={Styles.infoDisplay}><strong>EMAIL: </strong>{user.email}</p>
               <div className={Styles.EdiDelBtnsDiv}>
                  <button className={Styles.editBtn} onClick={()=>setUserInfo(true)}>EDIT</button>
                  <button className={Styles.deleteUserBtn} onClick={deleteUserFunc}>DELETE ACCOUNT</button>
               </div>
            </div>)
      }
   }
   /**** logout from all sessions function function */
   const logoutAllFunc = (e)=>{
      fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/users/logoutAll`, {
         method: "POST",
         mode: "cors",
         credentials: "include"
      }).then( res =>{
         if(res.status !== 200){
            return;
         }
         return res.json();
      }).then(data =>{
         console.log(data);
         props.loggedInFunc(false, {});
         window.location.pathname = "/";
      }).catch(err=>console.log(err))
   }
   return (
      <div className={Styles.accSettings} >
         <h1>ACCOUNT SETTING</h1>
         <div className={Styles.userSettingContainer}>
            {userDisplay()}
         <button className={Styles.logoutAllBtn} onClick={logoutAllFunc}>LOGOUT FROM ALL SESSIONS</button>
         </div>
      </div>
   );
}

export default MyAccount;