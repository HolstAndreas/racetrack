import * as DriverRepository from "../repositories/DriverRepository.js";
import logger from "../utils/logger.js";

export const createDriver = async (name) => {
  logger.info(`DriverService.createDriver(name:${name})`);
  try {
    const driver = await DriverRepository.findByName(name);
    if (driver.length > 0) {
      return { error: "DRIVER_ALREADY_EXISTS" };
    }

    const res = await DriverRepository.insertDriver(name);
    return res[0];
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const findById = async (id) => {
  logger.info(`DriverService.findById(id:${id})`);
  try {
    const driver = await DriverRepository.findById(id);

    // Check if driver exists and handle empty results
    if (!driver || driver.length === 0) {
      return null;
    }

    // Return the first driver object since we're querying by ID
    return driver[0];
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const findAll = async () => {
  logger.info(`DriverService.findAll()`);
  try {
    const res = await DriverRepository.findAll();
    return res;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const assignCarToDriver = async (driverId, carId) => {
  logger.info(
    `DriverService.assignCarToDriver(driverId: ${driverId}, carId: ${carId})`
  );
  try {
    // Check if driver exists
    const driverExists = await DriverRepository.checkDriverExists(driverId);
    if (!driverExists) {
      logger.error(
        `DriverService.assignCarToDriver() | Driver ${driverId} not found `
      );
      return { error: "DRIVER_NOT_FOUND" };
    }

    // Check if any other driver has this car
    const carDrivers = await DriverRepository.getDriversByCar(carId);
    if (carDrivers.length > 0) {
      return { error: "CAR_TAKEN_BY", id: carDrivers[0].id };
    }

    const result = await DriverRepository.postCarToDriver(driverId, carId);
    return result[0];
  } catch (err) {
    logger.error(`DriverService.assignCarToDriver() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const updateDriver = async (driverId, name) => {
  logger.info(`DriverService.updateDriver(driverId:${driverId}, name:${name})`);
  try {
    const updatedDriver = await DriverRepository.updateDriverName(
      driverId,
      name
    );
    return updatedDriver;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const deleteDriver = async (driverId) => {
  logger.info(`DriverService.deleteDriver(driverId:${driverId})`);
  try {
    // Check if driver exists
    const driverExists = await DriverRepository.checkDriverExists(driverId);
    if (!driverExists) {
      logger.error(
        `DriverService.assignCarToDriver() | Driver ${driverId} not found `
      );
      return { error: "DRIVER_NOT_FOUND" };
    }

    const deleted = await DriverRepository.deleteDriver(driverId);
    return deleted;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
