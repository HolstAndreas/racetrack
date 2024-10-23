import Race from "../entities/Race.js";
import * as retrieveData from "../utils/retrieveData.js";
import * as insertData from "../utils/insertData.js";
import logger from "../utils/logger.js";

// export const getLeaderboardData = async (raceId) => {
//   const race = await Race.findById(raceId).populate("drivers");

//   if (!race) {
//     throw new Error("Race not found");
//   }

//   const sortedDrivers = race.drivers.sort(
//     (a, b) => a.fastestLap - b.fastestLap
//   );

//   return { race, sortedDrivers };
// };

export const findById = async (id) => {
  logger.info("RaceService | findById: " + id);
  const race = await retrieveData.getRaceById(id);
  return race;
};

export const findModeById = async (id) => {
  logger.info("RaceService | findModeById: " + id);
  const mode = await retrieveData.getRaceModeById(id);
  return mode;
};

export const findRemainingTimeById = async (id) => {
  logger.info("RaceService | findRemainingTimeById: " + id);
  const remainingTime = await retrieveData.getRemainingTimeById(id);
  return remainingTime;
};

export const createRaceList = async () => {
  logger.info("RaceService.createRaceList");
  const currentRace = await findCurrentRace();
  const upcomingRaces = await findUpcomingRaces();
  const raceList = currentRace.concat(upcomingRaces);
  return raceList;
};

export const findCurrentRace = async () => {
  logger.info("RaceService.findCurrentRace: ");
  const lastRaceStarted = await retrieveData.getCurrentRace();
  if (lastRaceStarted.remaining_time === 0) {
    return [];
  } else {
    return lastRaceStarted;
  }
};

export const findUpcomingRaces = async () => {
  logger.info("RaceService.findUpcomingRaces");
  const upcomingRaces = await retrieveData.getUpcomingRaces();
  return upcomingRaces;
};

export const findNextRace = async (id) => {
  logger.info("RaceService.findNextRace(id:" + id + ")");
  const nextRace = await retrieveData.getNextRace(id);
  return nextRace;
};

export const findDrivers = async () => {
  logger.info("RaceService.findDrivers()");
  const drivers = await retrieveData.getDrivers();
  return drivers;
};

export const findDriversByCar = async (carId) => {
  logger.info("RaceService.findDriversByCar()");
  const drivers = await retrieveData.getDriversByCar(carId);
  return drivers;
};

export const addRace = async (race) => {
  logger.info(`RaceService.addRace(race:${race.toString()})`);
  const result = await insertData.insertRace(race);
  return result[0];
};

export const addDriverToRace = async (raceId, driverId) => {
  logger.info(
    `RaceService.addDriverToRace(raceId: ${raceId}, driverId: ${driverId})`
  );

  try {
    // check if race exists
    const raceExists = await retrieveData.checkRaceExists(raceId);
    if (!raceExists) {
      logger.error(`RaceService.addDriverToRace() | Race ${raceId} not found `);
      return { error: "RACE_NOT_FOUND" };
    }

    // check if driver exists
    const driverExists = await retrieveData.checkDriverExists(driverId);
    if (!driverExists) {
      logger.error(
        `RaceService.addDriverToRace() | Driver ${driverId} not found `
      );
      return { error: "DRIVER_NOT_FOUND" };
    }

    // get current drivers
    // { drivers: [ 1, 2, 3 ] }
    const drivers = await retrieveData.getDriversByRace(raceId);

    // Check got drivers
    if (!drivers) {
      logger.error(
        `RaceService.addDriverToRace() | No drivers for race ${raceId}`
      );
      return { error: "RACE_DATA_NOT_FOUND" };
    }

    // check if driver already in race
    if (drivers[0].drivers.includes(Number(driverId))) {
      logger.error(
        `RaceService.addDriverToRace() | Driver ${driverId} already in race ${raceId}`
      );
      return { error: "DRIVER_ALREADY_IN_RACE" };
    }

    // Add driver
    drivers[0].drivers.push(driverId);
    const result = await insertData.postDriverToRace(
      raceId,
      drivers[0].drivers
    );

    // Return new drivers
    return result[0];
  } catch (err) {
    logger.error(`RaceService.addDriverToRace() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const assignCarToDriver = async (driverId, carId) => {
  logger.info(
    `RaceService.assignCarToDriver(driverId: ${driverId}, carId: ${carId})`
  );
  try {
    // Check if driver exists
    const driverExists = await retrieveData.checkDriverExists(driverId);
    if (!driverExists) {
      logger.error(
        `RaceService.assignCarToDriver() | Driver ${driverId} not found `
      );
      return { error: "DRIVER_NOT_FOUND" };
    }

    // Check if any other driver has this car
    const carDrivers = await findDriversByCar(carId);
    if (carDrivers.length > 0) {
      console.log(carDrivers[0].id);
      return { error: "CAR_TAKEN_BY", id: carDrivers[0].id };
    }

    const result = await insertData.postCarToDriver(driverId, carId);
    return result[0];
  } catch (err) {
    logger.error(`RaceService.assignCarToDriver() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};

export const removeDriverFromRace = async (raceId, driverId) => {
  logger.info(
    `RaceService.removeDriverFromRace(raceId: ${raceId}, driverId: ${driverId})`
  );

  try {
    // check if race exists
    const raceExists = await retrieveData.checkRaceExists(raceId);
    if (!raceExists) {
      logger.error(
        `RaceService.removeDriverFromRace() | Race ${raceId} not found `
      );
      return { error: "RACE_NOT_FOUND" };
    }

    const drivers = await retrieveData.getDriversByRace(raceId);

    // check if driver exists
    const driverExists = await retrieveData.checkDriverExists(driverId);
    if (!driverExists) {
      logger.error(
        `RaceService.removeDriverFromRace() | Driver ${driverId} not found `
      );
      return { error: "DRIVER_NOT_FOUND" };
    }

    // Check got drivers
    if (!drivers) {
      logger.error(
        `RaceService.addDriverToRace() | No drivers for race ${raceId}`
      );
      return { error: "RACE_DATA_NOT_FOUND" };
    }

    // check if driver is not in race
    if (!drivers[0].drivers.includes(Number(driverId))) {
      logger.error(
        `RaceService.addDriverToRace() | Driver ${driverId} is not in race ${raceId}`
      );
      return { error: "DRIVER_NOT_IN_RACE" };
    }

    // Remove driver
    const index = drivers[0].drivers.indexOf(driverId);
    const newArr = drivers[0].drivers.splice(index, 1);
    const result = await insertData.postDriverToRace(
      raceId,
      drivers[0].drivers
    );

    // Return new drivers
    return result[0];
  } catch (err) {
    logger.error(`RaceService.removeDriverFromRace() | Error: ${err}`);
    return { error: "UNKNOWN_ERROR" };
  }
};
