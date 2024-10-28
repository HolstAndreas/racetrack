const socket = io();

// client-side
socket.on("connect", () => {
  socket.emit("connectToRoom", "race-control");
  document.getElementById(
    "logs"
  ).innerHTML = `<br>Currently in room: race-control`;
});

// const connectToRoom = () => {
//   const roomNameInput = document.getElementById("room-name");
//   console.log(`Trying to connect to room ${roomNameInput.value}`);
//   socket.emit("connectToRoom", roomNameInput.value);
//   document.getElementById(
//     "logs"
//   ).innerHTML = `Currently in room: ${roomNameInput.value}`;
// };

// socket.on("newUserJoined", (socketId) => {
//   const logsElement = document.getElementById("logs");
//   logsElement.innerHTML += `<br>New user joined: ${socketId}`;
// });

// const changeMode = (mode) => {
//   console.log(`Mode is: ${mode}`);
//   socket.emit("changeMode", mode);
// };

socket.on("updatedRaceMode", (newMode) => {
  const modeElement = document.getElementById("currentMode");
  modeElement.innerHTML = newMode;
});

// export const changeStatus = (status) => {
//   console.log(`Status is: ${status}`);
//   socket.emit("changeStatus", status);
// };

socket.on("updatedRaceStatus", (newStatus) => {
  const statusElement = document.getElementById("currentStatus");
  console.log(`New status is: ${newStatus}`);
  statusElement.innerHTML = newStatus;
});

// export const startedRace = (race) => {
//   console.log(`Race: ${race}`);
//   socket.emit("raceStarted", race);
//   updateRaceInfo(race);
// };

export const raceUpdated = (raceId) => {
  socket.emit("raceUpdated", raceId);
};

//socket.on("updateCurrentRace", (raceId) => {});
