import Race from "../entities/Race.js";

// GET race by ID
export const getRaceById = (req, res) => {
  const { raceId } = req.params;
  // const race = raceService.findById(raceId); // Fetches a race by ID
  // res.render("races", { race }); // Render "races" view with race data.
  res.send("getRaceById: " + raceId);
  // /api/race-sessions/1
};

export const getLeaderboard = async (req, res) => {
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
  res.send("getLeaderboard: ", +raceId);
};

export const getNextRace = () => {
  // TODO:
  // Get next race
  res.send("The next race is: _");
};

export const getRaceFlags = (req, res) => {
  // const { raceId } = req.params;
  res.send("MODE: HAZARD");
};

export const getRaceCountdown = (req, res) => {
  const { raceId } = req.params;
  res.send("getRaceCountdown: ", raceId);
};

// POST
export const postDriversInRace = (req, res) => {
  const { raceId, drivers } = req.params;
  res.send("postDriversInRace: ", raceId, drivers);
};

// PATCH
export const patchRaceById = (req, res) => {
  const { raceId } = req.params;
  res.send("patchRaceById: ", raceId);
};

// DELETE
export const deleteDriversInRace = (req, res) => {
  const { raceId } = req.params;
  res.send("deleteDriversInRace: ", raceId);
};

export const assignCarToDriver = (req, res) => {
  const { raceId } = req.params;
  res.send("assignCarToDriver: ", raceId);
};
