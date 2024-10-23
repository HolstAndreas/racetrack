import Race from "../entities/Race.js";
import * as RaceRepository from "../repositories/RaceRepository.js";
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
    const race = await RaceRepository.getRaceById(id);
    return race;
};

export const findModeById = async (id) => {
    logger.info("RaceService | findModeById: " + id);
    const mode = await RaceRepository.getRaceModeById(id);
    return mode;
};

export const findRemainingTimeById = async (id) => {
    logger.info("RaceService | findRemainingTimeById: " + id);
    const remainingTime = await RaceRepository.getRemainingTimeById(id);
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
    const lastRaceStarted = await RaceRepository.getCurrentRace();
    if (lastRaceStarted.remaining_time === 0) {
        return [];
    } else {
        return lastRaceStarted;
    }
};

export const findUpcomingRaces = async () => {
    logger.info("RaceService.findUpcomingRaces");
    const upcomingRaces = await RaceRepository.getUpcomingRaces();
    return upcomingRaces;
};

export const findNextRace = async (id) => {
    logger.info("RaceService.findNextRace(id:" + id + ")");
    const nextRace = await RaceRepository.getNextRace(id);
    return nextRace;
};

export const findDrivers = async () => {
    logger.info("RaceService.findDrivers()");
    const drivers = await RaceRepository.getDrivers();
    return drivers;
};

export const findDriversByCar = async (carId) => {
    logger.info("RaceService.findDriversByCar()");
    const drivers = await RaceRepository.getDriversByCar(carId);
    return drivers;
};

export const addRace = async (race) => {
    logger.info(`RaceService.addRace(race:${race.toString()})`);
    const result = await RaceRepository.insertRace(race);
    return result[0];
};

export const addDriverToRace = async (raceId, driverId) => {
    logger.info(
        `RaceService.addDriverToRace(raceId: ${raceId}, driverId: ${driverId})`
    );

    try {
        // check if race exists
        const raceExists = await RaceRepository.checkRaceExists(raceId);
        if (!raceExists) {
            logger.error(
                `RaceService.addDriverToRace() | Race ${raceId} not found `
            );
            return { error: "RACE_NOT_FOUND" };
        }

        // check if driver exists
        const driverExists = await RaceRepository.checkDriverExists(driverId);
        if (!driverExists) {
            logger.error(
                `RaceService.addDriverToRace() | Driver ${driverId} not found `
            );
            return { error: "DRIVER_NOT_FOUND" };
        }

        // get current drivers
        // { drivers: [ 1, 2, 3 ] }
        const drivers = await RaceRepository.getDriversByRace(raceId);

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
        const result = await RaceRepository.postDriverToRace(
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

export const removeDriverFromRace = async (raceId, driverId) => {
    logger.info(
        `RaceService.removeDriverFromRace(raceId: ${raceId}, driverId: ${driverId})`
    );

    try {
        // check if race exists
        const raceExists = await RaceRepository.checkRaceExists(raceId);
        if (!raceExists) {
            logger.error(
                `RaceService.removeDriverFromRace() | Race ${raceId} not found `
            );
            return { error: "RACE_NOT_FOUND" };
        }

        const drivers = await RaceRepository.getDriversByRace(raceId);

        // check if driver exists
        const driverExists = await RaceRepository.checkDriverExists(driverId);
        if (!driverExists) {
            logger.error(
                `RaceService.removeDriverFromRace() | Driver ${driverId} not found `
            );
            return { error: "DRIVER_NOT_FOUND" };
        }

        // Check got drivers
        if (!drivers) {
            logger.error(
                `RaceService.removeDriverFromRace() | No drivers for race ${raceId}`
            );
            return { error: "RACE_DATA_NOT_FOUND" };
        }

        // Convert driverId to number for comparison
        const driverIdNum = Number(driverId);

        // check if driver is not in race
        if (!drivers[0].drivers.includes(driverIdNum)) {
            logger.error(
                `RaceService.removeDriverFromRace() | Driver ${driverId} is not in race ${raceId}`
            );
            return { error: "DRIVER_NOT_IN_RACE" };
        }

        // Remove driver
        const newDrivers = drivers[0].drivers.filter(
            (id) => id !== driverIdNum
        );
        const result = await RaceRepository.postDriverToRace(
            raceId,
            newDrivers
        );

        // Return new drivers
        return result[0];
    } catch (err) {
        logger.error(`RaceService.removeDriverFromRace() | Error: ${err}`);
        return { error: "UNKNOWN_ERROR" };
    }
};
