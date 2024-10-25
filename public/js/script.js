// Utility functions
const handleResponse = async (response, resultElement) => {
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
    resultElement.classList.add("error");
    throw new Error(
      data.message || data || `HTTP error! status: ${response.status}`
    );
  }

  resultElement.classList.remove("error");
  resultElement.classList.add("success");
  return data;
};

const displayResult = (element, data, error = false) => {
  element.textContent =
    typeof data === "object" ? JSON.stringify(data, null, 2) : data;
  element.classList.toggle("error", error);
  element.classList.toggle("success", !error);
};

// Race Session Management
async function fetchAllRaces() {
  const resultElement = document.getElementById("raceResult");
  try {
    const response = await fetch("/api/race-sessions");
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function fetchRace() {
  const resultElement = document.getElementById("raceResult");
  const raceId = document.getElementById("raceId").value;

  try {
    const response = await fetch(`/api/race-sessions/${raceId}`);
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function createRace() {
  const resultElement = document.getElementById("raceResult");
  const startTime = document.getElementById("startTime").value;
  const driversInput = document.getElementById("raceDrivers").value;
  const drivers = driversInput.split(",").map((id) => parseInt(id.trim()));

  try {
    const response = await fetch("/api/race-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startTime, drivers }),
    });
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

// Race Operations
async function fetchNextRace() {
  const resultElement = document.getElementById("raceResult");
  const currentRaceId = document.getElementById("raceId").value;

  try {
    const response = await fetch(`/api/race-sessions/${currentRaceId}/next`);
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function fetchRemainingTime() {
  const resultElement = document.getElementById("raceResult");
  const raceId = document.getElementById("raceId").value;

  try {
    const response = await fetch(`/api/race-sessions/${raceId}/remainingtime`);
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function fetchRaceFlags() {
  const resultElement = document.getElementById("raceResult");
  const raceId = document.getElementById("raceId").value;

  try {
    const response = await fetch(`/api/race-flags/${raceId}`);
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

// Driver Management
async function fetchDriver() {
  const resultElement = document.getElementById("driverResult");
  const driverId = document.getElementById("driverId").value;

  try {
    const response = await fetch(`/api/drivers/${driverId}`);
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function fetchAllDrivers() {
  const resultElement = document.getElementById("driverResult");

  try {
    const response = await fetch("/api/drivers");
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function createDriver() {
  const resultElement = document.getElementById("driverResult");
  const name = document.getElementById("driverName").value;

  if (!name || name.length < 3) {
    displayResult(
      resultElement,
      "Error: Driver name must be at least 3 characters long",
      true
    );
    return;
  }

  try {
    const response = await fetch("/api/drivers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

// Lap Times Management
async function postLapTime() {
  const resultElement = document.getElementById("lapTimeResult");
  const raceId = parseInt(document.getElementById("lapRaceId").value);
  const driverId = parseInt(document.getElementById("lapDriverId").value);
  const lapTime = parseInt(document.getElementById("lapTime").value);
  const lapNumber = parseInt(document.getElementById("lapNumber").value);

  if (!raceId || !driverId || !lapTime || !lapNumber) {
    displayResult(
      resultElement,
      "Error: All fields are required and must be numbers",
      true
    );
    return;
  }

  try {
    const response = await fetch("/api/laptimes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raceId, driverId, lapTime, lapNumber }),
    });
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function getLapTimesByRace() {
  const resultElement = document.getElementById("lapTimeResult");
  const raceId = document.getElementById("lapRaceId").value;

  if (!raceId || isNaN(raceId)) {
    displayResult(
      resultElement,
      "Error: Race ID is required and must be a valid number.",
      true
    );
    return;
  }

  try {
    console.log(`${raceId}`);
    const response = await fetch(`/api/laptimes/race/${raceId}`);
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function getLapTimesByDriver() {
  const resultElement = document.getElementById("lapTimeResult");
  const driverId = document.getElementById("lapDriverId").value;

  try {
    const response = await fetch(`/api/laptimes/driver/${driverId}`);
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function getFastestLap() {
  const resultElement = document.getElementById("lapTimeResult");
  const raceId = document.getElementById("lapRaceId").value;
  const driverId = document.getElementById("lapDriverId").value;

  try {
    const response = await fetch(
      `/api/laptimes/race/${raceId}/driver/${driverId}?fastest=true`
    );
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

// Race-Driver Operations
async function addDriverToRace() {
  const resultElement = document.getElementById("operationResult");
  const raceId = document.getElementById("raceIdOp").value;
  const driverId = document.getElementById("driverIdOp").value;

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
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function assignCar() {
  const resultElement = document.getElementById("operationResult");
  const driverId = document.getElementById("driverIdOp").value;
  const carId = document.getElementById("carId").value;

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
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

async function removeDriverFromRace() {
  const resultElement = document.getElementById("operationResult");
  const raceId = document.getElementById("raceIdOp").value;
  const driverId = document.getElementById("driverIdOp").value;

  try {
    const response = await fetch(
      `/api/race-sessions/${raceId}/drivers/${driverId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await handleResponse(response, resultElement);
    displayResult(resultElement, data);
  } catch (error) {
    displayResult(resultElement, `Error: ${error.message}`, true);
  }
}

// Optional: Add event listeners when the document loads
document.addEventListener("DOMContentLoaded", () => {
  // You could add keyboard shortcuts or other initialization here
  fetchAllDrivers(); // Optional: Load all drivers when the page loads
});
