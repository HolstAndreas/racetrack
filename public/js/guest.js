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

    race.lap_times.forEach((lap) => {
        if (!seenDrivers.has(lap.driver_id)) {
            seenDrivers.add(lap.driver_id);
            const fastestDriver = race.drivers.find(
                (driver) => driver.id === lap.driver_id
            );
            console.log(fastestDriver);
            newDriverLaps.push({
                name: fastestDriver.name || null,
                car: fastestDriver.car || null,
                lapTime: formatLapTime(lap.lap_time),
                lapNumber: lap.lap_number,
            });
        }
    });

    newDriverLaps.forEach((driver, index) => {
        const newPos = index + 1;

        const row = document.getElementById(`driver-${newPos}`);
        if (row) {
            row.innerHTML = `
      <td><span id="driver-${newPos}-position">${newPos}</span></td>
      <td><span id="driver-${newPos}-car">${driver.car}</span></td>
      <td><span id="driver-${newPos}-driver">${driver.name}</span></td>
      <td><span id="driver-${newPos}-lap-number">${driver.lapNumber}</span></td>
      <td><span id="driver-${newPos}-fastest-lap-time">${driver.lapTime}</span></td>
    `;
        }
    });
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
