import * as LapTimeService from "../services/LapTimeService.js";
import logger from "../utils/logger.js";

export const postLapTimes = (req, res) => {
  const { raceId, driverId, lapTime, lapNumber } = req.body;
  logger.info(
    `LapTimeController.postLapTimes(lapTime:${JSON.stringify(req.body)})`
  );

  // Check if all required fields are present
  if (!raceId) {
    logger.error("LapTimeController.postLapTimes() | Missing race ID");
    return res.status(400).send("Race ID is required");
  }
  if (!driverId) {
    logger.error("LapTimeController.postLapTimes() | Missing driver ID");
    return res.status(400).send("Driver ID is required");
  }
  if (!lapTime) {
    logger.error("LapTimeController.postLapTimes() | Missing lap time");
    return res.status(400).send("Lap time is required");
  }
  if (!lapNumber) {
    logger.error("LapTimeController.postLapTimes() | Missing lap number");
    return res.status(400).send("Lap number is required");
  }

  // Check if all values are integers
  if (
    !Number.isInteger(raceId) ||
    !Number.isInteger(driverId) ||
    !Number.isInteger(lapTime) ||
    !Number.isInteger(lapNumber)
  ) {
    logger.error(
      "LapTimeController.postLapTimes() | All values must be integers"
    );
    return res.status(400).send("All values must be integers");
  }

  const result = LapTimeService.postLapTime(
    driverId,
    raceId,
    lapTime,
    lapNumber
  );
  return res.status(200).json(result);
};

export const getLapTimesByRace = async (req, res) => {
  const raceId = req.params.raceId;
  const fastest = req.query.fastest === "true"; // /api/laptimes/race/:raceId?fastest=true
  logger.info(`getLapTimesByDriver: raceId: ${raceId}, fastest: ${fastest}`);
  if (fastest) {
    const fastestLapTime = await getFastestLapTime(raceId);
    return res.status(200).json(fastestLapTime);
  } else {
    const lapTimes = await LapTimeService.getLapTimesByRace(raceId);
    return res.status(200).json(lapTimes);
  }
};

export const getLapTimesByDriver = async (req, res) => {
  const { driverId, raceId } = req.params;
  const fastest = req.query.fastest;
  logger.info(
    `getLapTimesByDriver: driverId: ${driverId}, raceId: ${raceId}, fastest: ${fastest}`
  );
  if (fastest) {
    const fastestLapTime = await getFastestLapTimeDriver(driverId, raceId);
    return res.status(200).json(fastestLapTime);
  } else {
    const lapTimes = await getLapTimesDriver(driverId, raceId);
    return res.status(200).json(lapTimes);
  }
};

export const getFastestLapByDriver = async (req, res) => {
  return;
};
