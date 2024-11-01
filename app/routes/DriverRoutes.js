import express from "express";
import * as DC from "../controllers/DriverController.js";

const router = express.Router();

router.get("/", DC.getAllDrivers);
router.get("/:driverId", DC.getDriverById);
router.post("/:driverId/assign-car/:carId", DC.assignCarToDriver);
router.post("", DC.postDriver);
router.patch("/:driverId", DC.patchDriverById);
router.delete("/:driverId", DC.deleteDriverById);

export default router;
