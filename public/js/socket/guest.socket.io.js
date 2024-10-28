import { logger } from "../utils/logger.js";

const socket = io();

socket.on("raceUpdated", (raceId) => {
  logger(`socket.on(raceUpdated)`, raceId);
  loadCurrentRace();
});
