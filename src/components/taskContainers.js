import React, { Fragment, useState } from 'react';
import Styles from "./taskContainers.module.css";
import CreateTask from '../components/createTask';
import addIcon from "../icons/add-circle-outline.svg";

const TaskContainer = (props)=>{
   const [areWeAdding, setAreWeAdding] = useState(false);
    /************** adding a task on img containers ************/
   const addComponent = (e) => {
      if(document.querySelector("#fillTask")){
         return;
      }
      setAreWeAdding(()=>true);
   }; 
   /*************** form click handler sub task *******************/
   const submittedTask = (e) => {
      e.preventDefault();
      if (!document.querySelector("#task-form-input").value) {
         setAreWeAdding(false);
         return;
      }
      const task = {
         title: document.querySelector("#task-form-input").value,
         field: props.id
      };
      props.addTask(task);
      setAreWeAdding(false);
   };
   /******** on drop on top **********/
   const drop = (e)=>{
      const data = JSON.parse(e.dataTransfer.getData('_task_id'));
      props.onDrop(data, props.id);
   } 
   const dragOverMe = (e)=>{
      e.preventDefault();
   }
   return (
   <Fragment>
      <div className={Styles._task_container_wrapper}>
         <div 
         className={Styles._task_direct_container} 
         id={props.id} 
         onDrop={(e)=>drop(e)} 
         onDragOver={(e)=>dragOverMe(e)}
         >
         {props.children}
         </div>
         <span className={Styles.addIconContainer} id="urgent-task">
            <img onClick={(e)=>addComponent(e)} title="add" className={Styles.addIcon} src={addIcon} alt="" />
         </span>
      </div>
      {areWeAdding? 
         <CreateTask 
            arrayName={props.id} 
            areWeAddingFunc={(val)=>{setAreWeAdding(val)}}
            itemTitle={<input type="text" id="task-form-input" placeholder="title..."/>}
            itemStatus={<p>{props.id.toUpperCase()}</p>}
            submitBtn={<button type="submit" onClick={submittedTask}>"SUBMIT TASK"</button>}
         />  : null}
   </Fragment>
   );
}
export default TaskContainer;