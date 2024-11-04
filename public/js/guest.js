export const updateLeaderBoard = async (race) => {
  const tbody = document.querySelector("#leaderboard tbody");
  const driverIds = [];
  const lap_time = [];
  const drivers = [];
  const cars = [];
  const currentLap = [];

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
    // get each drivers fastest
    // each drivers fields: car, name, lapNumber, lapTime
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

    // if (!driverIds.includes(lap.driver_id)) {
    //   driverIds.push(lap.driver_id);
    //   let displayTime = formatLapTime(lap.lap_time);
    //   lap_time.push(displayTime);
    //   currentLap.push(lap.lap_number);
    // }
    // if (driverIds.includes(lap.driver_id)) {
    //   const index = driverIds.indexOf(lap.driver_id);
    //   if (currentLap[index] < lap.lap_number) {
    //     currentLap[index] = lap.lap_number;
    //   }
    // }
  });

  newDriverLaps.forEach((driver, index) => {
    const newPos = index + 1;
    const oldPos = currentPositions[driver.name];

    if (oldPos && oldPos !== newPos) {
      animatePositionChange(oldPos, newPos);
    }

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

  // for (let i = 0; i < driverIds.length; i++) {
  //   drivers.push(currentRaceDrivers[i].name);
  //   cars.push(currentRaceDrivers[i].car);
  // }

  // for (let index = 0; index < 8; index++) {
  //   const row = document.getElementById(`driver-${index + 1}`);
  //   if (index < drivers.length) {
  //     row.innerHTML = `
  //     <td><span id="driver-${index + 1}-position">${index + 1}</span></td>
  //     <td><span id="driver-${index + 1}-car">${cars[index]}</span></td>
  //     <td><span id="driver-${index + 1}-driver">${drivers[index]}</span></td>
  //     <td><span id="driver-${index + 1}-lap-number">${
  //       currentLap[index]
  //     }</span></td>
  //     <td><span id="driver-${index + 1}-fastest-lap-time">${
  //       lap_time[index]
  //     }</span></td>
  //   `;
  //   } else {
  //     row.innerHTML = "";
  //   }
  // }
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

const animatePositionChange = (fromPosition, toPosition) => {
  const tbody = document.querySelector("#leaderboard tbody");
  const row1 = document.getElementById(`driver-${fromPosition}`);
  const row2 = document.getElementById(`driver-${toPosition}`);

  if (!row1 || !row2) return;

  const rect1 = row1.getBoundingClientRect();
  const rect2 = row2.getBoundingClientRect();
  const distance = rect2.top - rect1.top;

  // Add blur effect
  row1.classList.add("position-changing");
  row2.classList.add("position-changing");

  // Animate
  row1.style.transform = `translateY(${distance}px)`;
  row2.style.transform = `translateY(${-distance}px)`;

  // Reset after animation
  setTimeout(() => {
    row1.style.transform = "";
    row2.style.transform = "";
    row1.classList.remove("position-changing");
    row2.classList.remove("position-changing");
  }, 500);
};

// const generateTestLeaderboard = () => {
//   const leaderboard = document.getElementById("leaderboard");
//   if (!leaderboard) return;

//   const testData = Array.from({ length: 8 }, (_, i) => ({
//     driver_id: i + 1,
//     lap_time: 75000 + Math.random() * 5000, // Random time between 75-80 seconds
//     lap_number: Math.floor(Math.random() * 20) + 1, // Random lap 1-20
//     driver: {
//       name: `Test Driver ${i + 1}`,
//       car: `Car #${(i + 1) * 11}`,
//     },
//   }));

//   const formatLapTime = (milliseconds) => {
//     const minutes = Math.floor(Math.floor(milliseconds / 1000) / 60);
//     const seconds = Math.floor(milliseconds / 1000) % 60;
//     const ms = Math.floor(milliseconds % 1000);

//     return minutes > 0
//       ? `${minutes}:${seconds.toString().padStart(2, "0")}.${ms
//           .toString()
//           .padStart(3, "0")}`
//       : `${seconds.toString().padStart(2, "0")}.${ms
//           .toString()
//           .padStart(3, "0")}`;
//   };

//   const tbody = leaderboard.querySelector("tbody");
//   testData.forEach((driver, index) => {
//     const row = document.getElementById(`driver-${index + 1}`);
//     if (row) {
//       const displayTime = formatLapTime(driver.lap_time);
//       row.innerHTML = `
//         <td><span id="driver-${index + 1}-position">${index + 1}</span></td>
//         <td><span id="driver-${index + 1}-car">${driver.driver.car}</span></td>
//         <td><span id="driver-${index + 1}-driver">${
//         driver.driver.name
//       }</span></td>
//         <td><span id="driver-${index + 1}-lap-number">${
//         driver.lap_number
//       }</span></td>
//         <td><span id="driver-${
//           index + 1
//         }-fastest-lap-time">${displayTime}</span></td>
//       `;
//     }
//   });
// };

// const simulatePositionChanges = () => {
//   const tbody = document.querySelector("#leaderboard tbody");
//   const rows = Array.from(tbody.children);

//   setInterval(() => {
//     const activeRows = rows.filter((row) => row.innerHTML.trim() !== "");
//     if (activeRows.length < 2) return;

//     const pos1 = Math.floor(Math.random() * activeRows.length);
//     let pos2 = Math.floor(Math.random() * activeRows.length);
//     while (pos2 === pos1) {
//       pos2 = Math.floor(Math.random() * activeRows.length);
//     }

//     const row1 = activeRows[pos1];
//     const row2 = activeRows[pos2];

//     const rect1 = row1.getBoundingClientRect();
//     const rect2 = row2.getBoundingClientRect();
//     const distance = rect2.top - rect1.top;

//     // Add blur effect before animation starts
//     row1.classList.add("position-changing");
//     row2.classList.add("position-changing");

//     // Set initial positions
//     row1.style.transform = `translateY(0)`;
//     row2.style.transform = `translateY(0)`;
//     row1.offsetHeight;

//     // Start movement animation
//     row1.style.transform = `translateY(${distance}px)`;
//     row2.style.transform = `translateY(${-distance}px)`;

//     // Calculate new positions
//     const newPos1 = Array.from(tbody.children).indexOf(row2) + 1;
//     const newPos2 = Array.from(tbody.children).indexOf(row1) + 1;

//     // Update IDs for styling
//     row1.id = `driver-${newPos1}`;
//     row2.id = `driver-${newPos2}`;

//     // Update content while blurred (halfway through animation)
//     setTimeout(() => {
//       // Update position numbers and element IDs
//       const elements1 = row1.querySelectorAll('[id*="driver-"]');
//       const elements2 = row2.querySelectorAll('[id*="driver-"]');

//       elements1.forEach((el) => {
//         const baseName = el.id.split("-").slice(-1)[0];
//         el.id = `driver-${newPos1}-${baseName}`;
//         if (baseName === "position") {
//           el.textContent = newPos1;
//         }
//       });

//       elements2.forEach((el) => {
//         const baseName = el.id.split("-").slice(-1)[0];
//         el.id = `driver-${newPos2}-${baseName}`;
//         if (baseName === "position") {
//           el.textContent = newPos2;
//         }
//       });
//     }, 250); // Update halfway through animation

//     // After animation completes
//     setTimeout(() => {
//       // Reset transforms
//       row1.style.transform = "";
//       row2.style.transform = "";

//       // Remove blur effect
//       row1.classList.remove("position-changing");
//       row2.classList.remove("position-changing");

//       // Swap DOM elements
//       const nextRow2 = row2.nextElementSibling;
//       tbody.insertBefore(row2, row1);
//       tbody.insertBefore(row1, nextRow2);

//       // Final position update for all rows
//       Array.from(tbody.children).forEach((row, index) => {
//         const position = index + 1;
//         row.id = `driver-${position}`;

//         const elements = row.querySelectorAll('[id*="driver-"]');
//         elements.forEach((el) => {
//           const baseName = el.id.split("-").slice(-1)[0];
//           el.id = `driver-${position}-${baseName}`;
//           if (baseName === "position") {
//             el.textContent = position;
//           }
//         });
//       });
//     }, 500);
//   }, 3000);
// };

// [
//   {
//     id: 3,
//     driver_id: 3,
//     race_id: 10,
//     lap_time: 1128775,
//     lap_number: 0
