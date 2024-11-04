export function createUpcomingRaces(elementId) {
  const upcomingRacesDiv = document.createElement("div");
  const sectionTitle = document.createElement("h2");
  const upcomingRacesList = document.createElement("ol");

  upcomingRacesDiv.classList.add("upcoming-races-section");
  sectionTitle.innerHTML = "Upcoming Races";
  upcomingRacesList.id = elementId;

  upcomingRacesDiv.append(sectionTitle);

  for (let i = 0; i < 3; i++) {
    const listItem = document.createElement("li");
    const listItemId = document.createElement("div");
    listItemId.className = "upcoming-race-id";
    listItemId.innerHTML = "<div class='skeleton'></div>";
    listItem.append(listItemId);

    const listItemDrivers = document.createElement("div");
    listItemDrivers.className = "race-drivers-grid";
    listItemDrivers.innerHTML = "<div class='skeleton'></div>";
    listItem.append(listItemDrivers);
    upcomingRacesList.append(listItem);
  }

  upcomingRacesDiv.append(upcomingRacesList);

  return upcomingRacesDiv;
}

export function addFunctionality() {
  const allUpcomingRaces = document.querySelectorAll(".upcoming-race");
  allUpcomingRaces.forEach((listItem) => {
    listItem.addEventListener("click", (event) => {
      const raceEventTarget = event.target.closest("li");
      if (raceEventTarget.classList.contains("highlight")) {
        raceEventTarget.classList.remove("highlight");
        document.getElementById("drivers-list").innerHTML = "";
      } else {
        document.querySelectorAll("#race-list li.highlight").forEach((item) => {
          item.classList.remove("highlight");
        });
        raceEventTarget.classList.add("highlight");
        const raceIdDiv = raceEventTarget.querySelector(".upcoming-race-id");
        const raceId = raceIdDiv.textContent;
        console.log(raceId);
        updateSelectedRaceUI(raceId);
      }
    });
  });
}
