import { raceUpdated, TIMER } from "./socket/rc.socket.io.js";

let race = {};

// const fetchTimer = () => {
//   return 3600;
// };

// const TIME = fetchTimer();

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
  document
    .getElementById("reset-race")
    .addEventListener("click", () => resetRace());

  race = await getCurrentRace();
  console.log(race);
});

//temp
const resetRace = async () => {
  try {
    const result = await fetch(`/api/reset-race/${race.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    alert(err);
    return;
  }
  location.reload();
};

const changeStatus = async (status) => {
  race.status = status;
  try {
    const result = await fetch(`/api/race-sessions/${race.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    });
    const data = await handleResponse(result);
    race = data.data;
    if (race.status === "STARTED") {
      await changeMode("SAFE");
    }
    if (status === "FINISHED") {
      await getCurrentRace();
    }
    updateRaceInfo(race);
    raceUpdated(race.id);
  } catch (err) {
    alert(err);
    return;
  }
};

const changeMode = async (mode) => {
  try {
    await fetch(`/api/race-sessions/${race.id}/mode`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: mode,
      }),
    });
    race = await getCurrentRace();
    console.log(race);
    updateRaceInfo(race);
    raceUpdated(race.id);
  } catch (err) {
    alert(err);
  }
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

// const getNextRace = async () => {
//   const response = await fetch(`/api/currentrace`);
//   const data = await handleResponse(response);
//   if (data.status === "success") {
//     updateRaceInfo(data.data[0]);
//     return data.data[0];
//   } else {
//     alert(data.message);
//   }
// };

const updateRaceInfo = (raceData) => {
  race = raceData;
  const raceId = document.getElementById("raceId");
  raceId.innerHTML = raceData.id;
  const drivers = document.getElementById("driver-names");

  Promise.all(
    race.drivers.map(async (driver) => {
      try {
        const result = await fetch(`/api/drivers/${driver}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await handleResponse(result);
        return `<span class="driver-id-box">#${driver}  <i class="fa-solid fa-car ${
          !data.data.car ? `car-icon" title="Missing Car"` : ""
        }"></i> ${data.data.car || ""}</span>`;
      } catch (err) {
        alert(`Driver ${driver} | ${err}`);
        return "";
      }
    })
  ).then((driverSpans) => {
    drivers.innerHTML = driverSpans.join("");
  });

  const currentMode = document.getElementById("currentMode");
  currentMode.innerHTML = raceData.mode;

  const currentStatus = document.getElementById("currentStatus");
  currentStatus.innerHTML = raceData.status;
  disableButtons();

  if (raceData.status === "STARTED" && raceData.mode !== "FINISH") {
    console.log("Starting countdown");
    startCountdown(raceData.start_time);
  } // else {
  //   if (raceData.status === "WAITING") {
  //     const timer = document.getElementById("timer");
  //     const TIME = TIMER;
  //     console.log("TIMER value:", TIME);
  //     const minutes = Math.floor(TIME / 60);
  //     const seconds = TIME % 60;
  //     timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds
  //       .toString()
  //       .padStart(2, "0")}`;
  //   }
  // }
};

const disableButtons = () => {
  console.log(race.mode);
  console.log(race.status);
  const startRaceButton = document.getElementById("startBtn");
  const endRaceButton = document.getElementById("finishBtn");
  const safeButton = document.getElementById("safeButton");
  const hazardButton = document.getElementById("hazardButton");
  const dangerButton = document.getElementById("dangerButton");
  const finishButton = document.getElementById("finishButton");

  if (race.status === "STARTED") {
    safeButton.classList.remove("disabled");
    hazardButton.classList.remove("disabled");
    dangerButton.classList.remove("disabled");
    finishButton.classList.remove("disabled");
    if (!startRaceButton.classList.contains("disabled")) {
      startRaceButton.classList.add("disabled");
    }
  }

  if (race.mode !== "FINISH") {
    if (!endRaceButton.classList.contains("disabled")) {
      endRaceButton.classList.add("disabled");
    }
  }
  if (race.mode === "FINISH") {
    endRaceButton.classList.remove("disabled");
    if (!safeButton.classList.contains("disabled")) {
      safeButton.classList.add("disabled");
    }
    if (!hazardButton.classList.contains("disabled")) {
      hazardButton.classList.add("disabled");
    }
    if (!dangerButton.classList.contains("disabled")) {
      dangerButton.classList.add("disabled");
    }
    if (!finishButton.classList.contains("disabled")) {
      finishButton.classList.add("disabled");
    }
  }

  if (race.status !== "STARTED") {
    if (!safeButton.classList.contains("disabled")) {
      safeButton.classList.add("disabled");
    }
    if (!hazardButton.classList.contains("disabled")) {
      hazardButton.classList.add("disabled");
    }
    if (!dangerButton.classList.contains("disabled")) {
      dangerButton.classList.add("disabled");
    }
    if (!finishButton.classList.contains("disabled")) {
      finishButton.classList.add("disabled");
    }
  }
};

const startCountdown = (startTime) => {
  const endTime = Date.parse(startTime) + TIMER * 1000;
  const countdownElement = document.getElementById("timer");

  const interval = setInterval(() => {
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.innerHTML = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (race.mode === "FINISH") {
      clearInterval(interval);
      countdownElement.innerHTML = "00:00";
    } else if (timeLeft <= 0) {
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
