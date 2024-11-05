import express from "express";
import RaceRoutes from "./RaceRoutes.js";
import DriverRoutes from "./DriverRoutes.js";
import LapTimeRoutes from "./LapTimeRoutes.js";
import PageRoutes from "./PageRoutes.js";
import authRouter from "../utils/authentication.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

router.use("/", PageRoutes);
router.use("/authenticate", authRouter);
router.use("/api/race-sessions", RaceRoutes);
router.use("/api/drivers", DriverRoutes);
router.use("/api/laptimes", LapTimeRoutes);

router.use(errorHandler);

export default router;
