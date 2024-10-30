import { logger } from "../utils/logger.js";

const socket = io();

export const initializeTimer = (elementId) => {
    socket.on("currentTimer", (timer) => {
        logger(`socket.on(currentTimer)`, timer);
        updateTimerDisplay(elementId, timer);
    });

    socket.on("timerUpdate", (timeLeft) => {
        // logger(`socket.on(timerUpdate)`, timeLeft);
        updateTimerDisplay(elementId, timeLeft);
    });

    return {
        startRace: (raceId) => {
            socket.emit("startRace", { raceId });
        },
    };
};

const updateTimerDisplay = (elementId, timeValue) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const minutes = Math.floor(timeValue / 60);
    const seconds = timeValue % 60;
    element.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};
