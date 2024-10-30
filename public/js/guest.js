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
            lap_time.push(lap.lap_time);
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
            row.innerHTML = `
      <td><span id="driver-${index + 1}-position"></span></td>
      <td><span id="driver-${index + 1}-car"></span></td>
      <td><span id="driver-${index + 1}-driver"></span></td>
      <td><span id="driver-${index + 1}-lap-number"></span></td>
      <td><span id="driver-${index + 1}-fastest-lap-time"></span></td>
    `;
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

window.loadRaceInfo = async () => {
    const race = await getCurrentRace();
    if (race) {
        document.getElementById("raceId").textContent = `${race.id}`;
        document.getElementById("raceMode").textContent = `${race.mode}`;
        document.getElementById("raceStatus").textContent = `${race.status}`;
    }
    await getLeaderboardById(race.id);
};

window.getLeaderboardById = (raceId) => getLeaderboardById(raceId);
window.getCurrentRace = () => getRace("/api/currentrace");
window.getNextRace = () => getRace("/api/next-race");
window.handleResponse = handleResponse;
