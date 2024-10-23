import Driver from "../entities/Driver.js";
import * as DriverService from "../services/DriverService.js";
import logger from "../utils/logger.js";

// Get all drivers
export const getAllDrivers = async (req, res) => {
  logger.info("DriverController.getAllDrivers()");
  try {
    const drivers = await DriverService.findAll();
    logger.success("DriverController | Got result: " + JSON.stringify(drivers));
    res.status(200).json(drivers);
  } catch (error) {
    logger.error(`DriverController.getAllDrivers() | Error: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get driver by ID
export const getDriverById = async (req, res) => {
  const { driverId } = req.params;
  logger.info(`DriverController.getDriverById(driverId:${driverId})`);
  try {
    const driver = await DriverService.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    logger.success(
      "DriverController | Got result: \n" + JSON.stringify(driver, null, 2)
    );
    res.status(200).json(driver);
  } catch (error) {
    logger.error(`DriverController.getDriverById() | Error: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
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
