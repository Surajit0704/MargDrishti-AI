// =========================
// GLOBAL STATE
// =========================

let selectedLane = null;


// =========================
// ELEMENTS
// =========================

const laneCards = document.querySelectorAll(".lane-card");

const activateBtn = document.getElementById("activateBtn");
const disableBtn = document.getElementById("disableBtn");

const systemStatus = document.getElementById("systemStatus");
const overrideAlert = document.getElementById("overrideAlert");

const logsContainer = document.getElementById("logsContainer");

const reasonDropdown = document.getElementById("overrideReason");


// =========================
// LANE SELECTION
// =========================

laneCards.forEach(card => {

    card.addEventListener("click", () => {

        laneCards.forEach(c => c.classList.remove("active"));

        card.classList.add("active");

        selectedLane = parseInt(card.dataset.lane);

        addLog(`Lane ${selectedLane + 1} selected`);
    });

});


// =========================
// ACTIVATE OVERRIDE
// =========================

activateBtn.addEventListener("click", async () => {

    if (selectedLane === null) {
        alert("Please select a lane first.");
        return;
    }

    const reason = reasonDropdown.value;

    try {

        const response = await fetch("/activate_override", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                lane: selectedLane,
                reason: reason
            })

        });

        const data = await response.json();

        if (data.success) {

            activateLaneUI(selectedLane);

            systemStatus.innerHTML =
                `🔴 PRIORITY OVERRIDE ACTIVE - Lane ${selectedLane + 1}`;

            systemStatus.style.borderColor = "#ff3b3b";
            systemStatus.style.color = "#ff3b3b";

            overrideAlert.classList.remove("hidden");

            addLog(
                `Priority Override Activated → Lane ${selectedLane + 1} (${reason})`
            );
        }

    } catch (error) {

        console.error(error);

        addLog("Error activating override.");

    }

});


// =========================
// DISABLE OVERRIDE
// =========================

disableBtn.addEventListener("click", async () => {

    try {

        const response = await fetch("/disable_override", {

            method: "POST"

        });

        const data = await response.json();

        if (data.success) {

            resetSignals();

            systemStatus.innerHTML =
                "🟢 AI AUTOMATIC MODE ACTIVE";

            systemStatus.style.borderColor = "#00ff99";
            systemStatus.style.color = "#00ff99";

            overrideAlert.classList.add("hidden");

            addLog("Priority Override Disabled");

        }

    } catch (error) {

        console.error(error);

        addLog("Error disabling override.");

    }

});


// =========================
// ACTIVATE SIGNAL UI
// =========================

function activateLaneUI(activeLane) {

    for (let i = 0; i < 3; i++) {

        const signal = document.getElementById(`signal${i}`);

        const status = document.getElementById(`laneStatus${i}`);

        if (i === activeLane) {

            signal.classList.remove("red");
            signal.classList.add("green");

            status.innerText = "GREEN";

        } else {

            signal.classList.remove("green");
            signal.classList.add("red");

            status.innerText = "RED";

        }

    }

}


// =========================
// RESET SIGNALS
// =========================

function resetSignals() {

    for (let i = 0; i < 3; i++) {

        const signal = document.getElementById(`signal${i}`);

        const status = document.getElementById(`laneStatus${i}`);

        signal.classList.remove("green");
        signal.classList.add("red");

        status.innerText = "RED";

    }

}


// =========================
// COMMAND LOGS
// =========================

function addLog(message) {

    const log = document.createElement("div");

    log.classList.add("log-entry");

    const time = new Date().toLocaleTimeString();

    log.innerHTML = `[${time}] ${message}`;

    logsContainer.prepend(log);

}