// ================= GLOBAL VARIABLES & DOM CACHE =================
let countdown = 10;
let interval;
let cycleNumber = 0;
const lanes = ["A", "B", "C", "D"];
let currentCycleTime = 10;
let chart;

const DOM = {};

window.onload = () => {
  console.log("✅ JS LOADED");

  // Cache DOM Elements
  DOM.timer = document.getElementById("timer");
  DOM.progress = document.getElementById("timer-progress");
  DOM.siren = document.getElementById("siren-audio");
  DOM.notifications = document.getElementById("notifications");
  DOM.densityChart = document.getElementById("densityChart");
  DOM.emStatus = document.getElementById("emergency-status");
  DOM.emPanel = document.getElementById("emergency-panel");
  DOM.gcBtn = document.getElementById("green-corridor-btn");
  
  DOM.aiReason = document.getElementById("ai-reason");
  DOM.aiLane = document.getElementById("ai-lane");
  DOM.armedDot = document.getElementById("system-armed-dot");
  DOM.armedText = document.getElementById("system-armed-text");

  DOM.timerDotRed = document.getElementById("timer-dot-red");
  DOM.timerDotYellow = document.getElementById("timer-dot-yellow");
  DOM.timerDotGreen = document.getElementById("timer-dot-green");
  DOM.timerLaneLabel = document.getElementById("timer-lane-label");
  DOM.emergencyPhaseLabel = document.getElementById("emergency-phase-label");

  DOM.lanes = {};
  lanes.forEach(l => {
    DOM.lanes[l] = {
      card: document.getElementById(`lane-${l}`),
      count: document.querySelector(`#lane-${l} .count`),
      density: document.getElementById(`density-${l}`),
      ambulance: document.getElementById(`ambulance-${l}`),
      img: document.getElementById(`img-${l}`),
      red: document.getElementById(`red-${l}`),
      yellow: document.getElementById(`yellow-${l}`),
      green: document.getElementById(`green-${l}`)
    };
  });

  initChart();
};

function initChart() {
  if (DOM.densityChart) {
    chart = new Chart(DOM.densityChart, {
      type: "bar",
      data: {
        labels: ["Lane A", "Lane B", "Lane C", "Lane D"],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ["#06b6d4", "#22c55e", "#f97316", "#a855f7"]
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}

// ================= LOGGING =================
function addLog(message, type = "info") {
  if (!DOM.notifications) return;
  const timeStr = new Date().toTimeString().split(' ')[0];
  const logDiv = document.createElement("div");

  const colors = {
    primary: "text-primary",
    secondary: "text-secondary",
    warning: "text-orange-accent",
    error: "text-red-signal",
    variant: "text-on-surface-variant",
    info: "text-on-surface"
  };
  
  logDiv.className = colors[type] || colors.info;
  logDiv.innerHTML = `<span class="text-outline-variant mr-sm">[${timeStr}]</span> ${message}`;
  DOM.notifications.prepend(logDiv);
}

// ================= API CALLS =================
async function sendImages() {
  console.log("🚀 Auto Simulation Started");
  addLog("Auto AI Simulation Started.", "variant");
  unlockAudio();

  try {
    const res = await fetch("/process", { method: "POST" });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    updateDashboard(data);
    handleTimerState(data);
  } catch (err) {
    console.error("❌ Backend failed:", err);
    alert("Backend error. Check terminal logs.");
  }
}

async function manualRefresh() {
  console.log("🔄 Manual Refresh Triggered");
  addLog("System Refresh initiated by Operator Profile.", "variant");
  try {
    const res = await fetch("/manual_refresh", { method: "GET" });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    updateDashboard(data);
    handleTimerState(data);
  } catch (err) {
    console.error("❌ Manual refresh failed:", err);
  }
}

function unlockAudio() {
  if (DOM.siren) {
    DOM.siren.play().then(() => {
      DOM.siren.pause();
      DOM.siren.currentTime = 0;
    }).catch(err => console.log("Audio unlock failed"));
  }
}

// ================= TIMER LOGIC =================
function handleTimerState(data) {
  clearInterval(interval);
  if (!data.manual_override) {
    startCountdown(data.timer);
  } else {
    if (DOM.timer) {
      DOM.timer.textContent = "HOLD";
      DOM.timer.classList.add("timer-blink");
      DOM.timer.style.color = "#ff3b3b";
      DOM.timer.style.textShadow = "0 0 20px rgba(255,59,59,0.6)";
    }
    if (DOM.progress) {
      DOM.progress.style.width = "100%";
      DOM.progress.dataset.level = "critical";
    }
    interval = setInterval(sendImages, 3000);
  }
}

function startCountdown(dynamicTime) {
  countdown = dynamicTime || 10;
  currentCycleTime = countdown;
  clearInterval(interval);

  interval = setInterval(() => {
    countdown--;
    
    if (DOM.timer) {
      const m = Math.floor(countdown / 60).toString().padStart(2, "0");
      const s = Math.max(0, countdown % 60).toString().padStart(2, "0");
      DOM.timer.textContent = `${m}:${s}`;
      DOM.timer.classList.toggle("timer-blink", countdown <= 3);
    }

    if (DOM.progress && currentCycleTime > 0) {
      const pct = Math.max(0, (countdown / currentCycleTime) * 100);
      DOM.progress.style.width = `${pct}%`;
      DOM.progress.dataset.level = pct > 40 ? "ok" : pct > 15 ? "warning" : "critical";
    }

    if (countdown <= 0) {
      clearInterval(interval);
      sendImages();
    }
  }, 1000);
}

// ================= DASHBOARD UPDATES =================
function updateDashboard(data) {
  console.log("🔄 Updating UI...");
  currentCycleTime = data.timer || 10;
  
  if (DOM.progress) {
    DOM.progress.style.width = "100%";
    DOM.progress.dataset.level = "ok";
  }

  updateLanes(data);
  updateTimerDots(data);
  updateOverridePanel(data);
  updateEmergencyPanel(data);
  updateChartData(data);
  logCycleStats(data);
}

function updateLanes(data) {
  lanes.forEach((l, i) => {
    const d = DOM.lanes[l];
    if (!d) return;

    const count = data.counts[`Lane ${i + 1}`] || 0;
    const dens = data.density[`Lane ${i + 1}`] || "Low";
    const signal = data.signal_status[`Lane ${i + 1}`] || "Red";
    const hasAmbulance = data.lanes[i]?.ambulance;

    // Card Reset
    d.card?.classList.remove("active-lane", "siren-active", "emergency-lane");
    [d.red, d.yellow, d.green].forEach(light => light?.classList.remove("active"));

    // Info
    if (d.count) {
      d.count.textContent = `${count} vehicles`;
      d.count.dataset.count = count;
    }
    if (d.density) {
      d.density.textContent = dens;
      d.density.style.color = dens === "High" ? "#ff3b3b" : dens === "Medium" ? "#f97316" : "#4ae176";
    }
    if (d.ambulance) {
      d.ambulance.textContent = hasAmbulance ? "DETECTED" : "CLEAR";
      d.ambulance.style.color = hasAmbulance ? "#ff3b3b" : "#4ae176";
    }
    if (d.img && data.lanes[i]?.image) {
      d.img.src = `data:image/jpeg;base64,${data.lanes[i].image}`;
    }

    // Signals
    if (signal === "Green") {
      d.card?.classList.add("active-lane");
      d.green?.classList.add("active");
    } else {
      d.red?.classList.add("active");
    }
  });
}

function updateTimerDots(data) {
  const activeLane = data.selected_lane || null;
  const activeSignal = activeLane ? (data.signal_status[activeLane] || "Red") : "Red";

  [DOM.timerDotRed, DOM.timerDotYellow, DOM.timerDotGreen].forEach(d => d?.classList.remove("active"));

  if (activeSignal === "Green") {
    DOM.timerDotGreen?.classList.add("active");
    if (DOM.timer) {
      DOM.timer.style.color = "#4ae176";
      DOM.timer.style.textShadow = "0 0 20px rgba(74,225,118,0.6)";
    }
  } else if (activeSignal === "Yellow") {
    DOM.timerDotYellow?.classList.add("active");
    if (DOM.timer) {
      DOM.timer.style.color = "#ffff00";
      DOM.timer.style.textShadow = "0 0 20px rgba(255,255,0,0.6)";
    }
  } else {
    DOM.timerDotRed?.classList.add("active");
    if (DOM.timer) {
      DOM.timer.style.color = "#ff3b3b";
      DOM.timer.style.textShadow = "0 0 20px rgba(255,59,59,0.6)";
    }
  }

  if (DOM.timerLaneLabel) {
    DOM.timerLaneLabel.textContent = activeLane ? `Active: ${activeLane} — ${activeSignal}` : "Awaiting signal...";
  }
}

function updateOverridePanel(data) {
  if (data.manual_override) {
    if (DOM.aiReason) DOM.aiReason.textContent = "🚨 PRIORITY OVERRIDE ACTIVE";
    if (DOM.aiLane) DOM.aiLane.textContent = `Lane ${data.override_lane + 1}`;
    
    if (DOM.armedDot) DOM.armedDot.className = "w-3 h-3 rounded-full bg-red-signal glow-red-signal animate-pulse transition-colors duration-300";
    if (DOM.armedText) {
      DOM.armedText.textContent = "OVERRIDE ACTIVE";
      DOM.armedText.classList.replace("text-on-surface", "text-red-signal");
    }
  } else if (data.emergency_detected) {
    if (DOM.aiLane) DOM.aiLane.textContent = data.emergency_lane || "--";
    if (DOM.aiReason) {
      DOM.aiReason.innerHTML = `
        <span class="text-red-signal block animate-pulse mb-1 tracking-wider">🚨 AMBULANCE DETECTED</span>
        <span class="text-secondary block text-sm font-bold tracking-wide">✓ Green Corridor Activated</span>
        <span class="text-secondary block text-sm font-bold tracking-wide">✓ Traffic Cleared</span>
        <span class="text-secondary block text-sm font-bold tracking-wide">✓ Emergency Priority Routing</span>
      `;
    }
    
    if (DOM.armedDot) DOM.armedDot.className = "w-3 h-3 rounded-full bg-red-signal glow-red-signal animate-pulse transition-colors duration-300";
    if (DOM.armedText) {
      DOM.armedText.textContent = "EMERGENCY ROUTING";
      DOM.armedText.classList.replace("text-on-surface", "text-red-signal");
    }
  } else {
    if (DOM.aiLane) DOM.aiLane.textContent = data.selected_lane || "--";
    if (DOM.aiReason) DOM.aiReason.textContent = data.reason || "--";
    
    if (DOM.armedDot) DOM.armedDot.className = "w-3 h-3 rounded-full bg-secondary glow-green-signal animate-pulse transition-colors duration-300";
    if (DOM.armedText) {
      DOM.armedText.textContent = "System Armed";
      DOM.armedText.classList.replace("text-red-signal", "text-on-surface");
    }
  }
}

function updateEmergencyPanel(data) {
  if (data.emergency_detected) {
    document.body.classList.add("emergency-active");
    if (DOM.emergencyPhaseLabel) DOM.emergencyPhaseLabel.style.opacity = "1";

    if (DOM.emStatus) {
      DOM.emStatus.textContent = `🚑 ${data.emergency_lane}`;
      DOM.emStatus.className = "px-sm py-xs rounded font-bold border border-glass transition-colors duration-300 text-white bg-red-signal animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.5)]";
    }
    if (DOM.emPanel) {
      DOM.emPanel.className = "mt-md p-sm rounded flex items-center justify-between z-10 transition-colors duration-500 bg-bg-emergency border border-red-signal";
    }
    if (DOM.gcBtn) {
      DOM.gcBtn.classList.add("animate-pulse", "shadow-[0_0_20px_rgba(74,225,118,0.5)]");
    }

    const idx = parseInt(data.emergency_lane.split(" ")[1]) - 1;
    DOM.lanes[lanes[idx]]?.card?.classList.add("siren-active", "emergency-lane");

    if (DOM.siren) {
      DOM.siren.currentTime = 0;
      DOM.siren.play().catch(() => console.log("Siren blocked"));
    }
  } else {
    document.body.classList.remove("emergency-active");
    if (DOM.emergencyPhaseLabel) DOM.emergencyPhaseLabel.style.opacity = "0";

    if (DOM.emStatus) {
      DOM.emStatus.textContent = "INACTIVE";
      DOM.emStatus.className = "px-sm py-xs rounded font-bold border border-glass transition-colors duration-300 text-outline-variant bg-surface-dim";
    }
    if (DOM.emPanel) {
      DOM.emPanel.className = "mt-md p-sm rounded flex items-center justify-between z-10 transition-colors duration-500 bg-surface-container-low border border-outline-variant";
    }
    if (DOM.gcBtn) {
      DOM.gcBtn.classList.remove("animate-pulse", "shadow-[0_0_20px_rgba(74,225,118,0.5)]");
    }

    if (DOM.siren) {
      DOM.siren.pause();
      DOM.siren.currentTime = 0;
    }
  }
}

function updateChartData(data) {
  if (chart) {
    chart.data.datasets[0].data = lanes.map((_, i) => data.counts[`Lane ${i + 1}`] || 0);
    chart.update();
  }
}

function logCycleStats(data) {
  cycleNumber++;
  if (data.emergency_detected) {
    addLog(`🚨 AMBULANCE DETECTED IN ${data.emergency_lane.toUpperCase()}`, "error");
    addLog("🟢 Green corridor activated", "secondary");
    addLog("🟢 Traffic rerouted. Emergency lane prioritized.", "secondary");
    addLog("⚠️ AI override engaged.", "warning");
  } else if (data.manual_override) {
    const laneLabel = data.override_lane !== undefined ? `Lane ${data.override_lane + 1}` : data.selected_lane;
    addLog(`Operator Override Active: ${laneLabel} priority.`, "error");
  } else if (data.reason) {
    addLog(`AI Decision: Priority ${data.selected_lane} active. ${data.reason}.`, "primary");
  }
  
  if (!data.emergency_detected) {
    addLog(`Cycle ${cycleNumber}: ${data.selected_lane} signal phase shifted to Green. Duration ${data.timer}s.`, "variant");
  } else {
    addLog(`Cycle ${cycleNumber}: Emergency phase held for ${data.timer}s.`, "variant");
  }
}

// ================= LIVE WEBCAM AUTO-REFRESH =================
// Automatically refresh Lane 4 (Lane D) every 1 second
// Appends a unique timestamp to prevent the browser from caching the image
setInterval(() => {
  const imgD = document.getElementById("img-D");
  if (imgD) {
    imgD.src = `/static/live_lane.jpg?t=${new Date().getTime()}`;
  }
}, 1000);