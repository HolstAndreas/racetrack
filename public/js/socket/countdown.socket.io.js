import { logger } from "../utils/logger.js";

const socket = io();

socket.on("updateCurrentRace", async (raceId) => {
  logger(`socket.on(updateCurrentRace)`, raceId);
  const race = await window.getCurrentRace();

  if (race.status === "STARTED" && race.mode !== "FINISH") {
    if (window.startCountdown && typeof window.startCountdown === "function") {
      window.startCountdown(race.start_time);
    }
  } else if (race.mode === "FINISH") {
    if (window.stopCountdown && typeof window.stopCountdown === "function") {
      window.stopCountdown();
    }
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
