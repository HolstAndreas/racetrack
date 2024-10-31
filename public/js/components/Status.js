export function createStatus(elementId) {
    const infoItem = document.createElement("div");
    const statusLabel = document.createElement("span");
    const statusValue = document.createElement("span");

    infoItem.className = "info-item";
    statusLabel.className = "label";
    statusLabel.innerHTML = "Status";
    statusValue.className = "value";
    statusValue.id = elementId;

    infoItem.appendChild(statusLabel);
    infoItem.appendChild(statusValue);
    statusValue.innerHTML = "<div class='skeleton'></div>";

    function updateDisplay(status) {
        statusValue.innerHTML = status;
    }

    const socket = io();
    socket.on("raceUpdate", (raceData) => {
        // console.log(
        //     `%c Status.js %c raceUpdate ${raceData}`,
        //     "background: #222; color: #bada55;",
        //     "background: transparent; color: auto;"
        // );
        updateDisplay(raceData[0].status);
    });

    return infoItem;
}
