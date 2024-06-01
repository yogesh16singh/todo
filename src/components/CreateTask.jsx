import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const CreateTask = ({ tasks, setTasks }) => {
    const [task,setTask] = useState({
        id:"",
        name:"",
        status:"todo"
    })
const handleSubmit = (e) =>
    {
        e.preventDefault() // prevent page from refreshing
        if (task.name.length < 3 ) 
            return toast.error("Minimum Length Should Be 3 Charecters");     
        if (task.name.length > 100 ) 
            return toast.error("Maximum Length Shouldnt Be greater than 100 Charecters");     
        setTasks((prev)=>
        {
            const  list = [...prev,task]
            localStorage.setItem('tasks',JSON.stringify(list))
            return list
        }) /// this fun will update our state
        toast.success("Task Created Successfully")
        setTask({
            id:"",
            name:"",
            status:"todo"
        })//Clear Input Fiedl
    }
  return (
    <form onSubmit={handleSubmit}>
      <input className="border-2 rounded-lg mr-4 h-12" type="text" value={task.name} onChange={(e)=>setTask({...task,id:uuidv4(),name:e.target.value})} />
      <button className="bg-red-600 rounded-md px-4 h-12 text-white">Create Task</button>
    </form>
  );
};

export default CreateTask;
