import { logger } from "../utils/logger.js";

const socket = io();

socket.on("updateCurrentRace", async (raceId) => {
  logger(`socket.on(updateCurrentRace)`, raceId);
  const race = await window.getCurrentRace();

  if (window.loadFlag && typeof window.loadFlag === "function") {
    window.loadFlag(race.mode);
  }
});
