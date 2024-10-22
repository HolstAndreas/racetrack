import Race from "../entities/Race.js";
import * as retrieveData from "../utils/retrieveData.js";
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
  logger.info("RaceService - findById: " + id);
  const race = await retrieveData.getRaceById(id);
  return race;
};

export const findModeById = async (id) => {
  logger.info("RaceService - findModeById: " + id);
  const mode = await retrieveData.getRaceModeById(id);
  return mode;
};

export const findRemainingTimeById = async (id) => {
  logger.info("RaceService - findRemainingTimeById: " + id);
  const remainingTime = await retrieveData.getRemainingTimeById(id);
  return remainingTime;
};

export const findNextRace = async (id) => {
  logger.info("RaceService - findNextRace");
  const nextRace = await retrieveData.getNextRace(id);
  return nextRace;
};
