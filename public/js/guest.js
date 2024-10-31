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

const getRace = async (endpoint = "/api/currentrace") => {
  const response = await fetch(endpoint);
  const data = await handleResponse(response);
  if (data.status === "success") {
    return data.data[0];
  } else {
    alert(data.message);
  }
};

const getLeaderboardById = async (raceId) => {
  const response = await fetch(`/api/leader-board/${raceId}`);
  const data = await handleResponse(response);
  if (data.status === "success") {
    await updateLeaderBoard(data.data);
    return data.data;
  } else {
    alert(data.message);
  }
};

const updateLeaderBoard = async (data) => {
  const tbody = document.querySelector("#leaderboard tbody");
  const driverIds = [];
  const lap_time = [];
  const drivers = [];
  const cars = [];
  const currentLap = [];

  data.forEach((lap) => {
    if (!driverIds.includes(lap.driver_id)) {
      driverIds.push(lap.driver_id);
      let displayTime = "";
      const minutes = Math.floor(Math.floor(lap.lap_time / 1000) / 60);
      if (minutes !== 0) {
        displayTime = `${minutes.toString()}:`;
      }
      const seconds = Math.floor(lap.lap_time / 1000) % 60;
      const milliseconds = lap.lap_time % 1000;
      displayTime += `${seconds.toString().padStart(2, "0")}.${milliseconds
        .toString()
        .padStart(2, "0")}`;
      lap_time.push(`${displayTime}`);
      currentLap.push(lap.lap_number);
    }
    if (driverIds.includes(lap.driver_id)) {
      const index = driverIds.indexOf(lap.driver_id);
      if (currentLap[index] < lap.lap_number) {
        currentLap[index] = lap.lap_number;
      }
    }
  });

  for (let i = 0; i < driverIds.length; i++) {
    const response = await fetch(`/api/drivers/${driverIds[i]}`);
    const driver = await handleResponse(response);
    drivers.push(driver.data.name);
    cars.push(driver.data.car);
  }

  for (let index = 0; index < 8; index++) {
    const row = document.getElementById(`driver-${index + 1}`);
    if (index < drivers.length) {
      row.innerHTML = `
      <td><span id="driver-${index + 1}-position">${index + 1}</span></td>
      <td><span id="driver-${index + 1}-car">${cars[index]}</span></td>
      <td><span id="driver-${index + 1}-driver">${drivers[index]}</span></td>
      <td><span id="driver-${index + 1}-lap-number">${
        currentLap[index]
      }</span></td>
      <td><span id="driver-${index + 1}-fastest-lap-time">${
        lap_time[index]
      }</span></td>
    `;
    } else {
      //   row.innerHTML = `
      //   <td><span id="driver-${index + 1}-position"></span></td>
      //   <td><span id="driver-${index + 1}-car"></span></td>
      //   <td><span id="driver-${index + 1}-driver"></span></td>
      //   <td><span id="driver-${index + 1}-lap-number"></span></td>
      //   <td><span id="driver-${index + 1}-fastest-lap-time"></span></td>
      // `;
      row.innerHTML = "";
    }
  }

  // data.forEach((lap, index) => {
  //   console.log(lap);
  //   const row = document.createElement("tr");
  //   row.id = `driver-${index + 1}`;

  //   // car and current lap
  //   // fastest lap time for each car
  //   // get car id from lap.driver_id

  //   // current lap for each car
  //   // find highest lap_number for driver by race

  //   // drivers name and car number
  //   // get driver name and car id by lap.driver_id

  //   // ordered by fastest lap times

  //   // id, driver_id, race_id, lap_time (start_time + milliseconds), lap_number
  //   // <th>Position</th>
  //   // <th>Car</th>
  //   // <th>Driver</th>
  //   // <th>Lap Number</th>
  //   // <th>Fastest Lap Time</th>

  //   //   <tr id="driver-8">
  //   //   <td><div id="driver-8-position" class="skeleton"></div></td>
  //   //   <td><div id="driver-8-car" class="skeleton"></div></td>
  //   //   <td><div id="driver-8-driver" class="skeleton"></div></td>
  //   //   <td><div id="driver-8-lap-number" class="skeleton"></div></td>
  //   //   <td><div id="driver-8-fastest-lap-time" class="skeleton"></div></td>
  //   // </tr>

  //   row.innerHTML = `
  //     <td><span id="driver-${index + 1}-position">${index + 1}</span></td>
  //     <td><span id="driver-${index + 1}-car">${lap.driver_id}</span></td>
  //     <td><span id="driver-${index + 1}-driver">Michael</span></td>
  //     <td><span id="driver-${index + 1}-lap-number">${index + 4}</span></td>
  //     <td><span id="driver-${index + 1}-fastest-lap-time">${
  //     lap.lap_time
  //   }</span></td>
  //   `;
  //   tbody.appendChild(row);
  // });
};

const generateTestLeaderboard = () => {
  const leaderboard = document.getElementById("leaderboard");
  if (!leaderboard) return;

  const testData = Array.from({ length: 8 }, (_, i) => ({
    driver_id: i + 1,
    lap_time: 75000 + Math.random() * 5000, // Random time between 75-80 seconds
    lap_number: Math.floor(Math.random() * 20) + 1, // Random lap 1-20
    driver: {
      name: `Test Driver ${i + 1}`,
      car: `Car #${(i + 1) * 11}`,
    },
  }));

  const formatLapTime = (milliseconds) => {
    const minutes = Math.floor(Math.floor(milliseconds / 1000) / 60);
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const ms = Math.floor(milliseconds % 1000);

    return minutes > 0
      ? `${minutes}:${seconds.toString().padStart(2, "0")}.${ms
          .toString()
          .padStart(3, "0")}`
      : `${seconds.toString().padStart(2, "0")}.${ms
          .toString()
          .padStart(3, "0")}`;
  };

  const tbody = leaderboard.querySelector("tbody");
  testData.forEach((driver, index) => {
    const row = document.getElementById(`driver-${index + 1}`);
    if (row) {
      const displayTime = formatLapTime(driver.lap_time);
      row.innerHTML = `
        <td><span id="driver-${index + 1}-position">${index + 1}</span></td>
        <td><span id="driver-${index + 1}-car">${driver.driver.car}</span></td>
        <td><span id="driver-${index + 1}-driver">${
        driver.driver.name
      }</span></td>
        <td><span id="driver-${index + 1}-lap-number">${
        driver.lap_number
      }</span></td>
        <td><span id="driver-${
          index + 1
        }-fastest-lap-time">${displayTime}</span></td>
      `;
    }
  });
};

const simulatePositionChanges = () => {
  const tbody = document.querySelector("#leaderboard tbody");
  const rows = Array.from(tbody.children);

  setInterval(() => {
    const activeRows = rows.filter((row) => row.innerHTML.trim() !== "");
    if (activeRows.length < 2) return;

    const pos1 = Math.floor(Math.random() * activeRows.length);
    let pos2 = Math.floor(Math.random() * activeRows.length);
    while (pos2 === pos1) {
      pos2 = Math.floor(Math.random() * activeRows.length);
    }

    const row1 = activeRows[pos1];
    const row2 = activeRows[pos2];

    const rect1 = row1.getBoundingClientRect();
    const rect2 = row2.getBoundingClientRect();
    const distance = rect2.top - rect1.top;

    // Add blur effect before animation starts
    row1.classList.add("position-changing");
    row2.classList.add("position-changing");

    // Set initial positions
    row1.style.transform = `translateY(0)`;
    row2.style.transform = `translateY(0)`;
    row1.offsetHeight;

    // Start movement animation
    row1.style.transform = `translateY(${distance}px)`;
    row2.style.transform = `translateY(${-distance}px)`;

    // Calculate new positions
    const newPos1 = Array.from(tbody.children).indexOf(row2) + 1;
    const newPos2 = Array.from(tbody.children).indexOf(row1) + 1;

    // Update IDs for styling
    row1.id = `driver-${newPos1}`;
    row2.id = `driver-${newPos2}`;

    // Update content while blurred (halfway through animation)
    setTimeout(() => {
      // Update position numbers and element IDs
      const elements1 = row1.querySelectorAll('[id*="driver-"]');
      const elements2 = row2.querySelectorAll('[id*="driver-"]');

      elements1.forEach((el) => {
        const baseName = el.id.split("-").slice(-1)[0];
        el.id = `driver-${newPos1}-${baseName}`;
        if (baseName === "position") {
          el.textContent = newPos1;
        }
      });

      elements2.forEach((el) => {
        const baseName = el.id.split("-").slice(-1)[0];
        el.id = `driver-${newPos2}-${baseName}`;
        if (baseName === "position") {
          el.textContent = newPos2;
        }
      });
    }, 250); // Update halfway through animation

    // After animation completes
    setTimeout(() => {
      // Reset transforms
      row1.style.transform = "";
      row2.style.transform = "";

      // Remove blur effect
      row1.classList.remove("position-changing");
      row2.classList.remove("position-changing");

      // Swap DOM elements
      const nextRow2 = row2.nextElementSibling;
      tbody.insertBefore(row2, row1);
      tbody.insertBefore(row1, nextRow2);

      // Final position update for all rows
      Array.from(tbody.children).forEach((row, index) => {
        const position = index + 1;
        row.id = `driver-${position}`;

        const elements = row.querySelectorAll('[id*="driver-"]');
        elements.forEach((el) => {
          const baseName = el.id.split("-").slice(-1)[0];
          el.id = `driver-${position}-${baseName}`;
          if (baseName === "position") {
            el.textContent = position;
          }
        });
      });
    }, 500);
  }, 3000);
};

window.loadRaceInfo = async () => {
  const race = await getCurrentRace();
  if (race) {
    document.getElementById("raceId").textContent = `${race.id}`;
    document.getElementById("raceMode").textContent = `${race.mode}`;
    document.getElementById("raceStatus").textContent = `${race.status}`;
  }
  await getLeaderboardById(race.id);
  simulatePositionChanges();
  // generateTestLeaderboard();
};

window.getLeaderboardById = (raceId) => getLeaderboardById(raceId);
window.getCurrentRace = () => getRace("/api/currentrace");
window.getNextRace = () => getRace("/api/next-race");
window.handleResponse = handleResponse;
