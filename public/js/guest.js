export const updateLeaderBoard = async (race) => {
    const tbody = document.querySelector("#leaderboard tbody");
    const currentPositions = {};

    // Map driver IDs to their current positions
    for (let i = 1; i <= 8; i++) {
        const driverElement = document.querySelector(`#driver-${i}-driver`);
        if (driverElement) {
            const driverId = driverElement.getAttribute("data-driver-id");
            if (driverId) {
                currentPositions[driverId] = i;
            }
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
            if (fastestDriver) {
                newDriverLaps.push({
                    id: fastestDriver.id,
                    name: fastestDriver.name,
                    car: fastestDriver.car,
                    lapTime: formatLapTime(lap.lap_time),
                    lapNumber: lap.lap_number,
                });
            }
        }
    });

    // Array to hold promises for animations
    const animationPromises = [];

    newDriverLaps.forEach((driver, index) => {
        const newPos = index + 1;
        const oldPos = currentPositions[driver.id];

        if (oldPos && oldPos !== newPos) {
            // Create a promise that resolves after the animation completes
            const animationPromise = new Promise((resolve) => {
                animatePositionChange(oldPos, newPos, resolve);
            });
            animationPromises.push(animationPromise);
        }
    });

    // Wait for all animations to complete before updating the DOM
    Promise.all(animationPromises)
        .then(() => {
            // First, hide all existing rows
            for (let i = 1; i <= 8; i++) {
                const row = document.getElementById(`driver-${i}`);
                if (row) {
                    row.style.display = "none";
                }
            }

            // Then show and update only rows with drivers
            newDriverLaps.forEach((driver, index) => {
                const newPos = index + 1;
                const row = document.getElementById(`driver-${newPos}`);
                if (row) {
                    row.style.display = "";
                    row.setAttribute("data-driver-id", driver.id);
                    row.innerHTML = `
                    <td><span id="driver-${newPos}-position">${newPos}</span></td>
                    <td><span id="driver-${newPos}-car">${driver.car}</span></td>
                    <td><span id="driver-${newPos}-driver" data-driver-id="${driver.id}">${driver.name}</span></td>
                    <td><span id="driver-${newPos}-lap-number">${driver.lapNumber}</span></td>
                    <td><span id="driver-${newPos}-fastest-lap-time">${driver.lapTime}</span></td>
                `;
                }
            });
        })
        .catch((error) => {
            console.error("Animation promises failed:", error);
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

const animatePositionChange = (fromPosition, toPosition, callback) => {
    const tbody = document.querySelector("#leaderboard tbody");
    const row1 = document.getElementById(`driver-${fromPosition}`);
    const row2 = document.getElementById(`driver-${toPosition}`);

    if (!row1 || !row2) {
        callback();
        return;
    }

    const rect1 = row1.getBoundingClientRect();
    const rect2 = row2.getBoundingClientRect();
    const distance = rect2.top - rect1.top;

    // Add blur and transition effect
    row1.classList.add("position-changing");
    row2.classList.add("position-changing");

    // Trigger reflow to ensure the browser acknowledges the class addition
    void row1.offsetWidth; // Trigger reflow
    void row2.offsetWidth;

    // Animate
    row1.style.transform = `translateY(${distance}px)`;
    row2.style.transform = `translateY(${-distance}px)`;

    // Listen for the transition to end
    const transitionsToListen = 2;
    let transitionsCompleted = 0;

    const transitionEndHandler = () => {
        transitionsCompleted += 1;
        if (transitionsCompleted === transitionsToListen) {
            // Reset styles
            row1.style.transform = "";
            row2.style.transform = "";
            row1.classList.remove("position-changing");
            row2.classList.remove("position-changing");

            // Remove event listeners
            row1.removeEventListener("transitionend", transitionEndHandler);
            row2.removeEventListener("transitionend", transitionEndHandler);

            // Resolve the promise to continue with DOM updates
            callback();
        }
    };

    row1.addEventListener("transitionend", transitionEndHandler);
    row2.addEventListener("transitionend", transitionEndHandler);
};

let updateTimeout;
const DEBOUNCE_DELAY = 500; // milliseconds

const handleLapTimeUpdate = (race) => {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updateLeaderBoard(race);
    }, DEBOUNCE_DELAY);
};
