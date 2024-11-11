import * as DriverRepository from "../repositories/DriverRepository.js";
import logger from "../utils/logger.js";
import { io } from "../../app.js";
import * as RaceService from "../services/RaceService.js";

export const checkDriverRacing = async (id) => {
  const currentRace = await RaceService.findCurrentRace();
  if (currentRace.length > 0) {
    return (
      currentRace[0].status === "STARTED" &&
      typeof currentRace[0].drivers.find(
        (driver) => driver.id === parseInt(id)
      ) !== "undefined"
    )
  }
  return false;
};

export const createDriver = async (name) => {
  logger.info(`DriverService.createDriver(name:${name})`);
  try {
    const driver = await DriverRepository.findByName(name);
    if (driver.length > 0) {
      return { error: "DRIVER_ALREADY_EXISTS" };
    }

    const res = await DriverRepository.insertDriver(name);
    io.emit("driversUpdate");
    const upcomingRaces = await RaceService.findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
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

    // Check if driver in race
    const driverRacing = await checkDriverRacing(driverId);
    if (driverRacing) {
      return { error: "DRIVER_RACING" };
    }

    // Check if any other driver has this car
    const carDrivers = await DriverRepository.getDriversByCar(carId);
    if (carDrivers.length > 0) {
      return { error: "CAR_TAKEN_BY", id: carDrivers[0].id };
    }

    const result = await DriverRepository.postCarToDriver(driverId, carId);
    io.emit("driversUpdate");
    const upcomingRaces = await RaceService.findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
    return result[0];
  } catch (err) {
    logger.error(`DriverService.assignCarToDriver() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const updateDriver = async (driverId, name) => {
  logger.info(`DriverService.updateDriver(driverId:${driverId}, name:${name})`);
  // Check if muhamed exists
  const driverSameName = await DriverRepository.findByName(name);
  if (driverSameName.length > 0) {
    return { error: "DRIVER_ALREADY_EXISTS" };
  }

  // Check if driver in race
  const driverRacing = await checkDriverRacing(driverId);
  if (driverRacing) {
    return { error: "DRIVER_RACING" };
  }
  try {
    const updatedDriver = await DriverRepository.updateDriverName(
      driverId,
      name
    );
    io.emit("driversUpdate");
    const upcomingRaces = await RaceService.findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
    return updatedDriver;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const deleteDriver = async (driverId) => {
  logger.info(`DriverService.deleteDriver(driverId:${driverId})`);
  // Check if driver in race
  const driverRacing = await checkDriverRacing(driverId);
  if (driverRacing) {
    return { error: "DRIVER_RACING" };
  }
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
    io.emit("driversUpdate");
    const upcomingRaces = await RaceService.findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
    return deleted;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
