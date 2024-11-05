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

export const createDriversList = (elementId) => {
  const driversListDiv = document.createElement("div");
  driversListDiv.className = elementId;

  const driversList = document.createElement("ol");
  driversList.id = "drivers-list";

  driversListDiv.appendChild(driversList);

  return driversListDiv;
};

export const showDrivers = (drivers, raceId) => {
  const driversList = document.getElementById("drivers-list");
  driversList.innerHTML = "";

  drivers.forEach((driver) => {
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
            <button onclick="removeDriverFromRace(${driver.id}, ${raceId})"
            class="btn">Remove from Race</button>
            <button onclick="deleteDriver(${
              driver.id
            })" class="btn">Delete Driver</button>
          </div>
        </div>`;
    driversList.appendChild(li);
  });
};

export const deleteDriver = async (id) => {
  try {
    const confirmDelete = confirm(
      `Are you sure you want to delete driver ${id}?`
    );

    if (confirmDelete) {
      const response = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        const driverToRemove = document.getElementById(`driver${id}`);
        driverToRemove.parentElement.remove();
      }
    }
  } catch (error) {
    alert(error);
    console.error(`Error deleting driver: ${error}`);
  }
};

export const removeDriverFromRace = async (driverId, raceId) => {
  try {
    const response = await fetch(
      `/api/race-sessions/${raceId}/drivers/${driverId}`,
      {
        method: "DELETE",
      }
    );
    const data = await handleResponse(response);
    if (data.status === "success") {
      const driverToRemove = document.getElementById(`driver${driverId}`);
      driverToRemove.parentElement.remove();
    }
  } catch (error) {
    alert(error);
    console.error(`Error removing driver from race: ${error}`);
  }
};

window.showDrivers = showDrivers;
window.deleteDriver = deleteDriver;
window.removeDriverFromRace = removeDriverFromRace;
