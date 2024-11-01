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
        //driverTable: document.getElementById("drivers-in-current"),
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
      import("../race-control.js").then((module) => module.disableButtons());
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
  updateNextRaceUI: function () {
    const driversTable = document.getElementById("drivers-table");
    if (driversTable) {
      for (let index = 0; index < 8; i++) {
        const row = document.getElementById(`driver-row-${index}`);
        if (!row) return;
        const driver = this.upcoming[0].drivers[index];
        //console.log
        if (index < driver.length) {
          // Clear existing content
          row.innerHTML = "";

          if (!driver.id) return;

          // Create driver number element
          const driverId = document.createElement("span");
          driverId.className = "driver-id";
          driverId.textContent = `#${driver.id}`;

          // Create driver name element
          const driverName = document.createElement("span");
          driverName.textContent = ` ${driver.name} `;

          // Create car element
          const driverCar = document.createElement("span");
          driverCar.className = "driver-car";
          driverCar.innerHTML = `${driver.car || ""} <i class="fa-solid fa-car${
            !driver.car ? " car-icon" : ""
          }"></i>`;

          // Append all elements
          row.appendChild(driverId);
          row.appendChild(driverName);
          row.appendChild(driverCar);
        } else {
          row.innerHTML = "";
        }
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

  raceStore.data.currentRace = {
    ...raceStore.data.currentRace,
    ...newRaceData[0],
  };
  raceStore.updateUI();
});

socket.on("upcomingRacesUpdate", (upcomingRacesData) => {
  raceStore.upcoming = upcomingRacesData;
  console.log(upcomingRacesData);
  raceStore.updateNextRaceUI();
});

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
