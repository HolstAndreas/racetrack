export function createCountdown(elementId) {
  const infoItem = document.createElement("div");
  const countdownLabel = document.createElement("span");
  const countdownValue = document.createElement("span");

  infoItem.className = "info-item";
  countdownLabel.className = "label";
  countdownLabel.innerHTML = "Countdown";
  countdownValue.className = "value";
  countdownValue.id = elementId;

  infoItem.appendChild(countdownLabel);
  infoItem.appendChild(countdownValue);
  countdownValue.innerHTML = "<div class='skeleton'></div>";

  function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownValue.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  // eslint-disable-next-line no-undef
  const socket = io();
  socket.on("timerUpdate", (timeLeft) => {
    updateDisplay(timeLeft);
  });

  return infoItem;
}
