export function createRaceID(elementId) {
  const infoItem = document.createElement("div");
  const raceIdLabel = document.createElement("span");
  const raceIdValue = document.createElement("span");

  infoItem.className = "info-item";
  raceIdLabel.className = "label";
  raceIdLabel.innerHTML = "Race ID";
  raceIdValue.className = "value";
  raceIdValue.id = elementId;

  infoItem.appendChild(raceIdLabel);
  infoItem.appendChild(raceIdValue);
  raceIdValue.innerHTML = "<div class='skeleton'></div>";

  function updateDisplay(raceId) {
    raceIdValue.innerHTML = raceId;
  }
  // eslint-disable-next-line no-undef
  const socket = io();
  socket.on("raceUpdate", (raceData) => {
    // updateDisplay(raceData[0].id);
  });

  return infoItem;
}
