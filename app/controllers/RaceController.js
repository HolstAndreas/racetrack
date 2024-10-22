import Race from "../entities/Race.js";
import * as RaceService from "../services/RaceService.js";
import logger from "../utils/logger.js";

// GET race by ID
export const getRaceById = async (req, res) => {
  const { raceId } = req.params;
  logger.info("RaceController - getRaceById: " + raceId);
  const race = await RaceService.findById(raceId); // Fetches a race by ID
  // res.render("races", { race }); // Render "races" view with race data.
  logger.success(
    "RaceController - Got result: \n" + JSON.stringify(race, null, 2)
  );
  res.status(200).json(race);
  // /api/race-sessions/1
};

export const getLeaderboard = (req, res) => {
  const { raceId } = req.params;
  // try {
  //   const { race, sortedDrivers } = await raceService.getLeaderboardData(
  //     raceId
  //   );
  //   res.render("leader-board", { race, sortedDrivers });
  // } catch (error) {
  //   console.error("Error fetching leaderboard:", error);
  //   res.status(500).send("An error occured");
  // }
  res.send("getLeaderboard: " + raceId);
};

export const getNextRace = async (req, res) => {
  const { raceId } = req.params;
  logger.info("RaceController - getNextRace: " + raceId);
  const result = await RaceService.findNextRace(raceId); // Fetches a next race
  logger.success(
    "RaceController - Got result: \n" + JSON.stringify(result, null, 2)
  );
  if (result.length === 0) {
    res.status(404).send("No next race found.");
  } else {
    res.status(200).json(result);
  }
  // /next-race/
};

export const getRaceFlags = async (req, res) => {
  const { raceId } = req.params;
  logger.info("RaceController - getRaceFlags: " + raceId);
  const result = await RaceService.findModeById(raceId); // Fetches a race mode by ID
  logger.success(
    "RaceController - Got result: \n" + JSON.stringify(result, null, 2)
  );
  if (result.length === 0) {
    res.status(404).send("No race found.");
  } else {
    res.status(200).json(result);
  }
  // /race-flags/:raceId
};

export const getRemainingTime = async (req, res) => {
  const { raceId } = req.params;
  logger.info("RaceController - getRemainingTime: " + raceId);
  const result = await RaceService.findRemainingTimeById(raceId); // Fetches a race remaining time by ID
  logger.success(
    "RaceController - Got result: \n" + JSON.stringify(result, null, 2)
  );
  if (result.length === 0) {
    res.status(404).send("No race found.");
  } else {
    res.status(200).json(result);
  }
  // /race-flags/:raceId
};

// POST
export const postDriversInRace = (req, res) => {
  const { raceId, driverId } = req.params;
  res.send("postDriversInRace: " + raceId + driverId);
};

export const assignCarToDriver = (req, res) => {
  const { raceId } = req.params;
  res.send("assignCarToDriver: " + raceId);
};

export const postRace = () => {
  res.send("postRace: Race created.");
};

// PATCH
export const patchRaceById = (req, res) => {
  const { raceId } = req.params;
  res.send("patchRaceById: " + raceId);
};

// DELETE
export const deleteDriversInRace = (req, res) => {
  const { raceId } = req.params;
  res.send("deleteDriversInRace: " + raceId);
};
