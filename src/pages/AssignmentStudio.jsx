import React, { useState, useEffect } from "react";

function AssignmentStudio() {


    const [deskItems, setDeskItems] = useState([]);
  const [task,setTask] = useState("");
  const [time,setTime] = useState(25 * 60);
const [running,setRunning] = useState(false);

    const [selected, setSelected] = useState(null);
  const [assignment,setAssignment] = useState({
    name:"",
    subject:"",
    deadline:"",
    priority:"Medium"
});
function addTask(){

    if(!task) return;


    if(task.toLowerCase() === "research chapter"){

        setDeskItems([
            ...deskItems,
            {
                id:Date.now(),
                type:"Research Chapter",
                icon:"☑️",
                links:true
            }
        ]);

    }

    else{

        addItem(
            task,
            "☑️"
        );

    }


    setTask("");

}
useEffect(()=>{

    let timer;


    if(running){

        timer = setInterval(()=>{

            setTime(prev=>{

                if(prev <= 1){

                    setRunning(false);
                    return 0;

                }


                return prev - 1;

            });


        },1000);


    }


    return ()=>clearInterval(timer);


},[running]);
  function formatTime(){

    const minutes = Math.floor(time / 60);

    const seconds = time % 60;


    return `${minutes}:${seconds
    .toString()
    .padStart(2,"0")}`;

}

    function addItem(type, icon){

        setDeskItems([
            ...deskItems,
            {
                id:Date.now(),
                type,
                icon
            }
        ]);

    }
  function createAssignment(){

    if(!assignment.name) return;


    addItem(
        assignment.name,
        "📚"
    );


}



    function removeItem(id){

        setDeskItems(
            deskItems.filter(item=>item.id !== id)
        );


        setSelected(null);

    }



    return(

<div className="assignment-page">


<header className="hero">

<h1>📝 Assignment Studio</h1>

<p>
Your personal workspace for finishing assignments,
homework, journals, notes, and projects.
</p>

</header>



<main className="workspace">



<section className="card desk">


<h2>📚 Assignment Desk</h2>


<div className="desk-area">


{

deskItems.length===0 ?

<p className="empty">
Your desk is empty ✨
<br/>
Create your workspace
</p>


:

deskItems.map(item=>(


<div

key={item.id}

className={
selected===item.id
?
"desk-item selected"
:
"desk-item"
}


onClick={()=>setSelected(item.id)}

>


<span>
{item.icon}
</span>


<p>
{item.type}
</p>


{
item.links &&

<div className="desk-links">


<a
href="https://notebooklm.google.com/"
target="_blank"
rel="noopener noreferrer"
>
📒 NotebookLM
</a>



<a
href="https://www.google.com"
target="_blank"
rel="noopener noreferrer"
>
🌐 Google
</a>


</div>

}


</div>


))


}



</div>


</section>





<aside className="sidebar">


<div className="card">

<h2>📚 Assignment Info</h2>


<input

placeholder="Assignment Name"

value={assignment.name}

onChange={(e)=>
setAssignment({
...assignment,
name:e.target.value
})
}

/>



<input

placeholder="Subject"

value={assignment.subject}

onChange={(e)=>
setAssignment({
...assignment,
subject:e.target.value
})
}

/>




<input

type="date"

value={assignment.deadline}

onChange={(e)=>
setAssignment({
...assignment,
deadline:e.target.value
})
}

/>




<select

value={assignment.priority}

onChange={(e)=>
setAssignment({
...assignment,
priority:e.target.value
})
}

>

<option>
High
</option>

<option>
Medium
</option>

<option>
Low
</option>


</select>



<button onClick={createAssignment}>

Create Assignment

</button>


</div>

<div className="card">

    <h2>🎵 Music Corner</h2>

    <a 
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
    >
        <button>
            ▶ Open YouTube
        </button>
    </a>


    <button onClick={()=>addItem("Music","🎧")}>
        🎧 Add Music To Desk
    </button>

</div>



<div className="card">

<h2>📊 Statistics</h2>


<button onClick={()=>addItem("Progress","📈")}>
Add Progress
</button>


</div>
<div className="card">

<h2>⏱ Study Timer</h2>


<h1 style={{
textAlign:"center",
color:"#064e3b"
}}>

{formatTime()}

</h1>



<button onClick={()=>setRunning(true)}>

▶ Start

</button>



<button onClick={()=>setRunning(false)}>

⏸ Pause

</button>



<button onClick={()=>{

setTime(25*60);
setRunning(false);

}}>

🔄 Reset

</button>



</div>

<input

placeholder="Task name"

value={task}

onChange={(e)=>setTask(e.target.value)}

/>


<button onClick={addTask}>
+ Add Task
</button>

<div className="card">

<h2>📋 Checklist</h2>


<button onClick={()=>addItem("Task","☑️")}>
Add Task
</button>



</div>



</aside>


</main>




{
selected &&

<div className="popup">

<h3>
Selected Item
</h3>


<p>

{
deskItems.find(
item=>item.id===selected
)?.icon
}

&nbsp;

{
deskItems.find(
item=>item.id===selected
)?.type
}

</p>



<button

onClick={()=>removeItem(selected)}

>

Remove

</button>


</div>

}




<style>{`

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Poppins&display=swap');


*{
box-sizing:border-box;
}




.assignment-page{

min-height:100vh;

padding:30px;

background:
radial-gradient(circle,#065f46,#021c16);

font-family:Poppins;

}




.hero{

padding:40px;

border-radius:25px;

text-align:center;

background:#064e3b;

color:white;

border:1px solid #d4af37;

margin-bottom:30px;

}



.hero h1{

font-family:Cinzel;

color:#d4af37;

font-size:42px;

}




.workspace{

display:grid;

grid-template-columns:2fr 1fr;

gap:30px;

}




.card{

background:white;

padding:30px;

border-radius:25px;

border-top:5px solid #d4af37;

}




.card h2{

color:#064e3b;

font-family:Cinzel;

}


.desk-links{

display:flex;

flex-direction:column;

gap:5px;

margin-top:8px;

font-size:11px;

}


.desk-links a{

color:#064e3b;

text-decoration:none;

}

.desk-area{

height:550px;

background:#f5f1e6;

border-radius:20px;

padding:25px;

display:flex;

flex-wrap:wrap;

gap:20px;

}

input,
select{

width:100%;

padding:12px;

margin-top:10px;

border-radius:12px;

border:1px solid #ddd;

font-size:14px;

}


.empty{

width:100%;

text-align:center;

margin-top:220px;

color:#777;

}





.desk-item{

height:110px;

width:110px;

background:white;

border-radius:20px;

display:flex;

align-items:center;

justify-content:center;

flex-direction:column;

font-size:35px;

cursor:pointer;

box-shadow:0 8px 20px #0003;

transition:.3s;

}



.desk-item:hover{

transform:translateY(-8px);

}




.selected{

border:3px solid #d4af37;

transform:scale(1.08);

}




.desk-item p{

font-size:12px;

}



.sidebar{

display:flex;

flex-direction:column;

gap:20px;

}





button{

width:100%;

padding:12px;

margin-top:10px;

border:none;

border-radius:15px;

background:#064e3b;

color:white;

cursor:pointer;

}




.popup{

position:fixed;

bottom:30px;

right:30px;

background:white;

padding:25px;

border-radius:20px;

box-shadow:0 10px 30px #0005;

color:#064e3b;

}</style>


</div>

    );

}


export default AssignmentStudio;
