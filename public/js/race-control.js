import { startedRace, changeStatus } from "./socket/rc.socket.io.js";

document.addEventListener("DOMContentLoaded", async (event) => {
  // Add event listeners to buttons
  document
    .getElementById("waitingBtn")
    .addEventListener("click", () => changeStatus("waiting"));
  document.getElementById("startBtn").addEventListener("click", () => {
    startCurrentRace();
  });
  document
    .getElementById("finishBtn")
    .addEventListener("click", () => changeStatus("finished"));

  // Add event listeners for mode buttons too
  document
    .getElementById("safeButton")
    .addEventListener("click", () => changeMode("safe"));
  document
    .getElementById("hazardButton")
    .addEventListener("click", () => changeMode("hazard"));
  document
    .getElementById("dangerButton")
    .addEventListener("click", () => changeMode("danger"));
  document
    .getElementById("finishButton")
    .addEventListener("click", () => changeMode("finish"));

  const race = await getCurrentRace();
  updateRaceInfo(race);
});

const getCurrentRace = async () => {
  const response = await fetch(`/api/currentrace`);
  const data = await handleResponse(response);
  if (data.status === "success") {
    return data.data[0];
  } else {
    alert(data.message);
  }
};

const updateRaceInfo = async (race) => {
  document.getElementById("currentMode").innerText = race.mode.toUpperCase();
  document.getElementById("currentStatus").innerText = race.status.toUpperCase();
};

const startCurrentRace = async () => {
  console.log("Race-control.js: Starting of the event registered");
  try {
    const response = await fetch(`/api/start-current-race/${race_id}`);
    const updatedRace = await handleResponse(response);
    if (updatedRace) {
      startedRace(updatedRace);
    }
  } catch (error) {
    console.error("Error starting race:", error);
  }
};

// Utility functions
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;

  try {
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error("Failed to parse response");
  }

  if (!response.ok) {
    throw new Error(
      data.message || data || `HTTP error! status: ${response.status}`
    );
  }

  return data;
};
