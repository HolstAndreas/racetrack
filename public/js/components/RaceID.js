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

    const socket = io();
    socket.on("raceUpdate", (raceData) => {
        // console.log(
        //     `%c RaceID.js %c raceUpdate ${raceData}`,
        //     "background: #222; color: #bada55;",
        //     "background: transparent; color: auto;"
        // );
        updateDisplay(raceData[0].id);
    });

    return infoItem;
}
