// Utility functions
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;

  try {
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error("Failed to parse response");
  }

  if (!response.ok) {
    throw new Error(
      data.message || data || `HTTP error! status: ${response.status}`
    );
  }

  return data;
};

document.addEventListener("DOMContentLoaded", () => {
  // First fetch for current race
  fetch("api/race-sessions/6")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response went wrong");
      }
      return response.json();
    })
    .then((data) => {
      const currentRace = document.getElementById("current-race");

      const raceData = document.getElementById("race-data");

      const raceInfo = document.getElementById("race-info");

      const title = document.createElement("h3");
      title.innerHTML = `<strong>Current race: ${data.data[0].id}</strong>`;
      raceData.append(title);

      const status = document.createElement("p");
      status.innerHTML = `Status: ${data.data[0].status}`;
      raceData.append(status);

      const mode = document.createElement("p");
      mode.innerHTML = `Mode: ${data.data[0].mode}`;
      raceData.append(mode);

      //raceInfo.append(raceData);

      const drivers = document.getElementById("drivers-in-current");

      const newData = data.data[0].drivers;
      console.log(newData);

      for (let i = 0; i < 8; i++) {
        const driverRow = document.getElementById(`driver-row-${i}`);
        if (i < newData.length) {
          fetchDriver(newData[i]).then((driver) => {
            let { name, car, id } = driver.data;
            if (car === null) {
              car = "_";
            }
            driverRow.innerHTML = `<strong>${car} |</strong> ${name} (${id})`;
          });
        } else {
          driverRow.innerHTML = "No Driver";
        }
        // fetchDriver(newData[0]).then((driver) => {});
        // newData.forEach((driverId) => {
        //   const driverRow = document.getElementById(`driver-row-${i}`);

        //   fetchDriver(driverId).then((driver) => {
        //     let { name, car } = driver.data;
        //     if (car === null) {
        //       car = "_";
        //     }
        //     driverRow.innerHTML = `<strong>${car} |</strong> ${name} (${driverId})`;
        //     drivers.append(driverRow);
        //     const did = driver.data.id;

        //     console.log(`${did}`);
        // });
        // });
      }
      //raceInfo.append(drivers);

      const countdown = document.getElementById("countdown");
      countdown.innerHTML = `00.00`;

      // currentRace.append(raceInfo);
      // currentRace.append(countdown);
    })
    .catch((error) => {
      console.error("Error loading current race data:", error);
      document.getElementById(
        "current-race"
      ).innerHTML = `Error loading current race data: ${error}`;
    });

  // Second fetch for race list
  fetch("/api/upcomingraces")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response went wrong");
      }
      return response.json();
    })
    .then((data) => {
      const raceList = document.getElementById("race-list");
      const newData = data.data;

      if (newData.length > 0) {
        let counter = 0;
        newData.forEach((race) => {
          const listItem = document.createElement("li");
          listItem.addEventListener("click", (event) => {
            const raceEventTarget = event.target;
            if (raceEventTarget.classList.contains("highlight")) {
              raceEventTarget.classList.remove("highlight");
              document.getElementById("drivers-list").innerHTML = "";
            } else {
              document.querySelectorAll(".highlight").forEach((item) => {
                item.classList.remove("highlight");
              });
              raceEventTarget.classList.toggle("highlight");
              selectRace(race.id);
            }
          });
          if (race.start_time != null) {
            listItem.innerHTML = `<strong>Current race: ${race.id}</strong> - ${race.drivers}`;
          } else {
            if (counter === 0) {
              listItem.innerHTML = `<strong>Next race: ${race.id}</strong> - ${race.drivers}`;
            } else {
              listItem.innerHTML = `<strong>${race.id}</strong> - ${race.drivers}`;
            }
          }
          raceList.append(listItem);
          counter++;
        });
      } else {
        raceList.innerHTML = "<li>No upcoming races available.</li>";
      }
    })
    .catch((error) => {
      console.error("Error loading race list:", error);
      document.getElementById(
        "race-list"
      ).innerHTML = `<li>Error loading race data: ${error}</li>`;
    });
});

async function fetchDriver(id) {
  try {
    const response = await fetch(`/api/drivers/${id}`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function fetchRace(raceId) {
  try {
    const response = await fetch(`/api/race-sessions/${raceId}`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function selectRace(raceId) {
  const data = await fetchRace(raceId);

  const driversList = document.getElementById("drivers-list");
  driversList.innerHTML = "";
  data.data[0].drivers.forEach(async (driver) => {
    const driverObj = await fetchDriver(driver);
    const driverLi = document.createElement("li");
    const name = driverObj.data.name;
    const id = driverObj.data.id;
    const car = driverObj.data.car ? driverObj.data.car : "No Car";
    driverLi.innerHTML = `
      <div class="driver-info" id="driver${id}">
        <span><b>ID:</b> ${id}</span>
        <span>
          <b>Name:</b> 
          <input type="text" id="driver${id}-name" value="${name}" readonly/>
          <button onclick="editDriverName(${id})">Edit Name</button>
          <button class="hidden" id="save-name${id}" onclick="saveDriverName(${id})">Save Name</button>
        </span>
        <span>
          <b>Car:</b> 
          <input type="text" id="driver${id}-car" value="${car}" readonly/>
          <button onclick="editDriverCar(${id})">Edit Car</button>
          <button class="hidden" id="save-car${id}" onclick="saveDriverCar(${id})">Save Car</button>
        </span>
        <button onclick="removeDriverFromRace(${id})">Remove driver from race</button>
        <button onclick="deleteDriver(${id})">Delete Driver</button>
      </div>`;
    driversList.append(driverLi);
  });
}

const editDriverName = (id) => {
  document.getElementById(`driver${id}-name`).removeAttribute("readonly");
  document.getElementById(`save-name${id}`).classList.remove("hidden");
};

const editDriverCar = (id) => {
  document.getElementById(`driver${id}-car`).removeAttribute("readonly");
  document.getElementById(`save-car${id}`).classList.remove("hidden");
};

const saveDriverName = async (id) => {
  const name = document.getElementById(`driver${id}-name`).value;
  const saveBtn = document.getElementById(`save-name${id}`);

  // 3+ chars, only letters
  const nameRegex = /^[a-zA-Z\s]{3,}$/.test(name);
  if (!nameRegex) {
    alert("Name must be at least 3 characters long and contain only letters.");
    return;
  }

  const result = await patchDriverName(id, name);
  if (result.status === "success") {
    saveBtn.classList.add("hidden");
  }
};

const saveDriverCar = async (id) => {
  const carInput = document.getElementById(`driver${id}-car`);
  const carId = carInput.value;
  const saveBtn = document.getElementById(`save-car${id}`);

  // Validate car ID is a number
  if (!Number.isInteger(Number(carId))) {
    alert("Car ID must be a number");
    return;
  }

  const result = await postDriverCar(id, carId);
  if (result.status === "success") {
    carInput.setAttribute("readonly", true);
    saveBtn.classList.add("hidden");
  }
};

const removeDriverFromRace = (id) => {
  try {
    const response = await fetch(/api/race-sessions/:raceId/drivers/:driverId)
  } catch (error) {
    alert(error);
    console.error(`Error removing driver from race: $`)
  }
};

const patchDriverName = async (id, name) => {
  try {
    const response = await fetch(`/api/drivers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });
    const data = await handleResponse(response);
    if (data.status === "success") {
      return data;
    }
  } catch (error) {
    alert(error);
    console.error(`Error updating driver name: ${error}`);
  }
};

const postDriverCar = async (id, car) => {
  // /api/drivers/:driverId/assign-car/:carId
  try {
    const response = await fetch(`/api/drivers/${id}/assign-car/${car}`, {
      method: "POST",
    });
    const data = await handleResponse(response);
    if (data.status === "success") {
      return data;
    }
  } catch (error) {
    alert(error);
    console.error(`Error updating driver car: ${error}`);
  }
};
