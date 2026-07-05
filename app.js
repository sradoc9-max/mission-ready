const defaultData={activeProfileId:"conan",profiles:[{id:"conan",name:"Conan",startWeight:244,startWaist:43,goalWaist:34},{id:"juan",name:"Juan Doan",startWeight:null,startWaist:null,goalWaist:null},{id:"stephen",name:"Stephen Christian",startWeight:null,startWaist:null,goalWaist:null}],daily:[],workouts:[],missions:{},trainingMaxes:{},weekly:{}};

const templates={
"Upper A":[
{name:"Bench Press",type:"upper",rest:120,sets:[["Warm-up",95,8],["Warm-up",135,5],["1",185,8],["2",185,8],["3",185,8],["4",185,8]]},
{name:"Lat Pulldown",type:"upper",rest:90,sets:[["1",120,10],["2",120,10],["3",120,10],["4",120,10]]},
{name:"Incline DB Press",type:"upper",rest:90,sets:[["1",50,10],["2",50,10],["3",50,10]]},
{name:"Seated Cable Row",type:"upper",rest:90,sets:[["1",120,10],["2",120,10],["3",120,10]]},
{name:"Lateral Raise",type:"upper",rest:60,sets:[["1",20,15],["2",20,15],["3",20,15]]},
{name:"Rope Pushdown",type:"upper",rest:60,sets:[["1",50,15],["2",50,15],["3",50,15]]}
],
"Lower A":[
{name:"Squat",type:"lower",rest:180,sets:[["Warm-up",135,5],["Warm-up",185,3],["1",225,6],["2",225,6],["3",225,6],["4",225,6]]},
{name:"Romanian Deadlift",type:"lower",rest:120,sets:[["1",185,8],["2",185,8],["3",185,8]]},
{name:"Walking Lunge",type:"lower",rest:90,sets:[["1",30,12],["2",30,12],["3",30,12]]},
{name:"Leg Curl",type:"lower",rest:75,sets:[["1",90,12],["2",90,12],["3",90,12]]},
{name:"Standing Calf Raise",type:"lower",rest:60,sets:[["1",140,15],["2",140,15],["3",140,15],["4",140,15]]},
{name:"Plank",type:"core",rest:60,sets:[["1",0,45],["2",0,45],["3",0,45]]}
],
"Zone 2 Cardio":[
{name:"Zone 2 Cardio",type:"cardio",rest:0,sets:[["Minutes",0,45]]}
],
"Upper B":[
{name:"DB Overhead Press",type:"upper",rest:90,sets:[["1",35,10],["2",35,10],["3",35,10]]},
{name:"Chest Supported Row",type:"upper",rest:90,sets:[["1",90,10],["2",90,10],["3",90,10],["4",90,10]]},
{name:"Machine Chest Press",type:"upper",rest:90,sets:[["1",120,12],["2",120,12],["3",120,12]]},
{name:"Cable Fly",type:"upper",rest:60,sets:[["1",30,15],["2",30,15],["3",30,15]]},
{name:"Hammer Curl",type:"upper",rest:60,sets:[["1",30,12],["2",30,12],["3",30,12]]},
{name:"Face Pull",type:"upper",rest:60,sets:[["1",50,15],["2",50,15],["3",50,15]]}
],
"Lower B + Conditioning":[
{name:"Trap Bar Deadlift",type:"lower",rest:180,sets:[["Warm-up",135,5],["Warm-up",225,3],["1",275,5],["2",275,5],["3",275,5],["4",275,5]]},
{name:"Leg Press",type:"lower",rest:90,sets:[["1",270,12],["2",270,12],["3",270,12]]},
{name:"Goblet Squat",type:"lower",rest:90,sets:[["1",60,15],["2",60,15],["3",60,15]]},
{name:"Leg Extension",type:"lower",rest:75,sets:[["1",100,15],["2",100,15],["3",100,15]]},
{name:"Hanging Knee Raise",type:"core",rest:60,sets:[["1",0,15],["2",0,15],["3",0,15]]},
{name:"Incline Treadmill",type:"cardio",rest:0,sets:[["Minutes",0,10]]}
]};

function data(){return JSON.parse(localStorage.getItem("missionReadyV2")||JSON.stringify(defaultData))}
function save(d){localStorage.setItem("missionReadyV2",JSON.stringify(d))}
function today(){return new Date().toISOString().split("T")[0]}
function prof(){let d=data();return d.profiles.find(p=>p.id===d.activeProfileId)||d.profiles[0]}
function showTab(id){document.querySelectorAll(".tab").forEach(x=>x.classList.add("hidden"));document.getElementById(id).classList.remove("hidden"); if(id==="progress") renderProgress()}
function phase(w){w=parseInt(w); if(w<=4)return "1-4"; if(w<=8)return "5-8"; return "9-12"}
function adjustmentForWeek(w){w=parseInt(w); if(w<=4)return {upper:0,lower:0}; if(w<=8)return {upper:5,lower:10}; return {upper:10,lower:20}}

function init(){
 let d=data(); save(d);
 document.getElementById("dailyDate").value=today(); document.getElementById("workoutDate").value=today();
 ["weekSelect"].forEach(id=>{let e=document.getElementById(id); e.innerHTML=""; for(let i=1;i<=12;i++)e.innerHTML+=`<option value="${i}">Week ${i}</option>`});
 document.getElementById("workoutSelect").innerHTML=Object.keys(templates).map(x=>`<option>${x}</option>`).join("");
 renderProfiles(); renderHome(); loadWorkout(); renderProgress();
}

function renderProfiles(){
 let d=data(), p=prof();
 document.getElementById("profileSelect").innerHTML=d.profiles.map(x=>`<option value="${x.id}">${x.name}</option>`).join("");
 document.getElementById("profileSelect").value=d.activeProfileId;
 document.getElementById("goalChip").innerText=`${p.name}: ${p.startWaist??"—"}” → ${p.goalWaist??"—"}” waist`;
 document.getElementById("profileList").innerHTML=d.profiles.map(x=>`<div class="stat"><b>${x.name}</b><br>Start: ${x.startWeight??"—"} lb / ${x.startWaist??"—"}” waist<br>Goal waist: ${x.goalWaist??"—"}”</div>`).join("");
}
function changeProfile(){let d=data();d.activeProfileId=document.getElementById("profileSelect").value;save(d);renderProfiles();renderHome();loadWorkout();renderProgress()}

function missionKey(){return prof().id+"_"+today()}
function renderHome(){
 let d=data(), p=prof(), m=d.missions[missionKey()]||{};
 let items=["Workout completed","Protein ≥ 200g","Calories ≤ 2300","Steps ≥ 10,000","Water goal","Sleep ≥ 7 hours"];
 document.getElementById("missionList").innerHTML=items.map((x,i)=>`<label class="mission-item"><input type="checkbox" id="m${i}" ${m[i]?"checked":""}> ${x}</label>`).join("");
 let daily=d.daily.filter(x=>x.profileId===p.id), workouts=d.workouts.filter(x=>x.profileId===p.id);
 let last=daily[daily.length-1]||{};
 let waistLost=(p.startWaist&&last.waist)?(p.startWaist-parseFloat(last.waist)).toFixed(1):"—";
 let wtLost=(p.startWeight&&last.weight)?(p.startWeight-parseFloat(last.weight)).toFixed(1):"—";
 document.getElementById("snapshot").innerHTML=`
 <div class="stat">Latest Weight<div class="big">${last.weight||"—"} lb</div><span>${wtLost} lb lost</span></div>
 <div class="stat">Latest Waist<div class="big">${last.waist||"—"}”</div><span>${waistLost}” lost</span></div>
 <div class="stat">Workouts Logged<div class="big">${workouts.length}</div><span>Target: 5/week</span></div>
 <div class="stat">Primary Goal<div class="big">${p.goalWaist||34}”</div><span>Waist is the main metric</span></div>`;
}
function saveMission(){let d=data();d.missions[missionKey()]={}; for(let i=0;i<6;i++)d.missions[missionKey()][i]=document.getElementById("m"+i).checked; save(d); alert("Mission saved.")}

function lastExercise(profileId,name){
 let d=data(); let all=d.workouts.filter(w=>w.profileId===profileId).flatMap(w=>w.exercises||[]).filter(e=>e.name===name);
 return all[all.length-1];
}
function targetSets(ex,week){
 let adj=adjustmentForWeek(week); let p=prof(); let key=p.id+"_"+ex.name; let d=data();
 let savedMax=d.trainingMaxes[key];
 return ex.sets.map(s=>{
   let label=s[0], wt=s[1], reps=s[2];
   if(savedMax && label!=="Warm-up" && ex.type!=="cardio" && ex.type!=="core") wt=savedMax;
   else if(label!=="Warm-up" && ex.type==="upper") wt+=adj.upper;
   else if(label!=="Warm-up" && ex.type==="lower") wt+=adj.lower;
   return {label, weight:wt, reps, done:false}
 })
}
function loadWorkout(){
 let day=document.getElementById("workoutSelect").value, week=document.getElementById("weekSelect").value;
 let list=templates[day];
 document.getElementById("exerciseNav").innerHTML=list.map((e,i)=>`<button onclick="scrollToExercise(${i})">${i+1}. ${e.name}</button>`).join("");
 document.getElementById("historyExercise").innerHTML=[...new Set(Object.values(templates).flat().map(e=>e.name))].sort().map(x=>`<option>${x}</option>`).join("");
 document.getElementById("workoutContainer").innerHTML=list.map((ex,ei)=>{
   let last=lastExercise(prof().id,ex.name);
   let sets=targetSets(ex,week);
   let prev=last?last.sets.map(s=>`${s.weight}x${s.reps}${s.done?" ✓":""}`).join(", "):"No previous data";
   return `<div class="exercise-card" id="exercise${ei}" data-name="${ex.name}" data-type="${ex.type}">
    <div class="exercise-title"><h3>${ex.name}</h3><span>Rest: ${ex.rest||0}s</span></div>
    <div class="previous"><b>Previous:</b> ${prev}</div>
    <table class="set-table"><thead><tr><th>Set</th><th>Weight</th><th>Reps</th><th>Done</th></tr></thead><tbody>
    ${sets.map((s,si)=>`<tr>
      <td>${s.label}</td>
      <td><input type="number" step="0.5" id="e${ei}s${si}w" value="${s.weight}"></td>
      <td><input type="number" id="e${ei}s${si}r" value="${s.reps}"></td>
      <td><input type="checkbox" id="e${ei}s${si}d" onchange="maybeStartRest(${ex.rest||0})"></td>
    </tr>`).join("")}
    </tbody></table>
   </div>`
 }).join("");
 renderHistory();
}
function scrollToExercise(i){document.getElementById("exercise"+i).scrollIntoView({behavior:"smooth",block:"start"})}
function maybeStartRest(sec){if(sec>0) startTimer(sec)}

let timer=null,endTime=null;
function startTimer(sec){clearInterval(timer);endTime=Date.now()+sec*1000;tick();timer=setInterval(tick,250)}
function tick(){let left=Math.max(0,Math.round((endTime-Date.now())/1000));let m=String(Math.floor(left/60)).padStart(2,"0"),s=String(left%60).padStart(2,"0");document.getElementById("timerDisplay").innerText=`${m}:${s}`; if(left<=0)clearInterval(timer)}
function stopTimer(){clearInterval(timer);document.getElementById("timerDisplay").innerText="00:00"}

function collectWorkout(){
 let day=document.getElementById("workoutSelect").value, week=document.getElementById("weekSelect").value;
 let exercises=[...document.querySelectorAll(".exercise-card")].map((card,ei)=>{
   let rows=[...card.querySelectorAll("tbody tr")];
   return {name:card.dataset.name,type:card.dataset.type,sets:rows.map((r,si)=>({
     label:r.children[0].innerText,
     weight:document.getElementById(`e${ei}s${si}w`).value,
     reps:document.getElementById(`e${ei}s${si}r`).value,
     done:document.getElementById(`e${ei}s${si}d`).checked
   }))}
 });
 return {profileId:prof().id,date:document.getElementById("workoutDate").value||today(),week,workout:day,exercises,notes:document.getElementById("workoutNotes").value}
}
function saveWorkout(){let d=data();d.workouts.push(collectWorkout());save(d);renderHome();renderProgress();alert("Workout saved.")}
function finishWorkout(){
 let d=data(), w=collectWorkout(); d.workouts.push(w);
 w.exercises.forEach(ex=>{
   if(!["upper","lower"].includes(ex.type))return;
   let workSets=ex.sets.filter(s=>s.label!=="Warm-up");
   let allDone=workSets.length&&workSets.every(s=>s.done);
   let sameWeight=workSets.map(s=>parseFloat(s.weight)).filter(x=>!isNaN(x));
   if(allDone&&sameWeight.length){
     let max=Math.max(...sameWeight);
     let inc=ex.type==="upper"?5:10;
     d.trainingMaxes[w.profileId+"_"+ex.name]=max+inc;
   }
 });
 save(d); renderHome(); renderProgress(); alert("Workout saved. Next weights updated where all work sets were completed.")
}

function saveDaily(){
 let d=data();d.daily.push({profileId:prof().id,date:document.getElementById("dailyDate").value||today(),weight:val("weight"),waist:val("waist"),calories:val("calories"),protein:val("protein"),steps:val("steps"),water:val("water"),sleep:val("sleep"),notes:val("dailyNotes")});save(d);renderHome();renderProgress();alert("Daily check-in saved.")
}
function val(id){return document.getElementById(id).value}

function avg(arr,key){let v=arr.map(x=>parseFloat(x[key])).filter(x=>!isNaN(x));return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):"—"}
function renderProgress(){
 let d=data(), p=prof(), daily=d.daily.filter(x=>x.profileId===p.id), last=daily[daily.length-1]||{}, last7=daily.slice(-7);
 let waistLost=(p.startWaist&&last.waist)?(p.startWaist-parseFloat(last.waist)).toFixed(1):"—";
 let wtLost=(p.startWeight&&last.weight)?(p.startWeight-parseFloat(last.weight)).toFixed(1):"—";
 document.getElementById("progressCards").innerHTML=`
 <div class="stat">Weight Lost<div class="big">${wtLost}</div></div>
 <div class="stat">Waist Lost<div class="big">${waistLost}”</div></div>
 <div class="stat">7-Day Calories<div class="big">${avg(last7,"calories")}</div></div>
 <div class="stat">7-Day Protein<div class="big">${avg(last7,"protein")}g</div></div>
 <div class="stat">7-Day Steps<div class="big">${avg(last7,"steps")}</div></div>`;
 document.getElementById("teamSnapshot").innerHTML=d.profiles.map(x=>{
  let dd=d.daily.filter(r=>r.profileId===x.id), ww=d.workouts.filter(r=>r.profileId===x.id), l=dd[dd.length-1]||{};
  return `<div class="stat"><b>${x.name}</b><br>Workouts: ${ww.length}<br>Weight: ${l.weight||"—"}<br>Waist: ${l.waist||"—"}</div>`
 }).join("");
 renderHistory();
}
function renderHistory(){
 let ex=document.getElementById("historyExercise")?.value; if(!ex)return;
 let hist=data().workouts.filter(w=>w.profileId===prof().id).flatMap(w=>w.exercises.map(e=>({...e,date:w.date,workout:w.workout}))).filter(e=>e.name===ex);
 document.getElementById("history").innerHTML=hist.length?hist.map(h=>`<div class="stat"><b>${h.date}</b> ${h.workout}<br>${h.sets.map(s=>`${s.label}: ${s.weight}x${s.reps}${s.done?" ✓":""}`).join("<br>")}</div>`).join(""):"No history yet.";
}

function addProfile(){let d=data(), name=val("newName").trim(); if(!name)return alert("Name required."); d.profiles.push({id:name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now().toString().slice(-4),name,startWeight:num("newStartWeight"),startWaist:num("newStartWaist"),goalWaist:num("newGoalWaist")}); save(d); renderProfiles(); renderProgress()}
function num(id){let n=parseFloat(val(id));return isNaN(n)?null:n}

function exportJSON(){download(JSON.stringify(data(),null,2),"mission_ready_v2_backup.json","application/json")}
function exportCSV(){
 let d=data(), names=Object.fromEntries(d.profiles.map(p=>[p.id,p.name])); let csv="type,profile,date,week,workout,exercise,set,weight,reps,done,waist,bodyweight,calories,protein,steps,water,sleep,notes\n";
 d.daily.forEach(x=>csv+=`daily,"${names[x.profileId]}",${x.date},,,,,,,,,${x.waist},${x.weight},${x.calories},${x.protein},${x.steps},${x.water},${x.sleep},"${(x.notes||"").replaceAll('"','""')}"\n`);
 d.workouts.forEach(w=>w.exercises.forEach(e=>e.sets.forEach(s=>csv+=`workout,"${names[w.profileId]}",${w.date},${w.week},"${w.workout}","${e.name}","${s.label}",${s.weight},${s.reps},${s.done},,,,,,,, "${(w.notes||"").replaceAll('"','""')}"\n`)));
 download(csv,"mission_ready_v2_export.csv","text/csv")
}
function download(text,file,type){let blob=new Blob([text],{type});let url=URL.createObjectURL(blob);let a=document.createElement("a");a.href=url;a.download=file;a.click()}
function importJSON(ev){let f=ev.target.files[0]; if(!f)return; let r=new FileReader(); r.onload=()=>{try{localStorage.setItem("missionReadyV2",r.result);init();alert("Imported.")}catch(e){alert("Import failed.")}}; r.readAsText(f)}
function clearData(){if(confirm("Delete all local Mission Ready v2 data?")){localStorage.removeItem("missionReadyV2");init()}}
init();
