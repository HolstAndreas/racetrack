import { logger } from "../utils/logger.js";

const socket = io();

socket.on("updateCurrentRace", async (raceId) => {
    logger(`socket.on(updateCurrentRace)`, raceId);

    if (window.loadRaceInfo && typeof window.loadRaceInfo === "function") {
        await window.loadRaceInfo();
    }
});

socket.on("connect", () => {
    socket.emit("connectToRoom", "lap-line-tracker");
    document.getElementById(
        "logs"
    ).innerHTML = `<br>Currently in room: lap-line-tracker`;
    logger("socket.emit", "connectToRoom(lap-line-tracker)");
});

window.registerLapTime = (driver) => {
    // get current time
    let timestamp = new Date().toISOString();
    socket.emit("registerLapTime", {
        driverId: driver,
        currentTimestamp: timestamp,
    });
    logger(`socket.emit(registerLapTime)`, driver, timestamp);
};
