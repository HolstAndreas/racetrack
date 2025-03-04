import * as RaceRepository from "../repositories/RaceRepository.js";
import logger from "../utils/logger.js";
import { io, startRaceTimer } from "../../app.js";
import * as LapTimeService from "../services/LapTimeService.js";

export const findAll = async () => {
  logger.info(`findAll()`);
  const races = await RaceRepository.findAll();
  return races;
};

export const findById = async (id) => {
  logger.info(`findById(id:${id})`);
  const race = await RaceRepository.getRaceById(id);
  return race;
};

export const getLeaderBoard = async (id) => {
  logger.info(`RaceService.getLeaderBoard(id:${id})`);
  const leaderboard = await RaceRepository.getLeaderboard(id);
  return leaderboard;
};

export const findModeById = async (id) => {
  logger.info(`findModeById(id:${id})`);
  const mode = await RaceRepository.getRaceModeById(id);
  return mode;
};

export const findRemainingTimeById = async (id) => {
  logger.info(`findRemainingTimeById(id:${id})`);
  const remainingTime = await RaceRepository.getRemainingTimeById(id);
  return remainingTime;
};

export const findUpcomingRaces = async () => {
  logger.info(`findUpcomingRaces()`);
  const upcomingRaces = await RaceRepository.getUpcomingRaces();
  return upcomingRaces;
};

export const findCurrentRace = async () => {
  logger.info(`findCurrentRace()`);
  const lastRaceStarted = await RaceRepository.getCurrentRace();

  if (lastRaceStarted.length > 1) {
    logger.error("Unexpected error: multiple races have status 'STARTED'");
  } else if (lastRaceStarted.length === 0) {
    const nextRace = await findNextRace();
    if (nextRace.length === 0) return [];
    return nextRace;
  } else {
    return lastRaceStarted;
  }
};

export const findNextRace = async () => {
  logger.info(`findNextRace()`);
  const nextRace = await RaceRepository.getNextRace();
  return nextRace;
};

export const findLastFinishedRace = async () => {
  logger.info(`findLastFinishedRace()`);
  try {
    const lastRace = await RaceRepository.getLastFinishedRace();
    return lastRace;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const findDrivers = async () => {
  logger.info("findDrivers()");
  const drivers = await RaceRepository.getDrivers();
  return drivers;
};

export const findDriversByCar = async (carId) => {
  logger.info("findDriversByCar()");
  const drivers = await RaceRepository.getDriversByCar(carId);
  return drivers;
};

export const getMode = async () => {
  logger.info(`RaceService.getMode`);
  try {
    const mode = await RaceRepository.getMode();
    return mode;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const setMode = async (mode) => {
  logger.info(`RaceService.setMode(mode:${mode})`);
  try {
    const updatedMode = await RaceRepository.updateMode(mode);
    // Emit the global mode update to all connected clients
    io.emit("modeUpdate", updatedMode.mode);
    return updatedMode;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const addRace = async (drivers) => {
  logger.info(`RaceService.addRace(drivers:${drivers.toString()})`);

  try {
    for (const DriverId of drivers) {
      const driverExists = await RaceRepository.checkDriverExists(DriverId);
      if (!driverExists) {
        logger.error(`RaceService.addRace() | Driver ${DriverId} not found `);
        return { error: "DRIVER_NOT_FOUND", driver: DriverId };
      }
    }
    const currentRace = await findCurrentRace();
    const result = await RaceRepository.insertRace(drivers);
    if (currentRace.length === 0) {
      io.emit("raceUpdate", result);
    }

    const upcomingRaces = await findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
    return result[0];
  } catch (err) {
    logger.error(`RaceService.addRace() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const startCurrentRace = async (raceId) => {
  logger.info(`RaceService.startCurrentRace(raceId:${raceId})`);

  // Check if race has drivers
  const drivers = await RaceRepository.getDriversByRace(raceId);
  if (!drivers[0].drivers || drivers[0].drivers.length === 0) {
    logger.error(
      `RaceService.startCurrentRace() | No drivers in race ${raceId}`
    );
    return { error: "NO_DRIVERS_IN_RACE" };
  }

  await setMode("SAFE"); //await RaceService.setMode("SAFE");
  const result = await RaceRepository.updateTimeStamp(raceId);
  return result[0];
};

export const updateRaceStatus = async (raceId, status) => {
  logger.info(
    `RaceService.updateRaceStatus(raceId:${raceId}, status:${status})`
  );
  try {
    const raceExists = await RaceRepository.checkRaceExists(raceId);
    if (!raceExists) {
      return { error: "RACE_NOT_FOUND" };
    }
    if (status !== "WAITING") {
      const driversHaveCars = await RaceRepository.checkDriversHaveCars(raceId);
      if (!driversHaveCars) {
        return { error: "DRIVER_UNASSIGNED_CAR" };
      }
    }
    if (status === "FINISHED") {
      await setMode("DANGER");
    }
    const result = await RaceRepository.updateRaceStatus(raceId, status);
    if (status === "STARTED") {
      await RaceRepository.updateTimeStamp(raceId);
      await setMode("SAFE");
      startRaceTimer();
    }
    const updatedRace = await findCurrentRace();
    io.emit("raceUpdate", updatedRace);

    const upcomingRaces = await findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
    if (status === "FINISHED") {
      const lastRace = await findLastFinishedRace();
      if (lastRace.length > 0) {
        const lastRaceLapTimes = await LapTimeService.getLapTimesByRace(
          lastRace[0].id
        );
        lastRace[0].lap_times = lastRaceLapTimes;
        io.emit("lastRaceUpdate", lastRace[0]);
      }
      if (upcomingRaces.length > 0) {
        return upcomingRaces[0];
      } else {
        return [];
      }
    }

    const lastRace = await findLastFinishedRace();
    if (lastRace.length > 0) {
      const lastRaceLapTimes = await LapTimeService.getLapTimesByRace(
        lastRace[0].id
      );
      lastRace[0].lap_times = lastRaceLapTimes;
      io.emit("lastRaceUpdate", lastRace[0]);
    }

    return result[0];
  } catch (err) {
    logger.error(`RaceService.updateRaceStatus() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const updateRemainingTime = async (raceId, remainingTime) => {
  // logger.info(
  // `RaceService.updateRemainingTime(raceId:${raceId}, remainingTime:${remainingTime})`
  // );
  try {
    const result = await RaceRepository.updateRemainingTime(
      raceId,
      remainingTime
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const addDriverToRace = async (raceId, driverId) => {
  logger.info(
    `RaceService.addDriverToRace(raceId: ${raceId}, driverId: ${driverId})`
  );

  try {
    // Check if race exists
    const raceExists = await RaceRepository.checkRaceExists(raceId);
    if (!raceExists) {
      logger.error(`RaceService.addDriverToRace() | Race ${raceId} not found `);
      return { error: "RACE_NOT_FOUND" };
    }

    // Check if driver exists
    const driverExists = await RaceRepository.checkDriverExists(driverId);
    if (!driverExists) {
      logger.error(
        `RaceService.addDriverToRace() | Driver ${driverId} not found `
      );
      return { error: "DRIVER_NOT_FOUND" };
    }

    // Get current drivers
    const drivers = await RaceRepository.getDriversByRace(raceId);

    // Check if drivers data exists
    if (!drivers) {
      logger.error(
        `RaceService.addDriverToRace() | No drivers for race ${raceId}`
      );
      return { error: "RACE_DATA_NOT_FOUND" };
    }

    if (drivers[0].drivers === null) {
      drivers[0].drivers = [];
    }
    // Check if driver already in race
    if (drivers[0].drivers.includes(Number(driverId))) {
      logger.error(
        `RaceService.addDriverToRace() | Driver ${driverId} already in race ${raceId}`
      );
      return { error: "DRIVER_ALREADY_IN_RACE" };
    }

    // Add driver

    drivers[0].drivers.push(Number(driverId));
    const result = await RaceRepository.postDriverToRace(
      raceId,
      drivers[0].drivers
    );
    const updatedRace = await findCurrentRace();
    io.emit("raceUpdate", updatedRace);

    const upcomingRaces = await findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
    // Return new drivers
    return result[0];
  } catch (err) {
    logger.error(`RaceService.addDriverToRace() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const removeDriverFromRace = async (raceId, driverId) => {
  logger.info(
    `RaceService.removeDriverFromRace(raceId: ${raceId}, driverId: ${driverId})`
  );

  try {
    // Check if race exists
    const raceExists = await RaceRepository.checkRaceExists(raceId);
    if (!raceExists) {
      logger.error(
        `RaceService.removeDriverFromRace() | Race ${raceId} not found `
      );
      return { error: "RACE_NOT_FOUND" };
    }

    const drivers = await RaceRepository.getDriversByRace(raceId);

    // Check if driver exists
    const driverExists = await RaceRepository.checkDriverExists(driverId);
    if (!driverExists) {
      logger.error(
        `RaceService.removeDriverFromRace() | Driver ${driverId} not found `
      );
      return { error: "DRIVER_NOT_FOUND" };
    }

    // Check if drivers data exists
    if (!drivers) {
      logger.error(
        `RaceService.removeDriverFromRace() | No drivers for race ${raceId}`
      );
      return { error: "RACE_DATA_NOT_FOUND" };
    }

    // Convert driverId to number for comparison
    const driverIdNum = Number(driverId);

    // Check if driver is not in race
    if (!drivers[0].drivers.includes(driverIdNum)) {
      logger.error(
        `RaceService.removeDriverFromRace() | Driver ${driverId} is not in race ${raceId}`
      );
      return { error: "DRIVER_NOT_IN_RACE" };
    }

    // Remove driver
    const newDrivers = drivers[0].drivers.filter((id) => id !== driverIdNum);
    const result = await RaceRepository.postDriverToRace(raceId, newDrivers);

    const upcomingRaces = await findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
    // Return new drivers
    return result[0];
  } catch (err) {
    logger.error(`RaceService.removeDriverFromRace() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const deleteRace = async (raceId) => {
  try {
    logger.info(`RaceService.deleteRace(raceId:${raceId})`);
    const result = await RaceRepository.deleteRace(raceId);

    const upcomingRaces = await findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);

    return result;
  } catch (error) {
    logger.error(`RaceService.deleteRace() | Error: ${error}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const resetRace = async (raceId) => {
  try {
    const result = await RaceRepository.resetRace(raceId);
    const updatedRace = await findCurrentRace();
    io.emit("raceUpdate", updatedRace);
    return result;
  } catch (error) {
    logger.error(`reset race | Error: ${error}`);
    return { error: "UNKNOWN_ERROR" };
  }
};
