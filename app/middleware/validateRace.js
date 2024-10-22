// import { appendFile } from "fs";

// const validateRace = (req, res, next) => {
//   const { name, drivers } = req.body;
//   if (!name || !drivers || drivers.length === 0) {
//     return res.status(400).json({ error: "Invalid race data" });
//   }
//   RaceController.addRace(req);
// };

// app.post("/race-session", validateRace, raceController.postRace);
