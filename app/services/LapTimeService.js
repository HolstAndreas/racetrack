import { io } from "../../app.js";
import * as LapTimeRepository from "../repositories/LapTimeRepository.js";
import * as RaceRepository from "../repositories/RaceRepository.js";
import logger from "../utils/logger.js";

export const postLapTime = async (driverId, timestamp) => {
  try {
    const currentRace = await RaceRepository.getCurrentRace();
    if (currentRace.length === 0) {
      logger.error(`Could not post laptime. No race has status 'STARTED'`);
      return;
    }
    const previousLapTimes = await LapTimeRepository.getLapTimesByDriverAndRace(
      driverId,
      currentRace[0].id
    );

    let lapTimeSum = 0;
    for (let i = 0; i < previousLapTimes.length; i++) {
      lapTimeSum += previousLapTimes[i].lap_time;
    }
    const currentLapTime =
      Date.parse(timestamp) -
      (Date.parse(currentRace[0].start_time) + lapTimeSum);
    logger.info(
      `LapTimeService.postLapTime(driverId:${driverId}, raceId:${currentRace[0].id}, lapTime:${currentLapTime}, lapNumber:${previousLapTimes.length})`
    );

    await LapTimeRepository.insertLapTime(
      driverId,
      currentRace[0].id,
      currentLapTime,
      previousLapTimes.length
    );
    const laps = await LapTimeRepository.getLapTimesByRace(currentRace[0].id);
    io.emit("lapUpdate", laps);
    return;
  } catch (err) {
    logger.error(err);
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
  logger.info(
    `LapTimeService.getLapTimesByDriverAndRace(driverId:${driverId}, raceId:${raceId})`
  );
  return await LapTimeRepository.getLapTimesByDriverAndRace(driverId, raceId);
};
