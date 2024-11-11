export const updateLeaderBoard = async (race) => {
  const currentPositions = {};
  for (let i = 1; i <= 8; i++) {
    const driver = document.querySelector(`#driver-${i + 1}-driver`);
    if (driver) {
      currentPositions[driver.textContent] = i;
    }
  }

  // Map array
  const leaderboardData = [];
  // foreach race.laptimes count driver laps
  race.lap_times.forEach((lap) => {
    const foundDriver = leaderboardData.find(
      (row) => row.get("id") === lap.driver_id
    );
    if (foundDriver) {
      foundDriver.set("currentLap", foundDriver.get("currentLap") + 1);
      if (
        isNaN(foundDriver.get("fastestLap")) ||
        lap.lap_time < foundDriver.get("fastestLap")
      ) {
        foundDriver.set("fastestLap", lap.lap_time);
      }
    } else {
      const newDriver = new Map();
      newDriver.set("id", lap.driver_id);
      newDriver.set(
        "car",
        race.drivers.find((driver) => driver.id === lap.driver_id).car
      );
      newDriver.set(
        "name",
        race.drivers.find((driver) => driver.id === lap.driver_id).name
      );
      newDriver.set("currentLap", 1);
      if (lap.lap_number === 0) {
        newDriver.set("fastestLap", NaN);
      } else {
        newDriver.set("fastestLap", lap.lap_time);
      }
      leaderboardData.push(newDriver);
    }
  });

  if (leaderboardData.length === 0) {
    for (let i = 1; i <= 8; i++) {
      const row = document.getElementById(`driver-${i}`);
      row.innerHTML = "";
    }
  }
  leaderboardData.sort((a, b) => {
    // without fastest_lap it goes back
    if (isNaN(a.get("fastestLap")) && isNaN(b.get("fastestLap"))) return 0;
    if (isNaN(a.get("fastestLap"))) return 1;
    if (isNaN(b.get("fastestLap"))) return -1;

    // order in ascending order
    return a.get("fastestLap") - b.get("fastestLap");
  });


  for (let i = 0; i < 8; i++) {
    const newPos = i + 1;
    const row = document.getElementById(`driver-${newPos}`);
    if (leaderboardData[i]) {
      row.innerHTML = `
    <td><span id="driver-${newPos}-position">${newPos}</span></td>
    <td><span id="driver-${newPos}-car">${leaderboardData[i].get(
        "car"
      )}</span></td>
    <td><span id="driver-${newPos}-driver">${leaderboardData[i].get(
        "name"
      )}</span></td>
    <td><span id="driver-${newPos}-lap-number">${leaderboardData[i].get(
        "currentLap"
      )}</span></td>
    <td><span id="driver-${newPos}-fastest-lap-time">${
        isNaN(leaderboardData[i].get("fastestLap"))
          ? ""
          : formatLapTime(leaderboardData[i].get("fastestLap"))
      }</span></td>
  `;
    } else {
      row.innerHTML = ``;
    }
  }
};

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
