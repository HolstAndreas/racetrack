import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { fileURLToPath } from "url"; // converts a file URL into an actual filepath - in ES Node.js does not provide built-in __filename or __dirname...
import path from "path"; // Provides ulities for working with file and directory paths.

const __filename = fileURLToPath(import.meta.url); // Converts current URL of the module into a filepath using...
const __dirname = path.dirname(__filename); // Directory name where __filepath is full path. Useful for relative path in relation to current dir.

const router = express.Router();

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/login.html"));
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.sendFile(path.join(__dirname, "../../public/goodbye.html"));
});

router.get("/goodbye", (req, res) => {
  res.clearCookie("token");
  res.sendFile(path.join(__dirname, "../../public/goodbye.html"));
});

router.get("/401", (req, res) => {
  res.clearCookie("token");
  res.sendFile(path.join(__dirname, "../../public/401.html"));
});

router.get("/403", (req, res) => {
  res.clearCookie("token");
  res.sendFile(path.join(__dirname, "../../public/403.html"));
});

// Protected Routes
router.get("/front-desk", authMiddleware("receptionist"), function (req, res) {
  res.sendFile(path.join(__dirname, "../../public/front-desk.html"));
});

router.get("/lap-line-tracker", authMiddleware("observer"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/lap-line-tracker.html"));
});

router.get("/race-control", authMiddleware("safety"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/race-control.html"));
});

// Guest Routes
router.get("/leader-board", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/leader-board.html"));
});

router.get("/race-flags", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/race-flags.html"));
});
router.get("/next-race", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/next-race.html"));
});
router.get("/race-countdown", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/race-countdown.html"));
});

export default router;
