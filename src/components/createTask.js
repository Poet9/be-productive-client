import React, { useEffect } from 'react';
import Classes from './createTask.module.css';
import closeIcon from "../icons/close-outline.svg";

const CreateTask = (props) => {
  /************** close adding form self explanatory i guess ************/
   const closeFormFunction = (e)=>{
      if(props.areWeAddingFunc){
         props.areWeAddingFunc(false);
      } else {
         props.taskOverViewFunc(false);
      }
   }
   useEffect(()=>{
      if(document.querySelector("#task-form-input")){
         document.querySelector("#task-form-input").focus();
      }
   }, []);
   return (
      <div className={Classes.createTaskContainer}>
      <form id="fillTask" className={Classes.formTask}>
         <div className={Classes.closeBtn}>
            <img src={closeIcon} alt="" onClick={(e)=>closeFormFunction(e)} />
         </div>
         <h2>TITLE</h2>
         {props.itemTitle}
         <h2>STATUS</h2>
         {props.itemStatus}
         {props.submitBtn}
      </form>
      </div>
   );
}
export default CreateTask;