import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDrag, useDrop } from 'react-dnd'

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "todo");
    const finProgress = tasks.filter((task) => task.status === "inprogress");
    const fClosed = tasks.filter((task) => task.status === "closed");
    setTodos(fTodos);
    setInProgress(finProgress);
    setClosed(fClosed);
  }, [tasks]);
  const statuses = ["todo", "inprogress", "closed"];

  return (
    <div className="flex gap-16">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
};

export default ListTasks;


const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {

    const [{isOver}, drop] = useDrop(() => ({
        accept: "task",
        drop: (item)=>addItemToSection(item.id),
        collect: monitor => ({
          isOver: !!monitor.isOver(),
        }),
      }))

  let text = "todo";
  let bg = "bg-blue-500";
  let taskToMap = todos;

  if (status === "inprogress") {
    text = "In Progress";
    bg = "bg-purple-500";
    taskToMap = inProgress ;
  }
  if (status === "closed") {
    text = "Closed";
    bg = "bg-green-500";
    taskToMap = closed ;
  }

  const addItemToSection  = (id) =>
    {
        setTasks(prev=>
            {
                const mTask = prev.map(t=>
                    {
                        if(t.id ===id)
                            {
                                return {...t,status:status}
                                
                            }
                        return t
                    }
                )
                localStorage.setItem("tasks",JSON.stringify(mTask))
                toast("task status updated",{icon:"👌"})
                return mTask
            }
            
        )
    }
  return (
    <div ref={drop} className={`w-64 p-2 rounded-lg ${isOver ? "bg-amber-500":""}`}>
      <Header text={text} bg={bg} count={taskToMap.length} />
      {taskToMap.length > 0 && taskToMap.map(task=> <Task key={task.id} tasks = {tasks} setTask = {setTasks} task = {task} />)}
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm`}>
      <h1>{text}</h1>
      <div className="ml-2 bg-white h-5 w-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};




const Task = ({ task,tasks,setTask }) => {

    const [{isDragging}, drag] = useDrag(() => ({
        type: "task",
        item: { id: task.id },
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      }))
      console.log(isDragging)

    const handleDelete = (id) =>
        {
            if(tasks)
                {
                    
                    const fTask = tasks.filter(t=>t.id !==id)
                    console.log(fTask)
                    setTask(fTask)
                    localStorage.setItem('tasks',JSON.stringify(fTask))
                    toast("task removed",{
                        icon:"❌"
                    })

                }
                console.log("no tasks")
        }


  return (
    <div ref={drag} className={`relative p-4 mt-8 shadow-lg rounded-2xl ${isDragging ? "opacity-25": "opacity-100"} cursor-grab`}>
        <p>{task.name}</p>
        <button id={task.id} onClick={()=>handleDelete(task.id)} className="absolute bottom-2 right-1 "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
</svg>

</button>
    </div>
  );
};
