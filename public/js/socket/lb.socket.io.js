import { logger } from "../utils/logger.js";

const socket = io();

socket.on("updateCurrentRace", async (raceId) => {
  logger(`socket.on(updateCurrentRace)`, raceId);

  if (window.loadRaceInfo && typeof window.loadRaceInfo === "function") {
    await window.loadRaceInfo();
  }
});

socket.on("currentTimer", (timer) => {
  logger(`socket.on(currentTimer)`, timer);

  if (
    window.updateTimerValue &&
    typeof window.updateTimerValue === "function"
  ) {
    window.updateTimerValue(timer);
  }
});

socket.on("updateLeaderBoard", async (raceId) => {
  window.getLeaderboardById(raceId);
});

socket.on("connect", () => {
  socket.emit("connectToRoom", "leader-board");
  logger("socket.emit", "connectToRoom(leader-board)");
});
