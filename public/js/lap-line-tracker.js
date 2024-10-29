let countdownInterval = null;
let TIMER = null;

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

const fetchRace = async () => {
  try {
    const response = await fetch(`/api/currentrace`);
    const data = await handleResponse(response);
    if (data.status === "success") {
      return data.data[0];
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert(err);
  }
};

const fetchDriver = async (id) => {
  try {
    const response = await fetch(`/api/drivers/${id}`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(`Error fetching driver ${id}:`, error);
  }
};

window.updateTimerValue = (timerInput) => {
  TIMER = timerInput;

  const timerElement = document.getElementById("timer");
  const minutes = Math.floor(TIMER / 60);
  const seconds = TIMER % 60;
  timerElement.innerHTML =
    TIMER !== null
      ? `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      : `<div class="skeleton"></div>`;
};

window.startCountdown = (startTime) => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  const endTime = Date.parse(startTime) + TIMER * 1000;

  countdownInterval = setInterval(() => {
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      timerElement.innerHTML = "00:00";
    }
  }, 1000);
};

window.stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  const timerElement = document.getElementById("timer");
  timerElement.innerHTML = "00:00";
};

window.loadRaceInfo = async () => {
  // Get initial race data
  const race = await fetchRace();
  if (race) {
    document.getElementById("raceId").textContent = race.id;
    document.getElementById("status").textContent = race.status;

    // countdown
    if (race.status === "STARTED") {
      window.startCountdown(race.start_time);
    } else {
      window.stopCountdown();
    }

    // Set up car button click handlers
    for (let i = 1; i <= 8; i++) {
      const btn = document.getElementById(`car-btn${i}`);
      if (race.drivers[i - 1]) {
        const driver = await fetchDriver(race.drivers[i - 1]);
        if (driver && driver.data) {
          const { car, id } = driver.data;
          btn.addEventListener("click", () => window.registerLapTime(id));
          btn.textContent = `${car}`;
        }
      } else {
        btn.textContent = `X`;
      }

      // Disable buttons for cars not in race
      if (i > race.drivers?.length) {
        btn.disabled = true;
        btn.classList.add("disabled");
      } else {
        if (btn.classList.contains("disabled")) {
          btn.classList.remove("disabled");
          btn.disabled = false;
        }
      }
    }
  } else {
    alert("No current race.");
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.loadRaceInfo();
  } catch (err) {
    alert(err);
  }
});

// 15:20 start time
// 15:22 // 2min lap 1
// 15:22:30 // 30s lap 2
// 15:22:55 // 25s lap 3

// lap 1 = lap1time - starttime
// lap 2 = lap2time - lap1time

// 15:20 start_time
// 15:22 - 1 lap (2min) -timestamp
// 15:23 - 2 lap (1min)

// input - timestamp
// save - seconds
// 2024-10-29T11:34:54.238Z
