import raceStore from "./store/race-store.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  disableButtons();
});

const changeStatus = async (status) => {
  try {
    const result = await fetch(
      `/api/race-sessions/${raceStore.data.currentRace.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );
    const data = await handleResponse(result);
    if (data.status !== "success") {
      Toastify({
        text: `Unable to change status: ${data.message}`,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "left",
        className: "error",
        stopOnFocus: true,
      }).showToast();
    }

    if (status === "STARTED") {
      await changeMode("SAFE");
    }

    disableButtons();
  } catch (error) {
    Toastify({
      text: `Something went wrong: ${error.message}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      className: "error",
      stopOnFocus: true,
    }).showToast();
  }
};

const changeMode = async (mode) => {
  try {
    const result = await fetch(
      `/api/race-sessions/${raceStore.data.currentRace.id}/mode`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: mode,
        }),
      }
    );
    const data = await handleResponse(result);
    if (data.status !== "success") {
      Toastify({
        text: `Unable to change mode: ${data.message}`,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "left",
        className: "error",
        stopOnFocus: true,
      }).showToast();
    }

    disableButtons();
  } catch (error) {
    Toastify({
      text: `Something went wrong: ${error.message}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      className: "error",
      stopOnFocus: true,
    }).showToast();
  }
};

export const disableButtons = () => {
  const startRaceButton = document.getElementById("startBtn");
  const endRaceButton = document.getElementById("finishBtn");

  const modeControl = document.getElementById("ctrlButtonDiv");
  const race = raceStore.data.currentRace;

  if (race.status === "STARTED" && raceStore.data.mode !== "FINISH") {
    modeControl.disabled = false;
  } else {
    modeControl.disabled = true;
  }

  if (race.status === "WAITING") {
    startRaceButton.disabled = false;
  } else {
    startRaceButton.disabled = true;
  }

  if (raceStore.data.mode === "FINISH" && race.status === "STARTED") {
    endRaceButton.disabled = false;
  } else {
    endRaceButton.disabled = true;
  }

  const isUpcoming = document.getElementById("isUpcoming");
  if (raceStore.data.currentRace.id === "NONE") {
    isUpcoming.style.display = "block";
  } else {
    isUpcoming.style.display = "none";
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
