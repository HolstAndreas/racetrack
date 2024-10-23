import Driver from "../entities/Driver.js";
import * as DriverService from "../services/DriverService.js";
import logger from "../utils/logger.js";

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
export const postDriver = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    logger.error("DriverController.postDriver() | Missing name");
    return res.status(400).send("Name is required");
  } else if (name.length < 3) {
    logger.error(
      "DriverController.postDriver() | Name must be at least 3 characters long"
    );
    return res.status(400).send("Name must be at least 3 characters long");
  }
  logger.info(`DriverController.postDriver(name:${name})`);
  const driver = await DriverService.createDriver(name);
  logger.success(
    `DriverController.postDriver() | Driver created: ${JSON.stringify(
      driver,
      null,
      2
    )}`
  );
  res.status(200).send(driver);
};

export const postLapTimes = (req, res) => {
  const { raceId, driverId, lapTime, lapNumber } = req.body;

  // Check if all required fields are present
  if (!raceId || !driverId || !lapTime || !lapNumber) {
    logger.error("DriverController.postLapTimes() | Missing required fields");
    return res.status(400).send("All fields are required");
  }

  // Check if all values are integers
  if (
    !Number.isInteger(raceId) ||
    !Number.isInteger(driverId) ||
    !Number.isInteger(lapTime) ||
    !Number.isInteger(lapNumber)
  ) {
    logger.error(
      "DriverController.postLapTimes() | All values must be integers"
    );
    return res.status(400).send("All values must be integers");
  }
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
