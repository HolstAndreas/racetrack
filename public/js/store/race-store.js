const raceStore = {
    data: {
        currentRace: {
            id: 0,
            status: "",
            drivers: [
                {
                    id: 0,
                    name: "",
                    car: "",
                },
            ],
        },
        timer: 0,
        mode: "DANGER",
    },
    upcoming: [
        {
            id: 0,
            drivers: [
                {
                    id: 0,
                    name: "",
                    car: "",
                },
            ],
        },
    ],
    updateUI: function () {
        if (this.data.currentRace) {
            const elements = {
                id: document.getElementById("raceId"),
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
        }

        // RACE CONTROL BUTTON DISABLING FIX
        // CHECK IF WE ARE ON RACE CONTROL PAGE
        if (document.getElementById("ctrlButtonDiv")) {
            // IDK AUSALT
            import("../race-control.js").then((module) =>
                module.disableButtons()
            );
        }
    },
    updateModeUI: function () {
        console.log(this.data.mode);
        const modeElement = document.getElementById("raceMode");
        if (modeElement) {
            modeElement.textContent = this.data.mode;
        }
        const flagElement = document.getElementById("flag");
        if (flagElement) {
            switch (this.data.mode) {
                case "SAFE":
                    flagElement.classList.remove("danger", "hazard", "finish");
                    flagElement.classList.add("safe");
                    break;
                case "DANGER":
                    flagElement.classList.remove("safe", "hazard", "finish");
                    flagElement.classList.add("danger");
                    break;
                case "HAZARD":
                    flagElement.classList.remove("danger", "safe", "finish");
                    flagElement.classList.add("hazard");
                    break;
                case "FINISH":
                    flagElement.classList.remove("danger", "hazard", "safe");
                    flagElement.classList.add("finish");
                    break;
            }
        }
    },
};
//   updateNextRaceData: function (index) {
//     if (this.upcoming[index]) {
//       const elements = {
//         id: document.getElementById("raceId"),
//         driverTable: document.getElementById("driverTable"),
//       };
//       Object.entries(elements).forEach(([key, element]) => {
//         if (element) {
//           if (key === "id" && this.upcoming[index].id !== undefined) {
//             element.textContent += this.upcoming[index].id;
//           } else if (key === driverTable && this.upcoming[index].drivers) {
//             element.innerHTML = "";

//             this.upcoming[index].drivers.forEach((driver) => {
//               const driverElement = document.createElement("div");

//               ["id", "name", "car"].forEach((property) => {
//                 const propDiv = document.createElement("div");
//                 propDiv.textContent = driverElement[property] || "";
//                 driverElement.appendChild(propDiv);
//               });

//               element.appendChild(driverElement);
//             });
//           } else {
//             element.innerHTML = `<div class="skeleton"></div>`;
//           }
//         }
//       });
//     }
//   },
// };

// Listen for updates from server
const socket = io();

socket.on("raceUpdate", (newRaceData) => {
    // console.log(
    //     `%c raceStore.js %c raceUpdate ${newRaceData[0]}`,
    //     "background: #222; color: #bada55;",
    //     "background: transparent; color: auto;"
    // );
    // raceStore.data.currentRace = newRaceData[0];
    raceStore.data.currentRace = {
        ...raceStore.data.currentRace,
        ...newRaceData[0],
    };
    raceStore.updateUI();
});

// socket.on("upcomingRacesUpdate", (upcomingRacesData) => {
//     raceStore.upcoming = upcomingRacesData[0];
//     raceStore.updateNextRaceData();
// });

socket.on("modeUpdate", (mode) => {
    raceStore.data.mode = mode;
    // Update UI components that depend on mode
    raceStore.updateModeUI();
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
