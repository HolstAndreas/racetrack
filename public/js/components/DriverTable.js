export function createDriverTable(elementId) {
  const driversContainer = document.createElement("div");
  driversContainer.id = elementId; //drivers-table

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

  return driversContainer;
}
