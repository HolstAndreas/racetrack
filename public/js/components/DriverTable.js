export function createDriverTable(elementId) {
    const driversContainer = document.createElement("div");
    driversContainer.id = elementId;

    // Create 8 driver rows
    for (let i = 0; i < 8; i++) {
        const driverRow = document.createElement("div");
        driverRow.id = `driver-row-${i}`;
        driverRow.className = "driver-row";

        // Add skeleton loader initially
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton";
        driverRow.appendChild(skeleton);

        driversContainer.appendChild(driverRow);
    }

    function updateDriverRow(index, driver) {
        const row = document.getElementById(`driver-row-${index}`);
        if (!row) return;

        // Clear existing content
        row.innerHTML = "";

        if (!driver.id) return;

        // Create driver number element
        const driverId = document.createElement("span");
        driverId.className = "driver-id";
        driverId.textContent = `#${driver.id}`;

        // Create driver name element
        const driverName = document.createElement("span");
        driverName.textContent = ` ${driver.name} `;

        // Create car element
        const driverCar = document.createElement("span");
        driverCar.className = "driver-car";
        driverCar.innerHTML = `${driver.car || ""} <i class="fa-solid fa-car${
            !driver.car ? " car-icon" : ""
        }"></i>`;

        // Append all elements
        row.appendChild(driverId);
        row.appendChild(driverName);
        row.appendChild(driverCar);
    }

    const socket = io();
    socket.on("raceUpdate", (raceData) => {
        // console.log(
        //     `%c DriverTable.js %c raceUpdate ${raceData[0]}`,
        //     "background: #222; color: #bada55;",
        //     "background: transparent; color: auto;"
        // );

        // Update each driver row with the race data
        for (let i = 0; i < 8; i++) {
            const driver = raceData[0].drivers[i] || {};
            updateDriverRow(i, driver);
        }
    });

    return driversContainer;
}
