import express from "express";
import * as RC from "../controllers/RaceController.js";
import { validateIsNumber } from "../middleware/ValidateIsNumber.js";

const router = express.Router();

router.get("/", RC.getAll);
router.get("/:raceId", validateIsNumber, RC.getRaceById);
router.get("/race-flags/:raceId", validateIsNumber, RC.getRaceFlags);
router.get("/:raceId/remainingtime", validateIsNumber, RC.getRemainingTime);
router.get("/upcomingraces", RC.getUpcomingRaces);
router.get("/currentrace", RC.getCurrentRace);
router.get("/next-race", RC.getNextRace);
router.get("/leader-board/:raceId", validateIsNumber, RC.getLeaderboard);
router.get("/reset-race/:raceId", RC.resetRace);

router.post("", RC.postRace);
router.post("/:raceId/drivers/:driverId", RC.postDriverToRace);

router.patch("/start-current-race/:raceId", RC.startCurrentRace);
router.patch("/:raceId/status", RC.updateRaceStatus);
router.patch("/:raceId/mode", RC.updateRaceMode);

router.delete("/:raceId/drivers/:driverId", RC.deleteDriverFromRace);
router.delete("/:raceId", validateIsNumber, RC.deleteRace);

export default router;
