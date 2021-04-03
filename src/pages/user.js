import React, { useState, useEffect } from "react";
import Classes from "./user.module.css";
import TaskContainer from "../components/taskContainers";
import Task from "../components/task";

const fetchModel = async (url, method, body)=>{
  try{
    const response = await fetch(process.env.REACT_APP_BACKEND_API+url, {
      method,
      mode: "cors",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(body),
      credentials: "include"
    });
    if(response.status >=400){
      throw new Error(response.status);
    }
    const data = await response.json();
    return data;
  } catch(err){
    return err;
  };
}
const User = ()=> {
  const colorObject = {
    inprogress: '#519',
    done: '#291',
    todo: '#129',
    urgent: '#c24'
  }
  const [backendData, setBackendData] = useState([]);
  const [taskDragged, setTaskDragged] = useState(null);
  useEffect(()=>{
    fetchModel("/api/tasks/tasks")
    .then((data)=>{
      Array.isArray(data) ?setBackendData(data): setBackendData([]);
    });
  }, []);
  /******************on drag an element *********/
  const ondragTask = el => setTaskDragged(el);
  /****** on drop function for the task container ******/
  const onDropFunc = async (task, status)=>{
    if(task.field === status){
      return;
    }
    task.field = status;
    try{
      setBackendData(prevState=>{
        const newTasks = prevState.filter(t =>t._id !== task._id)
        .concat({...task});
        return newTasks;
      });
      await fetchModel(`/api/tasks/tasks/${task._id}`, "PATCH", {field: status});
    } catch(e){return;}
  }
  /******** for moving tasks *******/
  const moveTask = (task)=>{
    setBackendData(prevState=>{
      const taskIndex = prevState.findIndex(t => t._id === taskDragged._id);
      const hoverIndex = prevState.findIndex(t => t.content === task);
      const newState = [...prevState];
      newState.splice(taskIndex, 1);
      newState.splice(hoverIndex, 0, taskDragged);
      return [...newState];
    });
  }
  /******* function to delete tasks *******/
  const deleteTaskFunc= async (e)=>{
    const task = e.target.parentNode.parentNode;
    setBackendData(prevState=>{
      const taskIndex = prevState.findIndex(t => t._id === task.id);
      const newState = [...prevState];
      newState.splice(taskIndex, 1);
      return [...newState];
    });
    await fetchModel(`/api/tasks/tasks/${task.id}`, "DELETE");
  }
  /********** adding a task *******/
  const addTaskFunc= async (task)=>{
    try{
      const backendTask= await fetchModel("/api/tasks/tasks", "POST", task);
      setBackendData(prevState =>{
        const newState = [...prevState];
        newState.push(backendTask);
        return [...newState]
      });
    } catch (e){
      return;
    }
  }
  /****** return value ******/
  return (
    <div className={Classes.userMain}>
      {["todo", "urgent", "inprogress", "done"].map(status=>{
        return (<div key={status} className={Classes[status+'Task']}>
          <p className={Classes.taskContainerTitle}>{status}</p>
          <TaskContainer id={status} onDrop={onDropFunc} addTask={addTaskFunc}>
            {backendData?.filter(task => task.field === status).map(task=>{
             return ( <Task
                color={colorObject[status]}
                key={task._id}
                id={task._id}
                task={task}
                setDragElement={ondragTask}
                deleteTask={deleteTaskFunc}
                moveTaskFunc={moveTask}
              />)
              })
            }
          </TaskContainer>
      </div>);
      })}
    </div>
  );
}

export default User;
