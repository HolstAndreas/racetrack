import * as LapTimeRepository from "../repositories/LapTimeRepository.js";
import * as RaceRepository from "../repositories/RaceRepository.js";
import * as DriverRepository from "../repositories/DriverRepository.js";
import logger from "../utils/logger.js";

export const postLapTime = async (driverId, raceId, lapTime, lapNumber) => {
  logger.info(
    `LapTimeService.recordLapTime(driverId:${driverId}, raceId:${raceId}, lapTime:${lapTime}, lapNumber:${lapNumber})`
  );

  try {
    // Validate race exists
    const raceExists = await RaceRepository.checkRaceExists(raceId);
    if (!raceExists) {
      return { error: "RACE_NOT_FOUND" };
    }

    // Validate driver exists
    const driverExists = await DriverRepository.checkDriverExists(driverId);
    if (!driverExists) {
      return { error: "DRIVER_NOT_FOUND" };
    }

    // Get last lap number to ensure sequence
    const lastLapNumber = await LapTimeRepository.getLastLapNumber(
      driverId,
      raceId
    );
    if (lapNumber !== lastLapNumber + 1) {
      return { error: "INVALID_LAP_SEQUENCE" };
    }

    const result = await LapTimeRepository.insertLapTime(
      driverId,
      raceId,
      lapTime,
      lapNumber
    );
    return result;
  } catch (err) {
    if (err.constraint === "lap_times_driver_id_race_id_lap_number_key") {
      return { error: "DUPLICATE_LAP_NUMBER" };
    }
    throw err;
  }
};

export const getLapTimesByRace = async (raceId) => {
  logger.info(`LapTimeService.getLapTimesByRace(raceId:${raceId})`);
  return await LapTimeRepository.getLapTimesByRace(raceId);
};

export const getLapTimesByDriver = async (driverId) => {
  logger.info(`LapTimeService.getLapTimesByDriver(driverId:${driverId})`);
  return await LapTimeRepository.getLapTimesByDriver(driverId);
};

export const getFastestLapByRace = async (raceId) => {
  logger.info(`LapTimeService.getFastestLapByRace(raceId:${raceId})`);
  return await LapTimeRepository.getFastestLapByRace(raceId);
};

export const getFastestLapByDriver = async (driverId, raceId) => {
  logger.info(
    `LapTimeService.getFastestLapByDriver(driverId:${driverId}, raceId:${raceId})`
  );
  return await LapTimeRepository.getFastestLapByDriver(driverId, raceId);
};

export const getLapTimesByDriverAndRace = async (driverId, raceId) => {
    logger.info(`LapTimeService.getLapTimesByDriverAndRace(driverId:${driverId}, raceId:${raceId})`);
    return await LapTimeRepository.getLapTimesByDriverAndRace(driverId, raceId);
};
