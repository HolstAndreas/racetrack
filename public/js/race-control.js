import { raceUpdated } from "./socket/rc.socket.io.js";

let race;

document.addEventListener("DOMContentLoaded", async (event) => {
  // Add event listeners to buttons
  document.getElementById("startBtn").addEventListener("click", () => {
    changeStatus("STARTED");
  });
  document
    .getElementById("finishBtn")
    .addEventListener("click", () => changeStatus("FINISHED"));

  // Add event listeners for mode buttons too
  document
    .getElementById("safeButton")
    .addEventListener("click", () => changeMode("SAFE"));
  document
    .getElementById("hazardButton")
    .addEventListener("click", () => changeMode("HAZARD"));
  document
    .getElementById("dangerButton")
    .addEventListener("click", () => changeMode("DANGER"));
  document
    .getElementById("finishButton")
    .addEventListener("click", () => changeMode("FINISH"));

  race = await getCurrentRace();
});

const changeStatus = async (status) => {
  race.status = status;
  await fetch(`/api/race-sessions/${race.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: status,
    }),
  });
  if (race.status === "STARTED") {
    await changeMode("SAFE");
  }
  if (status === "FINISHED") {
    await getCurrentRace();
  }
  //await updateRaceInfo(race);
  raceUpdated(race.id);
};

const changeMode = async (mode) => {
  race.mode = mode;
  await fetch(`/api/race-sessions/${race.id}/mode`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: mode,
    }),
  });
  await updateRaceInfo(race);
  raceUpdated(race.id);
};

const getCurrentRace = async () => {
  const response = await fetch(`/api/currentrace`);
  const data = await handleResponse(response);
  if (data.status === "success") {
    updateRaceInfo(data.data[0]);
    return data.data[0];
  } else {
    alert(data.message);
  }
};

const getNextRace = async () => {
  const response = await fetch(`/api/currentrace`);
  const data = await handleResponse(response);
  if (data.status === "success") {
    updateRaceInfo(data.data[0]);
    return data.data[0];
  } else {
    alert(data.message);
  }
};

const updateRaceInfo = async (race) => {
  const raceId = document.getElementById("raceId");
  raceId.innerHTML = race.id;

  const drivers = document.getElementById("driver-names");
  drivers.innerHTML = race.drivers;

  const currentMode = document.getElementById("currentMode");
  currentMode.innerHTML = race.mode;

  const currentStatus = document.getElementById("currentStatus");
  currentStatus.innerHTML = race.status;

  if (race.status === "STARTED" && race.mode !== "FINISH") {
    console.log("Starting countdown");
    startCountdown(race.start_time);
  }

  const timer = document.getElementById("timer");
  timer.innerHTML = race.remaining_time;
};

// const startCurrentRace = async () => {
//   console.log("Race-control.js: Starting of the event registered");
//   try {
//     const response = await fetch(`/api/start-current-race/${race_id}`);
//     const updatedRace = await handleResponse(response);
//     if (updatedRace) {
//       startedRace(updatedRace);
//       await updateRaceInfo(updatedRace);
//     }
//   } catch (error) {
//     console.error("Error starting race:", error);
//   }
// };

const startCountdown = (startTime) => {
  const endTime = Date.parse(startTime) + 60 * 1000; // 600 asendada global var
  const countdownElement = document.getElementById("timer");

  const interval = setInterval(() => {
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.innerHTML = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      //race.mode = "FINISH";
      changeMode("FINISH");
      countdownElement.innerHTML = "00:00";
    }
  }, 1000);
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
