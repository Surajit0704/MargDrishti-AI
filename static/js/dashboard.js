// ================= GLOBAL =================
let countdown = 10;
let interval;
let cycleNumber = 0;

const lanes = ["A", "B", "C"];
let currentCycleTime = 10;

// ================= CHART =================
const ctx = document.getElementById("densityChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Lane A", "Lane B", "Lane C"],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ["#06b6d4", "#22c55e", "#f97316"]
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// ================= SEND IMAGES =================
async function sendImages() {

  const f1 = document.getElementById("lane1").files[0];
  const f2 = document.getElementById("lane2").files[0];
  const f3 = document.getElementById("lane3").files[0];

  if (!f1 || !f2 || !f3) {
    alert("Upload all 3 images");
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

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();

    updateDashboard(data);
    startCountdown(data.timer);

  } catch (err) {
    console.error(err);

    // 🔥 FALLBACK DEMO DATA
    alert("Backend error → showing demo");

    const demo = {
      counts: { "Lane 1": 12, "Lane 2": 25, "Lane 3": 8 },
      density: { "Lane 1": "Medium", "Lane 2": "High", "Lane 3": "Low" },
      signal_status: { "Lane 1": "Red", "Lane 2": "Green", "Lane 3": "Red" },
      selected_lane: "Lane 2",
      reason: "High density",
      emergency_detected: false,
      timer: 15,
      lanes: [{}, {}, {}]
    };

    updateDashboard(demo);
    startCountdown(15);
  }
}

// ================= UPDATE UI =================
function updateDashboard(data) {

  currentCycleTime = data.timer || 10;
  document.getElementById("timer").textContent = currentCycleTime;

  const siren = document.getElementById("siren-audio");
  const emergencyPanel = document.querySelector(".emergency");

  // RESET ALL
  document.querySelectorAll(".lane-card")
    .forEach(l => l.classList.remove("active-lane", "siren-active", "emergency-lane"));

  document.querySelectorAll(".light")
    .forEach(light => {
      light.classList.remove("green");
      light.style.background = "#333";
    });

  if (emergencyPanel) emergencyPanel.classList.remove("emergency-active");

  // LOOP LANES
  lanes.forEach((l, i) => {

    const count = data.counts[`Lane ${i+1}`] || 0;
    const density = data.density[`Lane ${i+1}`] || "Low";
    const signal = data.signal_status[`Lane ${i+1}`] || "Red";

    // COUNT
    document.querySelector(`#lane-${l} .count`).textContent =
      count + " vehicles";

    // DENSITY
    document.getElementById(`density-${l}`).textContent = density;

    // IMAGE
    if (data.lanes[i] && data.lanes[i].image) {
      document.getElementById(`img-${l}`).src =
        "data:image/jpeg;base64," + data.lanes[i].image;
    }

    // SIGNAL LIGHT
    const light = document.getElementById(`signal-${l}`);

    if (signal === "Green") {
      light.classList.add("green");
      light.style.background = "lime";

      document.getElementById(`lane-${l}`)
        .classList.add("active-lane");
    }
  });

  // ================= AI DECISION =================
  document.getElementById("ai-lane").textContent = data.selected_lane || "--";
  document.getElementById("ai-reason").textContent = data.reason || "--";

  // ================= EMERGENCY =================
  const em = document.getElementById("emergency-status");

  if (data.emergency_detected) {

    em.textContent = "🚑 " + data.emergency_lane;

    const idx = parseInt(data.emergency_lane.split(" ")[1]) - 1;
    const lane = lanes[idx];

    document.getElementById(`lane-${lane}`)
      .classList.add("siren-active", "emergency-lane");

    if (emergencyPanel) emergencyPanel.classList.add("emergency-active");

    siren.currentTime = 0;
    siren.play();

  } else {
    em.textContent = "No Ambulance";
    siren.pause();
  }

  // ================= CHART =================
  chart.data.datasets[0].data =
    lanes.map((_, i) => data.counts[`Lane ${i+1}`] || 0);
  chart.update();

  // ================= LOGS =================
  const li = document.createElement("li");
  li.textContent = `Cycle ${++cycleNumber}: ${data.selected_lane} (${data.timer}s)`;

  document.getElementById("notifications").prepend(li);
}

// ================= TIMER =================
function startCountdown(dynamicTime) {

  countdown = dynamicTime || 10;
  currentCycleTime = countdown;

  clearInterval(interval);

  interval = setInterval(() => {

    countdown--;

    document.getElementById("timer").textContent = countdown;

    const progress = (countdown / currentCycleTime) * 100;

    document.getElementById("circle-progress")
      .setAttribute("stroke-dasharray", `${progress},100`);

    if (countdown <= 0) {
      clearInterval(interval);
      sendImages();
    }

  }, 1000);
}