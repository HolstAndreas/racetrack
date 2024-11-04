// export function createUpcomingRaces(elementId) {
//   const upcomingRacesDiv = document.createElement("div");
//   const sectionTitle = document.createElement("h2");
//   const upcomingRacesList = document.createElement("ol");

//   upcomingRacesDiv.classList.add("upcoming-races-section");
//   sectionTitle.innerHTML = "Upcoming Races";
//   upcomingRacesList.id = elementId;

//   upcomingRacesDiv.append(sectionTitle);

//   for (let i = 0; i < 3; i++) {
//     const listItem = document.createElement("li");
//     const listItemId = document.createElement("div");
//     listItemId.className = "upcoming-race-id";
//     listItemId.innerHTML = "<div class='skeleton'></div>";
//     listItem.append(listItemId);

//     const listItemDrivers = document.createElement("div");
//     listItemDrivers.className = "race-drivers-grid";
//     listItemDrivers.innerHTML = "<div class='skeleton'></div>";
//     listItem.append(listItemDrivers);
//     upcomingRacesList.append(listItem);
//   }

//   upcomingRacesDiv.append(upcomingRacesList);

//   return upcomingRacesDiv;
// }

// export function addFunctionality() {
//   const allUpcomingRaces = document.querySelectorAll(".upcoming-race");
//   allUpcomingRaces.forEach((listItem) => {
//     listItem.addEventListener("click", (event) => {
//       const raceEventTarget = event.target.closest("li");
//       if (raceEventTarget.classList.contains("highlight")) {
//         raceEventTarget.classList.remove("highlight");
//         document.getElementById("drivers-list").innerHTML = "";
//       } else {
//         document.querySelectorAll("#race-list li.highlight").forEach((item) => {
//           item.classList.remove("highlight");
//         });
//         raceEventTarget.classList.add("highlight");
//         const raceIdDiv = raceEventTarget.querySelector(".upcoming-race-id");
//         const raceId = raceIdDiv.textContent;
//         console.log(raceId);
//         updateSelectedRaceUI(raceId);
//       }
//     });
//   });
// }

// export function addRaces(races) {
//   const raceList = document.getElementById("race-list");
//   raceList.innerHTML = "";

//   if (races.length === 0)
//     return (raceList.innerHTML = "<li>No upcoming races available.</li>");

//   races.forEach((race) => {
//     console.log(race);
//     const listItem = document.createElement("li");
//     listItem.className = "upcoming-race";
//     const listItemId = document.createElement("div");
//     listItemId.className = "upcoming-race-id";
//     listItemId.innerHTML = race.id;
//     listItem.append(listItemId);

//     const listItemDrivers = document.createElement("div");
//     listItemDrivers.className = "race-drivers-grid";

//     for (let i = 0; i < 8; i++) {
//       const driverSlot = document.createElement("div");
//       driverSlot.className = "driver-slot";

//       if (i < race.drivers.length) {
//         console.log(`DriverSlot, ID: ${race.drivers[i].id}`);
//         console.log(`DriverSlot, car: ${race.drivers[i].car}`);
//         console.log(`DriverSlot, name: ${race.drivers[i].name}`);
//         try {
//           driverSlot.innerHTML = `<i title="ID: ${
//             race.drivers[i].id
//           }" class="fa-solid fa-car ${
//             !race.drivers[i].car ? "car-icon" : ""
//           }"></i> <strong>${race.drivers[i].car || ""}</strong> ${
//             race.drivers[i].name
//           }`;
//         } catch (error) {
//           driverSlot.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #FFD43B;"></i>`;
//         }
//       } else {
//         driverSlot.innerHTML = "";
//       }
//       listItemDrivers.append(driverSlot);
//     }
//     const raceActions = document.createElement("div");
//     raceActions.className = "race-actions";
//     raceActions.innerHTML = `
//                   <i onclick="addDriverToRace(${race.id})" class="fa-solid fa-user-plus btn" title="Add Driver"></i>
//                   <i onclick="deleteRace(${race.id})" class="fa-solid fa-trash btn" title="Delete Race"></i>
//               `;

//     listItem.append(listItemDrivers);
//     listItem.append(raceActions);
//     raceList.append(listItem);
//   });
//   // addFunctionality();
// }

let thisRaces = [];

export const createUpcomingRaces = (elementId) => {
  const upcomingRacesDiv = document.createElement("div");
  const sectionTitle = document.createElement("h2");
  const upcomingRacesList = document.createElement("ol");

  upcomingRacesDiv.classList.add("upcoming-races-section");
  sectionTitle.innerHTML = "Upcoming Races";
  upcomingRacesList.id = elementId;

  upcomingRacesDiv.append(sectionTitle);
  upcomingRacesDiv.append(upcomingRacesList);

  upcomingRacesList.addEventListener("click", handleRaceClick);

  return upcomingRacesDiv;
};

const handleRaceClick = (event) => {
  const raceItem = event.target.closest(".upcoming-race");
  if (!raceItem) return;
  const raceId = raceItem.dataset.raceId;
  const driversGrid = raceItem.querySelector(".race-drivers-grid");
  const currentDrivers = [...driversGrid.children];

  const drivers = currentDrivers
    .map((driver) => {
      if (driver.dataset.id) {
        return {
          id: driver.dataset.id,
          name: driver.dataset.name,
          car: driver.dataset.car || null,
        };
      }
      return null;
    })
    .filter((driver) => driver !== null);

  window.showDrivers(drivers, raceId);

  if (raceItem.classList.contains("highlight")) {
    raceItem.classList.remove("highlight");
    document.getElementById("drivers-list").innerHTML = "";
  } else {
    document.querySelectorAll("#race-list li.highlight").forEach((item) => {
      item.classList.remove("highlight");
    });
    raceItem.classList.add("highlight");
  }
};

export const createRace = (race) => {
  // parent
  const item = document.createElement("li");
  item.className = "upcoming-race";
  item.dataset.raceId = race.id;

  // Race ID
  const idDiv = document.createElement("div");
  idDiv.className = "upcoming-race-id";
  idDiv.innerHTML = race.id;

  // Drivers
  const driversGrid = document.createElement("div");
  driversGrid.className = "race-drivers-grid";

  for (let i = 0; i < 8; i++) {
    const driver = race.drivers[i];
    driversGrid.append(createDriver(driver));
  }

  // Actions
  const raceActions = document.createElement("div");
  raceActions.className = "race-actions";
  raceActions.innerHTML = `
  <i onclick="addDriverToRace(${race.id})" class="fa-solid fa-user-plus btn" title="Add Driver"></i>
  <i onclick="deleteRace(${race.id})" class="fa-solid fa-trash btn" title="Delete Race"></i>
  `;

  item.append(idDiv, driversGrid, raceActions);
  return item;
};

export const createDriver = (driver) => {
  const driverSlot = document.createElement("div");
  driverSlot.className = "driver-slot";

  if (driver) {
    driverSlot.dataset.id = driver.id;
    driverSlot.dataset.name = driver.name;
    driverSlot.dataset.car = driver.car;
    driverSlot.innerHTML = `
    <i title="ID: ${driver.id}" class="fa-solid fa-car ${
      !driver.car ? "car-icon" : ""
    }"></i> <strong>${driver.car || ""}</strong> ${driver.name}`;
  }

  return driverSlot;
};

export const updateRace = (race) => {
  const raceElement = document.querySelector(`[data-race-id="${race.id}"]`);
  if (raceElement) {
    const driversGrid = raceElement.querySelector(".race-drivers-grid");
    const currentDrivers = driversGrid.children;

    for (let i = 0; i < 8; i++) {
      const driver = race.drivers[i];
      const currentSlot = currentDrivers[i];
      const newSlot = createDriver(driver);
      if (currentSlot.innerHTML !== newSlot.innerHTML) {
        currentSlot.replaceWith(newSlot);
      }
    }
  } else {
    const raceParentElement = document.getElementById(`race-list`);
    raceParentElement.append(createRace(race));
  }
};

export const update = (races) => {
  const newRaceIds = races.map((r) => r.id);
  const currentRaceIds = Array.from(
    document.querySelectorAll(".upcoming-race")
  ).map((item) => parseInt(item.dataset.raceId));
  currentRaceIds.forEach((id) => {
    if (!newRaceIds.includes(id)) {
      const raceElement = document.querySelector(`[data-race-id="${id}"]`);
      raceElement.remove();
    }
  });

  races.forEach((race) => updateRace(race));

  thisRaces = races;
};
// handle click

// racestore.js
// updateUpcomingRacesUI -> if(upcomingcomponent) { upcomingcomponent.update(this.upcoming)}
