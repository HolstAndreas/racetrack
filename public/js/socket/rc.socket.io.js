import { logger } from "../utils/logger.js";
import { changeMode, changeStatus } from "../race-control.js";

const socket = io();

socket.on("connect", () => {
    socket.emit("connectToRoom", "race-control");
    document.getElementById(
        "logs"
    ).innerHTML = `<br>Currently in room: race-control`;
});

socket.on("updatedRaceMode", (newMode) => {
    logger(`socket.on(updatedRaceMode)`, newMode);
    const modeElement = document.getElementById("currentMode");
    modeElement.innerHTML = newMode;
});

socket.on("updatedRaceStatus", (newStatus) => {
    const statusElement = document.getElementById("currentStatus");
    logger(`socket.on(updatedRaceStatus)`, newStatus);
    statusElement.innerHTML = newStatus;
});

socket.on("raceEnded", async () => {
    logger(`socket.on(raceEnded)`);
    try {
        const race = await window.getCurrentRace();
        await changeMode("FINISH");
        await changeStatus("FINISHED");
        raceUpdated(race.id);
    } catch (err) {
        console.error(err);
    }
});

export const raceUpdated = (raceId) => {
    socket.emit("raceUpdated", raceId);
};

export const startRace = () => {
    socket.emit("startRace");
};

export const endRace = () => {
    socket.emit("raceEnded");
};
