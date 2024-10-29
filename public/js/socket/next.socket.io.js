import { logger } from "../utils/logger.js";

const socket = io();

socket.on("updateCurrentRace", async (raceId) => {
  logger(`socket.on(updateCurrentRace)`, raceId);

  if (window.loadNextRace && typeof window.loadNextRace === "function") {
    await window.loadNextRace();
  }
});
