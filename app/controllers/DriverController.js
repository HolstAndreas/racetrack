import Driver from "../entities/driver.js";

// Get all drivers
export const getAllDrivers = () => {
  res.send("getAllDrivers");
};

// Get driver by ID
export const getDriverById = (req, res) => {
  const { driverId } = req.params;
  res.send("getDriverById: ", driverId);
};

// Post by ID - vajalik üldse?
export const postDriver = () => {
  res.send("postDriver: Driver Posted");
};

export const postLapTimes = (req, res) => {
  const { raceId, drivers } = req.params;
  res.send("postLapTime: Race:driver: time");
};

// Patch by ID
export const patchDriverById = (req, res) => {
  const { driverId } = req.params;
  res.send("patchDriverById: Driver Patched");
};

// DELETE by ID

export const deleteDriverById = (req, res) => {
  const { driverId } = req.params;
  res.send("deleteDriverById: Driver deleted");
};
