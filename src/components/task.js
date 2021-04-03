import React, { Fragment, useState } from "react";
import CreateTask from "./createTask";
import Classes from "./task.module.css";
import closeIcon from '../icons/close-outline.svg';

const Task = (props) => {
  const [taskOverView, setTaskOverView] = useState(false);
  /******* display task full screen ******/
  const displayItemWindow = (e)=>{
    if(document.querySelector("#fillTask")){
      return;
    }
    setTaskOverView(true);
  }
  /*******************start dragging **************/
  const dragStart = (e)=>{
    e.dataTransfer.setData('_task_id', JSON.stringify(props.task));
    props.setDragElement(props.task);
    setTimeout(()=>{
      e.target.style.visibility = 'hidden';
    }, 1);
  }
  /***************** dragging over **************/
  const dragOver = (e)=>{
    e.preventDefault();
    props.moveTaskFunc(props.task)
  }
  const onDragEnd = (e)=>{
    e.target.style.visibility = "visible";
  }
    return (
      <Fragment>
        <div 
          className={Classes.taskComponent} 
          id={props.id}
          onClick={(e)=>displayItemWindow(e)}
          onDragStart={dragStart} 
          onDragOver={dragOver}
          onDragEnd={onDragEnd}
          draggable="true"
          >
            <div className={Classes.deleteBtn}>
              <span style={{backgroundColor: props.color}}></span>
            <img 
              className={Classes.deleteIcon} 
              title="delete" src={closeIcon} 
              alt="" onClick={(e)=>props.deleteTask(e)} 
            />
            </div>
          <p >{props.task.title}</p>
        </div>
        {taskOverView?<CreateTask
          taskOverViewFunc={(val)=>setTaskOverView(val)}
          itemTitle={<p>{props.task.title}</p>}
          itemStatus={<p>{props.task.field}</p>}
          submitBtn={null}
        />: null}
      </Fragment>
    );
};

export default Task;