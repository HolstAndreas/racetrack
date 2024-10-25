const socket = io();

// client-side
socket.on("connect", () => {
  socket.emit("connectToRoom", "front-desk");
});
