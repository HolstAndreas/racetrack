export const updateLeaderBoard = async (race) => {
  const currentPositions = {};
  for (let i = 1; i <= 8; i++) {
    const driver = document.querySelector(`#driver-${i + 1}-driver`);
    if (driver) {
      currentPositions[driver.textContent] = i;
    }
  }

  const newDriverLaps = [];
  const seenDrivers = new Set();

  const driverLapCount = new Map();

  // foreach race.laptimes count driver laps

  race.lap_times.forEach((lap) => {
    if (!seenDrivers.has(lap.driver_id)) {
      // if lapnumber = 0 dont add to set
      if (lap.lap_number !== 0) {
        seenDrivers.add(lap.driver_id);
      } // if lap 0 dont do this
      const fastestDriver = race.drivers.find(
        (driver) => driver.id === lap.driver_id
      );
      if (lap.lap_number === 0 && driverLapCount.get(fastestDriver.id) > 1) {
        // race.lap_times.filter(lap => lap.driver_id = driver.id).length();
        // if lapnumber = 0 && driver has > 1 laps length dont push to newdriverlaps
        // MIHKEL LAP = 0 AND LAP COUNT = 1 = RUN FUNCTION (mihkel has laps 1)
        // MIHKEL LAP = 0 AND LAP COUNT = 2 = DONT RUN FUNCTION (mihkel has laps 0 and 1)
        // MIHKEL LAP = 1 AND LAP COUNT = 2 = RUN FUNCTION (mihkel has laps 0 and 1)
        // array[0] mihkel.laps.length = 1
        // array[0, 1] mihkel.laps.length = 2
        // array[0, 1, 2]
        // array[1, 0, 2]
        newDriverLaps.push({
          name: fastestDriver.name || null,
          car: fastestDriver.car || null,
          lapTime: lap.lap_number !== 0 ? formatLapTime(lap.lap_time) : "",
          lapNumber: lap.lap_number,
        });
      }
    }
  });

  if (newDriverLaps.length === 0) {
    for (let i = 1; i <= 8; i++) {
      const row = document.getElementById(`driver-${i}`);
      row.innerHTML = "";
    }
  }

  for (let i = 0; i < 8; i++) {
    const newPos = i + 1;
    const row = document.getElementById(`driver-${newPos}`);
    if (newDriverLaps[i]) {
      row.innerHTML = `
    <td><span id="driver-${newPos}-position">${newPos}</span></td>
    <td><span id="driver-${newPos}-car">${newDriverLaps[i].car}</span></td>
    <td><span id="driver-${newPos}-driver">${newDriverLaps[i].name}</span></td>
    <td><span id="driver-${newPos}-lap-number">${
        newDriverLaps[i].lapNumber + 1
      }</span></td>
    <td><span id="driver-${newPos}-fastest-lap-time">${
        newDriverLaps[i].lapTime
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
