const socket = io();

// client-side
socket.on("connect", () => {
  socket.emit("connectToRoom", "front-desk");
});

socket.on("newRaceStarted", (race) => {
  const { startTime } = race.start_time;
  startCountdown(startTime);
});
