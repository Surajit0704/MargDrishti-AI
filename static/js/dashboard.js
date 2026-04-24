let countdown = 10;
let interval;
let cycleNumber = 0;

const lanes = ["A", "B", "C"];
let currentCycleTime = 10; // 🔥 store dynamic time

// Chart
const ctx = document.getElementById("densityChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Lane A", "Lane B", "Lane C"],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ["#06b6d4","#22c55e","#f97316"]
    }]
  }
});

// 🚀 SEND IMAGES
async function sendImages() {

  console.log("Start clicked");

  const f1 = document.getElementById("lane1").files[0];
  const f2 = document.getElementById("lane2").files[0];
  const f3 = document.getElementById("lane3").files[0];

  if (!f1 || !f2 || !f3) {
    alert("Please upload all 3 images");
    return;
  }

  const fd = new FormData();
  fd.append("lane1", f1);
  fd.append("lane2", f2);
  fd.append("lane3", f3);

  try {
    const res = await fetch("/process", {
      method: "POST",
      body: fd
    });

    const data = await res.json();
    console.log("Response:", data);

    updateDashboard(data);

    // 🔥 use backend timer
    startCountdown(data.timer);

  } catch (err) {
    console.error(err);
    alert("Error connecting to backend");
  }
}

// 🔄 UPDATE UI
function updateDashboard(data) {

  currentCycleTime = data.timer || 10; // 🔥 store timer

  document.getElementById("timer").textContent = currentCycleTime;

  document.querySelectorAll(".lane-card")
    .forEach(l => l.classList.remove("siren-active","emergency-lane"));

  const siren = document.getElementById("siren-audio");

  lanes.forEach((l,i)=>{

    document.querySelector(`#lane-${l} .count`).textContent =
      data.counts[`Lane ${i+1}`];

    document.getElementById(`density-${l}`).textContent =
      data.density[`Lane ${i+1}`];

    const signal = data.signal_status[`Lane ${i+1}`];
    document.getElementById(`signal-${l}`).textContent =
      signal==="Green"?"🟢":"🔴";

    document.getElementById(`lane-${l}`)
      .classList.toggle("active", signal==="Green");

    if(data.lanes[i].image){
      document.getElementById(`img-${l}`).src =
        "data:image/jpeg;base64," + data.lanes[i].image;
    }
  });

  // 🧠 AI Decision
  document.getElementById("ai-lane").textContent = data.selected_lane;
  document.getElementById("ai-reason").textContent = data.reason;

  // 🚑 Emergency
  const em = document.getElementById("emergency-status");

  if(data.emergency_detected){
    em.textContent = "🚑 " + data.emergency_lane;

    const idx = parseInt(data.emergency_lane.split(" ")[1]) - 1;
    const lane = ["A","B","C"][idx];

    document.getElementById(`lane-${lane}`)
      .classList.add("siren-active","emergency-lane");

    siren.currentTime = 0;
    siren.play();

  } else {
    em.textContent = "No Ambulance";
    siren.pause();
  }

  // 📊 AI Explanation
  let html="";
  Object.keys(data.counts).forEach(l=>{
    html+=`<div class="ai-item">${l}: ${data.counts[l]} vehicles (${data.density[l]})</div>`;
  });

  html+= data.emergency_detected
    ? `<div class="ai-item">🚑 Emergency override → ${data.emergency_lane}</div>`
    : `<div class="ai-item">📊 Highest density → ${data.selected_lane}</div>`;

  document.getElementById("ai-details").innerHTML = html;

  // 📊 Chart
  chart.data.datasets[0].data =
    lanes.map((_,i)=>data.counts[`Lane ${i+1}`]);
  chart.update();

  // 🔔 Logs
  const li=document.createElement("li");
  li.textContent=`Cycle ${++cycleNumber}: ${data.selected_lane} (${data.timer}s)`;
  document.getElementById("notifications").prepend(li);
}

// ⏳ TIMER (DYNAMIC)
function startCountdown(dynamicTime){

  countdown = dynamicTime || 10;
  currentCycleTime = countdown;

  clearInterval(interval);

  interval = setInterval(()=>{

    countdown--;

    document.getElementById("timer").textContent = countdown;

    // 🔥 smooth circular progress
    const progress = (countdown / currentCycleTime) * 100;
    document.getElementById("circle-progress")
      .setAttribute("stroke-dasharray", `${progress},100`);

    if(countdown <= 0){
      clearInterval(interval);
      sendImages(); // next cycle
    }

  },1000);
}