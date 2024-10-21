import Race from "../entities.race.js";

export const getLeaderboardData = async (raceId) => {
  const race = await Race.findById(raceId).populate("drivers");

  if (!race) {
    throw new Error("Race not found");
  }

  const sortedDrivers = race.drivers.sort(
    (a, b) => a.fastestLap - b.fastestLap
  );

  return { race, sortedDrivers };
};
