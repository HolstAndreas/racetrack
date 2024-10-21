import Race from "../entities/race.js";

// Handle GET race by ID
export default getRaceById = (req, res) => {
  const race = Race.findById();
  res.render("races", { races });
};
