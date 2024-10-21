import Race from "../entities/race.js";

// GET race by ID
export const getRaceById = (req, res) => {
  const { raceId } = req.params;
  const race = Race.findById(raceId); // Fetches a race by ID
  res.render("races", { race }); // Render "races" view with race data.
};
