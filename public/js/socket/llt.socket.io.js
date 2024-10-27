import { logger } from "../utils/logger.js";

const socket = io();

socket.on("raceStarted", (start_time) => {
  startARace(start_time);
  logger("socket.on", start_time);
});

// client-side
socket.on("connect", () => {
  socket.emit("connectToRoom", "lap-line-tracker");
  document.getElementById(
    "logs"
  ).innerHTML = `<br>Currently in room: lap-line-tracker`;
  logger("socket.emit", "connectToRoom(lap-line-tracker)");
});

const registerLapTime = (driver) => {
  // socket.emit("registerLapTime", driver);
};
