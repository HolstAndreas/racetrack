let start_time;
let race_id;
let car_driver;

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

const startARace = async (receivedRace) => {
  start_time = receivedStartTime;
  const statusElement = document.getElementById("status");
  statusElement.innerHTML = `<strong>Status: Started</strong> @ ${new Date(
    start_time
  ).toLocaleTimeString()}`;

  // start a countdown;
};

const registerLapTime = async (carId) => {
  const timestamp = Date.now();
  const lapTime = timestamp - start_time;
  fetch("/api/laptimes");
};

document.addEventListener("DOMContentLoaded", async () => {
  // Get initial race data
  const data = await fetchCurrentRace();
  const currentRace = data.data[0];
  if (currentRace) {
    console.log(currentRace);
    document.getElementById("raceId").textContent = currentRace.id;
    document.getElementById("status").textContent = currentRace.status;

    // Set up car button click handlers
    for (let i = 1; i <= 8; i++) {
      const btn = document.getElementById(`car-btn${i}`);
      btn.addEventListener("click", () => registerLapTime(i));

      // Disable buttons for cars not in race
      if (i > currentRace.drivers?.length) {
        btn.disabled = true;
      }
    }
  }
});

// fetches
const fetchCurrentRace = async () => {
  try {
    const response = await fetch(`/api/currentrace`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    alert(error);
  }
};

// on page load fetch current race info
// #raceId, #status #timer

// on race finish fetch new race (socket.on(race-finished))

// on race start start our timer and change status (socket.on(raceStart))

// get amount of drivers
// disable buttons if drivers lower than 8
// #car-btn1 - #car-btn8
