//let thisRaces = [];

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

  const selectedRaceElement = document.querySelector(
    ".highlight[data-race-id]"
  );
  if (selectedRaceElement) {
    let selectedRaceId = selectedRaceElement.dataset.raceId;
    let selectedRaceValue = races.filter(
      (race) => race.id === parseInt(selectedRaceId)
    );
    window.showDrivers(selectedRaceValue[0].drivers, selectedRaceId);
  }
};
