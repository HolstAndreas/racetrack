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

// driver management functions
const addDriverToRace = async (raceId) => {
  const driverId = prompt("Enter driver ID to add:");
  if (!driverId) return;

  try {
    const response = await fetch(
      `/api/race-sessions/${raceId}/drivers/${driverId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await handleResponse(response);
    if (data.status === "success") {
      await refreshData();
    }
  } catch (error) {
    alert(`Error adding driver to race: ${error.message}`);
    console.error(`Error adding driver to race: ${error}`);
  }
};

export const populateDriverSelect = async () => {
  try {
    const response = await fetch("/api/drivers");
    const data = await handleResponse(response);

    // get select elements
    const driverSelect = document.getElementById("driver-select");
    const editDriverSelect = document.getElementById("edit-driver-select");

    // clear existing options except first
    driverSelect.innerHTML = "<option value=''>Select Driver</option>";
    editDriverSelect.innerHTML = "<option value=''>Select Driver</option>";

    // populate select elements
    data.data.forEach((driver) => {
      const option = document.createElement("option");
      option.value = driver.id;
      option.textContent = `${driver.name} (ID: ${driver.id})`;

      // clone the option for the second select
      const optionClone = option.cloneNode(true);

      // append options to select elements
      driverSelect.append(option);
      editDriverSelect.append(optionClone);
    });
  } catch (error) {
    console.error("Error populating driver select:", error);
  }
};

const deleteDriverManagement = async () => {
  const id = document.getElementById("edit-driver-select").value;
  if (!id) {
    alert("Please select a driver");
    return;
  }
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
        // await fetchUpcomingRaces(); // Refresh the upcoming races list
        await populateDriverSelect();
      }
    }
  } catch (error) {
    alert(error);
    console.error(`Error deleting driver: ${error}`);
  }
};

const updateDriver = async () => {
  const id = document.getElementById("edit-driver-select").value;
  if (!id) {
    alert("Please select a driver");
    return;
  }
  const name = document.getElementById("edit-driver-name").value;
  if (!name) {
    alert("Please enter a driver name");
    return;
  }
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
      alert(`Driver ${name} updated successfully!`);
      refreshData();
      clearDriverUpdateForm();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert(error);
  }
};

const createDriver = async () => {
  const driverName = document.getElementById("driver-name").value.trim();

  if (!driverName) {
    alert("Please enter a driver name");
    return;
  }

  if (!validateDriverName(driverName)) {
    alert("Name must be at least 3 characters long and contain only letters.");
    return;
  }

  try {
    const response = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: driverName }),
    });

    const data = await handleResponse(response);
    if (data.status === "success") {
      document.getElementById("driver-name").value = "";
      await refreshData();
      alert(`Driver ${driverName} created successfully!`);
    }
  } catch (error) {
    alert(error);
  }
};

const assignCar = async () => {
  const driverId = document.getElementById("driver-select").value;
  const carId = document.getElementById("car-id").value;

  if (!validateCarAssignment(driverId, carId)) {
    return;
  }

  try {
    const response = await fetch(
      `/api/drivers/${driverId}/assign-car/${carId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await handleResponse(response);

    if (data.status === "success") {
      clearCarAssignmentForm();
      await refreshData();
      Toastify({
        text: `Car ${carId} assigned successfully to driver ${driverId}`,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
      }).showToast();
    }
  } catch (error) {
    Toastify({
      text: `${error.message}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      className: "error",
      stopOnFocus: true,
    }).showToast();
  }
};

window.getCurrentRace = async () => {
  const response = await fetch(`/api/currentrace`);
  const data = await handleResponse(response);
  if (data.status === "success") {
    return data; //data[0]
  } else {
    alert(data.message);
  }
};

const createRace = async () => {
  const driversInput = document.getElementById("race-drivers").value;
  if (!driversInput) {
    alert(`Please provide atleast 1 driver`);
    return;
  }
  // split by comma, trim spaces, and convert to int
  const drivers = driversInput.split(",").map((id) => parseInt(id.trim()));

  if (!drivers.length) {
    alert(`Please provide atleast 1 driver`);
    return;
  }

  try {
    const response = await fetch("/api/race-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drivers: drivers,
      }),
    });

    const data = await handleResponse(response);
    if (data.status === "success") {
      clearRaceCreationForm();
      await refreshData();
    }
  } catch (error) {
    alert(`Error creating race: ${error.message}`);
  }
};

const deleteRace = async (raceId) => {
  try {
    const confirmDelete = confirm(
      `Are you sure you want to delete race ${raceId}?`
    );

    if (confirmDelete) {
      const response = await fetch(`/api/race-sessions/${raceId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        await refreshData();
      }
    }
  } catch (error) {
    Toastify({
      text: `${error.message}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      className: "error",
      stopOnFocus: true,
    }).showToast();
  }
};

// validation functions
const validateDriverName = (name) => {
  // only letters and spaces min 3
  return /^[a-zA-Z\s]{3,}$/.test(name);
};

const validateCarAssignment = (driverId, carId) => {
  if (!driverId) {
    alert("Please select a driver");
    return false;
  }
  if (!parseInt(carId) || parseInt(carId) < 1) {
    alert("Car ID must be a positive number");
    return false;
  }
  return true;
};

// helper functions
const clearCarAssignmentForm = () => {
  document.getElementById("car-id").value = "";
  document.getElementById("driver-select").selectedIndex = 0;
};

const clearRaceCreationForm = () => {
  document.getElementById("race-drivers").value = "";
};

const clearDriverUpdateForm = () => {
  document.getElementById("edit-driver-name").value = "";
  document.getElementById("edit-driver-select").selectedIndex = 0;
};

const refreshData = async () => {
  await Promise.allSettled([populateDriverSelect()]);
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    document
      .getElementById("assign-car-btn")
      .addEventListener("click", assignCar);
    document
      .getElementById("update-driver-btn")
      .addEventListener("click", updateDriver);
    document
      .getElementById("delete-driver-btn")
      .addEventListener("click", deleteDriverManagement);
    document
      .getElementById("create-race-btn")
      .addEventListener("click", createRace);
    document
      .getElementById("create-driver-btn")
      .addEventListener("click", createDriver);
    await refreshData();
  } catch (error) {
    alert(error);
  }
});

window.addDriverToRace = addDriverToRace;
window.deleteRace = deleteRace;
