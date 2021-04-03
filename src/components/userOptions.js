import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './userOptions.module.css';
import closeIcon from "../icons/close-outline.svg";

const UserMenu = (props)=>{
   const closeNavPanel = ()=>{
      document.querySelector("#user-options-id").style.display= "none";
   }
   const hideOptionFunc = ()=>{
      document.querySelector("#user-options-id").style.display= "none";
   }
   return (
      <div id="user-options-id" className={Styles.userOptions}>
         <div className={Styles.closeUserOption}>
            <img src={closeIcon} onClick={closeNavPanel} alt="" />
         </div>
         <ul>
            <li>
               <Link  to='/help' className={Styles.optionsLink} onClick={hideOptionFunc}>Help </Link>
            </li>
            <li>
               <Link  to='/user/me' className={Styles.optionsLink} onClick={hideOptionFunc}>Account setting </Link>
            </li>
            <li className={Styles.optionLiButton}>
               <button onClick={(e)=>props.logoutFunction(e)}>Logout</button>
            </li>
         </ul>
      </div>
   );
}

export default UserMenu;
