// import { loadCurrentRace } from ".././front-desk.js";

const socket = io();

socket.on("connect", () => {
  socket.emit("connectToRoom", "front-desk");
});

socket.on("newRaceStarted", (race) => {
  const { startTime } = race.start_time;
  startCountdown(startTime);
});

socket.on("updateCurrentRace", (raceId) => {
  loadCurrentRace();
});
