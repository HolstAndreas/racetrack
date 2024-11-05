import express from "express";
import * as LapTimeController from "../controllers/LapTimeController.js";

const router = express.Router();

router.post("/", LapTimeController.postLapTime);
router.get("/race/:raceId", LapTimeController.getLapTimesByRace);
router.get("/driver/:driverId/", LapTimeController.getLapTimesByDriver);
router.get(
  "/race/:raceId/driver/:driverId",
  LapTimeController.getLapTimesByRaceAndDriver
);

export default router;
