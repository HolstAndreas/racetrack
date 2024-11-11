const raceStore = {
  data: {
    currentRace: {
      id: "NONE",
      status: "NONE",
      drivers: [],
      lap_times: [],
    },
    timer: 0,
    mode: "DANGER",
  },
  isRaceControl: window.location.pathname === "/race-control",
  upcoming: [
    {
      id: "NONE",
      drivers: [
        {
          id: 0,
          name: "",
          car: "",
        },
      ],
    },
  ],
  pastRace: {
    id: "NONE",
    drivers: [],
    status: "NONE",
    lap_times: [],
  },
  updateUI: function () {
    const showLastRace =
      this.data.currentRace.status === "WAITING" ||
      this.data.currentRace.status === "NONE";
    if (this.data.currentRace) {
      const raceId = document.getElementById("raceId");
      if (raceId.classList.contains("next")) {
        if (this.upcoming[0]) {
          raceId.innerHTML = `NEXT RACE: ${this.upcoming[0].id}`;
        } else {
          raceId.innerHTML = `NEXT RACE: NONE`;
        }
      } else {
        if (!raceStore.isRaceControl) {
          raceId.innerHTML = showLastRace
            ? this.pastRace.id
            : this.data.currentRace.id;
        } else {
          raceId.innerHTML = this.data.currentRace.id;
        }
      }
      const raceStatus = document.getElementById("raceStatus");
      if (raceStatus) {
        if (!raceStore.isRaceControl) {
          raceStatus.innerHTML = showLastRace
            ? this.pastRace.status
            : this.data.currentRace.status;
        } else {
          raceStatus.innerHTML = this.data.currentRace.status;
        }
      }
    }
    if (this.data.currentRace.status) {
      const paddockDiv = document.getElementById("paddock");
      if (paddockDiv) {
        if (this.data.currentRace.status === "WAITING") {
          paddockDiv.innerHTML = "Proceed to the paddock!";
          //console.log("We are here");
        } else {
          paddockDiv.innerHTML = "";
          //console.log("We are NOT here");
        }
      }
    }
    if (document.getElementById("ctrlButtonDiv")) {
      import("../race-control.js").then((module) => module.disableButtons());
    }
  },
  updateModeUI: function () {
    const modeElement = document.getElementById("raceMode");
    const flagElement = document.getElementById("flag");
    if (modeElement) {
      modeElement.textContent = this.data.mode;
    }
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
    //race-control
    if (document.getElementById("ctrlButtonDiv")) {
      import("../race-control.js").then((module) => module.disableButtons());
    }
    //disable llt buttons
    if (document.getElementById("buttonsDiv")) {
      import("../lap-line-tracker.js").then((module) => {
        const showLastRace =
          this.data.currentRace.status === "WAITING" ||
          this.data.currentRace.status === "NONE";
        module.updateRaceInfo(
          showLastRace ? this.pastRace : this.data.currentRace
        );
      });
    }
  },
  updateDriversTableUI: function () {
    const driversTable = document.getElementById("drivers-table");
    const showLastRace =
      this.data.currentRace.status === "WAITING" ||
      this.data.currentRace.status === "NONE";
    let drivers;
    if (!driversTable) return;
    if (driversTable.classList.contains("next")) {
      console.log("Drivers table has 'next' class");
      if (!this.upcoming[0]) {
        console.log("No upcoming races found");
        drivers = [];
      } else {
        console.log("Using drivers from upcoming race:", this.upcoming[0].drivers);
        drivers = this.upcoming[0].drivers;
      }
    } else {
      console.log("Drivers table does not have 'next' class");
      if (!raceStore.isRaceControl) {
        console.log("Not race control view");
        console.log("showLastRace:", showLastRace);
        drivers = showLastRace
          ? this.pastRace.drivers
          : this.data.currentRace.drivers;
        console.log("Selected drivers:", drivers);
      } else {
        console.log("Race control view");
        if (
          this.data.currentRace.status === "WAITING" ||
          this.data.currentRace.status === "NONE"
        ) {
          console.log("Current race status:", this.data.currentRace.status);
          if(this.upcoming.length > 0) {
            if (this.upcoming[0].drivers.length < 1) {
              console.log("No drivers in upcoming race");
              drivers = [];
            } else {
              console.log("Using drivers from upcoming race:", this.upcoming[0].drivers);
              drivers = this.upcoming[0].drivers;
            }
          }

        } else {
          console.log("Using current race drivers:", this.data.currentRace.drivers);
          drivers = this.data.currentRace.drivers;
        }
      }
    }
    for (let index = 0; index < 8; index++) {
      const row = document.getElementById(`driver-row-${index}`);
      if (!row) return;
      if (drivers.length < 1) return;
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
      import("../lap-line-tracker.js").then((module) => {
        const showLastRace =
          this.data.currentRace.status === "WAITING" ||
          this.data.currentRace.status === "NONE";
        module.updateRaceInfo(
          showLastRace ? this.pastRace : this.data.currentRace
        );
      });
    }
  },

  updateLeaderBoardUI: function () {
    if (document.getElementById("leaderboard")) {
      import("../guest.js").then((module) => {
        const showLastRace =
          this.data.currentRace.status === "WAITING" ||
          this.data.currentRace.status === "NONE";
        module.updateLeaderBoard(
          showLastRace ? this.pastRace : this.data.currentRace
        );
      });
    }
  },
};

// Listen for updates from server
// eslint-disable-next-line no-undef
const socket = io();

socket.on("raceUpdate", (newRaceData) => {
  if (newRaceData.length > 0) {
    raceStore.data.currentRace = {
      ...raceStore.data.currentRace,
      ...newRaceData[0],
    };
    raceStore.updateUI();
    raceStore.updateLapLineTrackerUI();
    raceStore.updateLeaderBoardUI();
  } else {
    if (raceStore.data.currentRace.id !== "NONE") {
      raceStore.data.currentRace.status = "FINISHED";
      raceStore.updateLapLineTrackerUI();
      raceStore.pastRace = { ...raceStore.data.currentRace };
    }
    raceStore.data.currentRace = {
      id: "NONE",
      status: "NONE",
      timer: 0,
      lap_times: [],
      drivers: [],
    };
  }
});

socket.on("lastRaceUpdate", (lastRaceData) => {
  raceStore.pastRace = {
    ...raceStore.pastRace,
    ...lastRaceData,
  };
  raceStore.updateUI();
  raceStore.updateLapLineTrackerUI();
  raceStore.updateLeaderBoardUI();
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

socket.on("driversUpdate", () => {
  if (document.getElementById("driver-select")) {
    import("../front-desk.js").then((module) => {
      module.populateDriverSelect();
    });
  }
});

export default raceStore;
