// ================= GLOBAL =================
let countdown = 10;
let interval;
let cycleNumber = 0;

const lanes = ["A", "B", "C"];
let currentCycleTime = 10;

// ================= CHART =================
let chart;

window.onload = () => {
  console.log("✅ JS LOADED");

  const ctx = document.getElementById("densityChart");

  if (ctx) {
    chart = new Chart(ctx, {
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
        scales: { y: { beginAtZero: true } }
      }
    });
  }
};

// ================= SEND IMAGES =================
async function sendImages() {

  console.log("🚀 Start clicked");

  const f1 = document.getElementById("lane1")?.files[0];
  const f2 = document.getElementById("lane2")?.files[0];
  const f3 = document.getElementById("lane3")?.files[0];

  if (!f1 || !f2 || !f3) {
    alert("❗ Please upload all 3 images");
    return;
  }

  const fd = new FormData();
  fd.append("lane1", f1);
  fd.append("lane2", f2);
  fd.append("lane3", f3);

  try {
    console.log("📡 Sending request to backend...");

    const res = await fetch("/process", {
      method: "POST",
      body: fd
    });

    console.log("📥 Response status:", res.status);

    const text = await res.text(); // read raw first
    console.log("📦 Raw response:", text);

    if (!res.ok) throw new Error(text);

    const data = JSON.parse(text);

    console.log("✅ Parsed data:", data);

    updateDashboard(data);
    startCountdown(data.timer);

  } catch (err) {
    console.error("❌ Backend failed:", err);

    alert("Backend error. Check terminal logs.");

    // ❌ NO FAKE DEMO NOW — so you see real issue
  }
}

// ================= UPDATE UI =================
function updateDashboard(data) {

  console.log("🔄 Updating UI...");

  currentCycleTime = data.timer || 10;

  const timerEl = document.getElementById("timer");
  if (timerEl) timerEl.textContent = currentCycleTime;

  const siren = document.getElementById("siren-audio");
  const emergencyPanel = document.querySelector(".emergency");

  // RESET
  document.querySelectorAll(".lane-card")
    .forEach(l => l.classList.remove("active-lane", "siren-active", "emergency-lane"));

  // LOOP LANES
  lanes.forEach((l, i) => {

    const count = data.counts[`Lane ${i+1}`] || 0;
    const dens = data.density[`Lane ${i+1}`] || "Low";
    const signal = data.signal_status[`Lane ${i+1}`] || "Red";

    const laneCard = document.getElementById(`lane-${l}`);

    // COUNT
    const countEl = laneCard?.querySelector(".count");
    if (countEl) countEl.textContent = count + " vehicles";

    // DENSITY
    const densityEl = document.getElementById(`density-${l}`);
    if (densityEl) densityEl.textContent = dens;

    // IMAGE
    if (data.lanes[i] && data.lanes[i].image) {
      const img = document.getElementById(`img-${l}`);
      if (img) {
        img.src = "data:image/jpeg;base64," + data.lanes[i].image;
      }
    }

    // SIGNAL
    if (signal === "Green") {
      laneCard?.classList.add("active-lane");
    }
  });

  // ================= AI =================
  document.getElementById("ai-lane").textContent = data.selected_lane || "--";
  document.getElementById("ai-reason").textContent = data.reason || "--";

  // ================= EMERGENCY =================
  const em = document.getElementById("emergency-status");

  if (data.emergency_detected) {

    em.textContent = "🚑 " + data.emergency_lane;

    const idx = parseInt(data.emergency_lane.split(" ")[1]) - 1;
    const lane = lanes[idx];

    document.getElementById(`lane-${lane}`)
      ?.classList.add("siren-active", "emergency-lane");

    emergencyPanel?.classList.add("emergency-active");

    if (siren) {
      siren.currentTime = 0;
      siren.play();
    }

  } else {
    em.textContent = "No Ambulance";
    siren?.pause();
  }

  // ================= CHART =================
  if (chart) {
    chart.data.datasets[0].data =
      lanes.map((_, i) => data.counts[`Lane ${i+1}`] || 0);
    chart.update();
  }

  // ================= LOGS =================
  const log = document.createElement("li");
  log.textContent = `Cycle ${++cycleNumber}: ${data.selected_lane} (${data.timer}s)`;

  document.getElementById("notifications")?.prepend(log);
}

// ================= TIMER =================
function startCountdown(dynamicTime) {

  countdown = dynamicTime || 10;
  currentCycleTime = countdown;

  clearInterval(interval);

  interval = setInterval(() => {

    countdown--;

    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = countdown;

    const progress = (countdown / currentCycleTime) * 100;

    document.getElementById("circle-progress")
      ?.setAttribute("stroke-dasharray", `${progress},100`);

    if (countdown <= 0) {
      clearInterval(interval);
      sendImages();
    }

  }, 1000);
}