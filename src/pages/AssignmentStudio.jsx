import React, { useEffect, useState } from "react";

function AssignmentStudio() {

  const [deskItems, setDeskItems] = useState([]);

  const [selected, setSelected] = useState(null);

  const [task, setTask] = useState("");

  const [time, setTime] = useState(25 * 60);

  const [running, setRunning] = useState(false);


  const [assignment, setAssignment] = useState({
    name: "",
    subject: "",
    deadline: "",
    priority: "Medium"
  });



  // TIMER

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



  // ADD OBJECT TO DESK

  function addItem(name, icon){

    setDeskItems(prev=>[
      ...prev,
      {
        id:Date.now(),
        name,
        icon
      }
    ]);

  }



  // ASSIGNMENT

  function createAssignment(){

    if(!assignment.name) return;


    addItem(
      assignment.name,
      "📚"
    );


  }



  // CHECKLIST

  function addTask(){

    if(!task) return;


    if(task.toLowerCase()==="research chapter"){

      setDeskItems(prev=>[
        ...prev,
        {
          id:Date.now(),
          name:"Research Chapter",
          icon:"☑️",
          research:true
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



  function removeItem(){

    setDeskItems(
      deskItems.filter(
        item=>item.id!==selected
      )
    );


    setSelected(null);

  }





return (

<div className="assignment-page">


<header className="hero">

<h1>
📝 Assignment Studio
</h1>


<p>
Your personal workspace for finishing assignments,
homework, journals, notes, and projects.
</p>


</header>





<main className="workspace">



{/* DESK */}


<section className="card desk">


<h2>
📚 Assignment Desk
</h2>



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
{item.name}
</p>



{
item.research &&

<div className="links">


<a
href="https://notebooklm.google.com"
target="_blank"
>
📒 NotebookLM
</a>


<a
href="https://google.com"
target="_blank"
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







{/* SIDEBAR */}


<aside className="sidebar">



<div className="card">


<h2>
📚 Assignment Info
</h2>



<input

placeholder="Assignment Name"

value={assignment.name}

onChange={
e=>setAssignment({
...assignment,
name:e.target.value
})
}

/>



<input

placeholder="Subject"

value={assignment.subject}

onChange={
e=>setAssignment({
...assignment,
subject:e.target.value
})
}

/>



<input

type="date"

value={assignment.deadline}

onChange={
e=>setAssignment({
...assignment,
deadline:e.target.value
})
}

/>



<select

value={assignment.priority}

onChange={
e=>setAssignment({
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


<h2>
🎵 Music Corner
</h2>



<a
href="https://youtube.com"
target="_blank"
>

<button>
▶ Open YouTube
</button>

</a>



<button
onClick={()=>addItem("Music","🎧")}
>

🎧 Add Music

</button>



</div>





<div className="card">


<h2>
⏱ Study Timer
</h2>



<h1>
{formatTime()}
</h1>



<button onClick={()=>setRunning(true)}>
▶ Start
</button>



<button onClick={()=>setRunning(false)}>
⏸ Pause
</button>



<button
onClick={()=>{
setTime(25*60);
setRunning(false);
}}
>
🔄 Reset
</button>



</div>



<div className="card">


<h2>
📋 Checklist
</h2>



<input

placeholder="Task"

value={task}

onChange={
e=>setTask(e.target.value)
}

/>



<button onClick={addTask}>
+ Add Task
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
i=>i.id===selected
)?.icon
}

&nbsp;

{
deskItems.find(
i=>i.id===selected
)?.name
}

</p>



<button onClick={removeItem}>
Remove
</button>


</div>

}


</div>
<style>{`

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Poppins&display=swap');


*{
box-sizing:border-box;
}


.assignment-page{

min-height:100vh;

padding:30px;

font-family:Poppins;

background:
radial-gradient(circle at top,#065f46,#021c16);

}



/* HERO */


.hero{

padding:40px;

text-align:center;

border-radius:30px;

background:#064e3b;

color:white;

border:1px solid #d4af37;

margin-bottom:30px;

box-shadow:0 15px 40px #0005;

}


.hero h1{

font-family:Cinzel;

font-size:42px;

color:#d4af37;

}



/* MAIN LAYOUT */


.workspace{

display:grid;

grid-template-columns:2fr 1fr;

gap:30px;

}



/* CARDS */


.card{

background:white;

padding:25px;

border-radius:25px;

border-top:5px solid #d4af37;

box-shadow:0 15px 35px #0003;

}



.card h2{

font-family:Cinzel;

color:#064e3b;

}





/* DESK */


.desk-area{

height:560px;

padding:25px;

border-radius:25px;

background:#f5f1e6;

display:flex;

flex-wrap:wrap;

gap:20px;

align-content:flex-start;

}



.empty{

width:100%;

text-align:center;

margin-top:220px;

color:#777;

}





.desk-item{

height:120px;

width:120px;

background:white;

border-radius:25px;

display:flex;

flex-direction:column;

align-items:center;

justify-content:center;

cursor:pointer;

font-size:35px;

box-shadow:0 8px 20px #0003;

transition:.3s;

}



.desk-item:hover{

transform:translateY(-8px);

}



.desk-item p{

font-size:12px;

text-align:center;

}





.selected{

border:3px solid #d4af37;

transform:scale(1.08);

}





/* LINKS */


.links{

display:flex;

flex-direction:column;

font-size:11px;

gap:5px;

margin-top:5px;

}



.links a{

color:#064e3b;

text-decoration:none;

}






/* SIDEBAR */


.sidebar{

display:flex;

flex-direction:column;

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




button{

width:100%;

padding:12px;

margin-top:10px;

border:none;

border-radius:15px;

background:#064e3b;

color:white;

font-size:14px;

cursor:pointer;

transition:.3s;

}



button:hover{

transform:translateY(-3px);

box-shadow:0 8px 20px #0004;

}





/* TIMER */


.card h1{

text-align:center;

color:#064e3b;

font-family:Cinzel;

}





/* POPUP */


.popup{

position:fixed;

bottom:30px;

right:30px;

background:white;

padding:25px;

border-radius:25px;

box-shadow:0 15px 40px #0005;

color:#064e3b;

}





/* MOBILE */


@media(max-width:900px){


.workspace{

grid-template-columns:1fr;

}


.desk-area{

height:auto;

min-height:500px;

}


}

`}</style>
);

}

export default AssignmentStudio;
