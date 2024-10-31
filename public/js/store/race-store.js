const raceStore = {
    data: {
        currentRace: {
            id: 0,
            mode: "",
            status: "",
        },
        timer: 0,
    },

    updateUI: function () {
        if (this.data.currentRace) {
            const elements = {
                id: document.getElementById("raceId"),
                mode: document.getElementById("raceMode"),
                status: document.getElementById("raceStatus"),
                // driverTable: document.getElementById("driverTable"),
            };

            Object.entries(elements).forEach(([key, element]) => {
                if (element) {
                    if (this.data.currentRace[key] !== undefined) {
                        element.textContent = this.data.currentRace[key];
                    } else {
                        element.innerHTML = `<div class="skeleton"></div>`;
                    }
                }
            });

            // RACE CONTROL BUTTON DISABLING FIX
            // CHECK IF WE ARE ON RACE CONTROL PAGE
            if (document.getElementById("ctrlButtonDiv")) {
                // IDK AUSALT
                import("../race-control.js").then((module) =>
                    module.disableButtons()
                );
            }
        }
    },
};

// Listen for updates from server
const socket = io();

socket.on("raceUpdate", (newRaceData) => {
    // console.log(
    //     `%c raceStore.js %c raceUpdate ${newRaceData[0]}`,
    //     "background: #222; color: #bada55;",
    //     "background: transparent; color: auto;"
    // );

    raceStore.data.currentRace = newRaceData[0];
    raceStore.updateUI();
});

socket.on("timerUpdate", (newTime) => {
    // console.log(
    //     `%c raceStore.js %c timerUpdate ${newTime}`,
    //     "background: #222; color: #bada55;",
    //     "background: transparent; color: auto;"
    // );
    raceStore.data.timer = newTime;
});

export default raceStore;
