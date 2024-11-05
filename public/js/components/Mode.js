export function createMode(elementId) {
  const infoItem = document.createElement("div");
  const modeLabel = document.createElement("span");
  const modeValue = document.createElement("span");

  infoItem.className = "info-item";
  modeLabel.className = "label";
  modeLabel.innerHTML = "Mode";
  modeValue.className = "value";
  modeValue.id = elementId;

  infoItem.appendChild(modeLabel);
  infoItem.appendChild(modeValue);
  modeValue.innerHTML = "<div class='skeleton'></div>";

  function updateDisplay(mode) {
    modeValue.innerHTML = mode;
    switch (mode) {
      case "SAFE":
        infoItem.style.border = "2px dashed green";
        break;
      case "HAZARD":
        infoItem.style.border = "2px dashed yellow";
        break;
      case "DANGER":
        infoItem.style.border = "2px dashed red";
        break;
      case "FINISH":
        infoItem.style.border = "2px dashed white";
        break;
      default:
        infoItem.style.border = "2px solid var(--disabled-color)";
    }
  }
  // eslint-disable-next-line no-undef
  const socket = io();
  socket.on("modeUpdate", (mode) => {
    updateDisplay(mode);
  });

  return infoItem;
}
