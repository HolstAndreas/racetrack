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
      const raceId = document.getElementById("raceId");
      if (raceId.classList.contains("next")) {
        raceId.innerHTML = this.upcoming[0].id;
      } else {
        raceId.innerHTML = this.data.currentRace.id;
      }
      const raceStatus = document.getElementById("raceStatus");
      raceStatus.innerHTML = this.data.currentRace.status;
      // const elements = {
      //   id: document.getElementById("raceId"),
      //   status: document.getElementById("raceStatus"),
      //   //driverTable: document.getElementById("drivers-in-current"),
      // };
      // Object.entries(elements).forEach(([key, element]) => {
      //   if (element) {
      //     if (this.data.currentRace[key] !== undefined) {
      //       element.textContent = this.data.currentRace[key];
      //     } else {
      //       element.innerHTML = `<div class="skeleton"></div>`;
      //     }
      //   }
      // });
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
  updateDriversTableUI: function () {
    const driversTable = document.getElementById("drivers-table");
    let drivers;
    if (!driversTable) return;
    if (driversTable.classList.contains("next")) {
      drivers = this.upcoming[0].drivers;
    } else {
      drivers = this.data.currentRace.drivers;
    }
    for (let index = 0; index < 8; index++) {
      const row = document.getElementById(`driver-row-${index}`);
      if (!row) return;
      const driver = drivers[index];
      // console.log("driver: ", driver);
      // console.log("driver.length:", drivers.length);
      if (index < drivers.length) {
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
  },

  updateUpcomingRacesUI: function () {
    const raceList = document.getElementById("race-list");
    raceList.innerHTML = "";

    if (this.upcoming.length === 0)
      return (raceList.innerHTML = "<li>No upcoming races available.</li>");

    this.upcoming.forEach((race) => {
      console.log(race);
      const listItem = document.createElement("li");
      listItem.className = "upcoming-race";
      const listItemId = document.createElement("div");
      listItemId.className = "upcoming-race-id";
      listItemId.innerHTML = race.id;
      listItem.append(listItemId);

      const listItemDrivers = document.createElement("div");
      listItemDrivers.className = "race-drivers-grid";

      for (let i = 0; i < 8; i++) {
        const driverSlot = document.createElement("div");
        driverSlot.className = "driver-slot";

        if (i < race.drivers.length) {
          console.log(`DriverSlot, ID: ${race.drivers[i].id}`);
          console.log(`DriverSlot, car: ${race.drivers[i].car}`);
          console.log(`DriverSlot, name: ${race.drivers[i].name}`);
          try {
            driverSlot.innerHTML = `<i title="ID: ${
              race.drivers[i].id
            }" class="fa-solid fa-car ${
              !race.drivers[i].car ? "car-icon" : ""
            }"></i> <strong>${race.drivers[i].car || ""}</strong> ${
              race.drivers[i].name
            }`;
          } catch (error) {
            driverSlot.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #FFD43B;"></i>`;
          }
        } else {
          driverSlot.innerHTML = "";
        }
        listItemDrivers.append(driverSlot);
      }
      const raceActions = document.createElement("div");
      raceActions.className = "race-actions";
      raceActions.innerHTML = `
                  <i onclick="addDriverToRace(${race.id})" class="fa-solid fa-user-plus btn" title="Add Driver"></i>
                  <i onclick="deleteRace(${race.id})" class="fa-solid fa-trash btn" title="Delete Race"></i>
              `;

      listItem.append(listItemDrivers);
      listItem.append(raceActions);
      raceList.append(listItem);
    });
    if (document.getElementById("race-list")) {
      import("../components/UpcomingRaces.js").then((module) =>
        module.addFunctionality()
      );
    }
  },

  updateSelectedRaceUI: function (raceId) {
    const raceIndex = this.upcoming.findIndex((race) => race.id === raceId);
    const race = upcoming[raceIndex];

    const driversList = document.getElementById("drivers-list");
    driversList.innerHTML = "";

    race.drivers.forEach((driver) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="driver-info" id="driver${driver.id}">
        <span class="driver-name">
          <b>Name:</b> ${driver.name}
        </span>
          <span><b>ID:</b> ${driver.id}</span>
          <span class="driver-car">
            <b>Car:</b> ${driver.car || "No Car"}
          </span>
          <div class="driver-actions">
              <button onclick="removeDriverFromRace(${
                driver.id
              }, ${raceId})" class="btn">Remove from Race</button>
              <button onclick="deleteDriver(${
                driver.id
              })" class="btn">Delete Driver</button>
          </div>
      </div>`;
      driversList.appendChild(li);
    });
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
  raceStore.updateDriversTableUI();
  raceStore.updateUpcomingRacesUI();
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
