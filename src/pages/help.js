import React from 'react'
import Classes from './help.module.css'

const Help = ()=>{
   return (
      <div className={Classes.helpPage}>
         <h1>HELP</h1>
         <p>you can add tasks in the status you want and then drag them to another one or delete them.</p>
      </div>
   );
}

export default Help;