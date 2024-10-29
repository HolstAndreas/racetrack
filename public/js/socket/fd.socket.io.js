import { loadCurrentRace } from ".././front-desk.js";

const socket = io();

export let TIMER;

// client-side
socket.on("connect", () => {
  socket.emit("connectToRoom", "front-desk");
});

socket.on("newRaceStarted", (race) => {
  const { startTime } = race.start_time;
  startCountdown(startTime);
});

socket.on("currentTimer", (timer) => {
  const timerElement = document.getElementById("countdown");
  timerElement.innerHTML = timer;
  TIMER = timer;
});

socket.on("updateCurrentRace", (raceId) => {
  loadCurrentRace();
});
