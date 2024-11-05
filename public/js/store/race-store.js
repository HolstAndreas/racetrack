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
      lap_times: [],
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
        raceId.innerHTML = `NEXT RACE: ${this.upcoming[0].id}`;
      } else {
        raceId.innerHTML = this.data.currentRace.id;
      }
      const raceStatus = document.getElementById("raceStatus");
      if (raceStatus) {
        raceStatus.innerHTML = this.data.currentRace.status;
      }
    }
    if (this.data.currentRace.status) {
      const paddockDiv = document.getElementById("paddock");
      if (paddockDiv) {
        if (this.data.currentRace.status === "WAITING") {
          paddockDiv.innerHTML = "Proceed to the paddock!";
          console.log("We are here");
        } else {
          paddockDiv.innerHTML = "";
          console.log("We are NOT here");
        }
      } else {
        console.log("paddock not found");
      }
    }
    if (document.getElementById("ctrlButtonDiv")) {
      import("../race-control.js").then((module) => module.disableButtons());
    }
  },
  updateModeUI: function () {
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
    //disable llt buttons
    if (document.getElementById("buttonsDiv")) {
      import("../lap-line-tracker.js").then((module) =>
        module.updateRaceInfo(this.data.currentRace)
      );
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
      if (index < drivers.length) {
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
    if (document.getElementById("race-list")) {
      import("../components/UpcomingRaces.js").then((module) =>
        module.update(this.upcoming)
      );
    }
  },

  updateLapLineTrackerUI: function () {
    if (document.getElementById("buttonsDiv")) {
      import("../lap-line-tracker.js").then((module) =>
        module.updateRaceInfo(this.data.currentRace)
      );
    }
  },

  updateLeaderBoardUI: function () {
    if (document.getElementById("leaderboard")) {
      import("../guest.js").then((module) =>
        module.updateLeaderBoard(this.data.currentRace)
      );
    }
  },
};

// Listen for updates from server
// eslint-disable-next-line no-undef
const socket = io();

socket.on("raceUpdate", (newRaceData) => {
  raceStore.data.currentRace = {
    ...raceStore.data.currentRace,
    ...newRaceData[0],
  };
  raceStore.updateUI();
  raceStore.updateLapLineTrackerUI();
});

socket.on("upcomingRacesUpdate", (upcomingRacesData) => {
  raceStore.upcoming = upcomingRacesData;
  raceStore.updateDriversTableUI();
  raceStore.updateUpcomingRacesUI();
  raceStore.updateUI();
});

socket.on("modeUpdate", (mode) => {
  raceStore.data.mode = mode;
  raceStore.updateModeUI();
});

socket.on("lapUpdate", (laps) => {
  raceStore.data.currentRace.lap_times = laps;
  raceStore.updateLeaderBoardUI();
});

socket.on("timerUpdate", (newTime) => {
  raceStore.data.timer = newTime;
});

export default raceStore;
