import { logger } from "../utils/logger.js";
// import { changeMode, changeStatus } from "../race-control.js";

const socket = io();

socket.on("connect", () => {
    socket.emit("connectToRoom", "race-control");
    document.getElementById(
        "logs"
    ).innerHTML = `<br>Currently in room: race-control`;
});

// socket.on("raceEnded", async () => {
//     logger(`socket.on(raceEnded)`);
//     try {
//         const race = await window.getCurrentRace();
//         raceUpdated(race.id);
//     } catch (err) {
//         console.error(err);
//     }
// });

export const raceUpdated = (raceId) => {
    socket.emit("raceUpdated", raceId);
};

export const startRace = () => {
    socket.emit("startRace");
};

export const endRace = () => {
    socket.emit("raceEnded");
};
