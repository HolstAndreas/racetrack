// Imports everything necessary for app.js to function as an express instance.
import express from "express"; // Import express module - handles routing, middleware, HTTP requests, responses
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path"; // Provides ulities for working with file and directory paths.
import { fileURLToPath } from "url"; // converts a file URL into an actual filepath - in ES Node.js does not provide built-in __filename or __dirname...
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {
  getAll,
  getRaceById,
  getLeaderboard,
  getNextRace,
  getRaceFlags,
  getRemainingTime,
  postDriverToRace,
  postRace,
  deleteDriverFromRace,
  getUpcomingRaces,
  getCurrentRace,
} from "./app/controllers/RaceController.js"; // import all methods from RaceController.js
import {
  getAllDrivers,
  getDriverById,
  postDriver,
  patchDriverById,
  deleteDriverById,
  assignCarToDriver,
} from "./app/controllers/DriverController.js";
import {
  postLapTimes,
  getLapTimesByRace,
  getLapTimesByDriver,
  getLapTimesByRaceAndDriver,
} from "./app/controllers/LapTimeController.js";
import validateIsNumber from "./app/middleware/ValidateIsNumber.js";
import logger from "./app/utils/logger.js";
import authMiddleware from "./app/middleware/authMiddleware.js";
import authRouter from "./app/utils/authentication.js";

dotenv.config();

const requiredKeys = [
  "JWT_SECRET",
  "receptionist_key",
  "observer_key",
  "safety_key",
];

function checkEnvVariables() {
  const unsetEnv = requiredKeys.filter((key) => !process.env[key]);
  if (unsetEnv.length > 0) {
    console.error("Missing access key");
    process.exit(1);
  }
}

checkEnvVariables();
// console.log(process.env.JWT_SECRET);
// console.log(process.env.receptionist_key);
// console.log(process.env.observer_key);
// console.log(process.env.safety_key);

// Sets up Express
const app = express(); // app is now an instance of Express application.
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  logger.debug(`User connected: ${socket.id}`);

  socket.on("connectToRoom", (roomName) => {
    socket.join(roomName);
    logger.debug(`${socket.id} joined room: ${roomName}`);
    io.to(roomName).emit("newUserJoined", socket.id);
  });

  socket.on("changeMode", (mode) => {
    logger.info(`Socket mode in service: ${mode}`);
    io.emit("updatedRaceMode", mode);
  });

  socket.on("changeStatus", (status) => {
    logger.info(`Socket status in service: ${status}`);
    io.emit("updatedRaceStatus", status);
  });
});

// Middleware Configuration:
app.use(express.json()); // Parse JSON - adds middleware that parses JSON payloads - convert the body into a JS object available under req.body.
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data from form submissions, true == allows rich objects and arrays.
app.use(cookieParser()); // Parse cookies

// File and Directory Setup:
const __filename = fileURLToPath(import.meta.url); // Converts current URL of the module into a filepath using...
const __dirname = path.dirname(__filename); // Directory name where __filepath is full path. Useful for relative path in relation to current dir.
app.use(express.static("public"));

// Setting View Engine and Views Directory:
app.set("views", path.join(__dirname, "views")); // Express will look for views in the views folder located in the same dir as current file.
app.set("view engine", "ejs"); // Sets EJS as view engine.

// TODO:
// Authentication endpoint /authenticate

// Here should all defined routes be. (Endpoint, middleware, middleware, controller method)

app.get("/api/race-sessions/:raceId", validateIsNumber, getRaceById); // get a race by ID | DONE
app.get("/api/race-sessions/", getAll);
app.get("/api/leader-board/:raceId", validateIsNumber, getLeaderboard); // get leaderboard
app.get("/api/next-race/:raceId", validateIsNumber, getNextRace); // get next race | DONE
app.get("/api/race-flags/:raceId", validateIsNumber, getRaceFlags); // get race mode | DONE
app.get(
  "/api/race-sessions/:raceId/remainingtime",
  validateIsNumber,
  getRemainingTime
); // get race remaining time | DONE
app.get("/api/upcomingraces", getUpcomingRaces); // create a list of races, current + upcoming
app.get("/api/currentrace", getCurrentRace);

app.post("/api/race-sessions/:raceId/drivers/:driverId", postDriverToRace); // add driver to race | Done
app.post("/api/drivers/:driverId/assign-car/:carId", assignCarToDriver); // assign a car to driver | Done
app.post("/api/race-sessions", postRace); // add race | Done
app.post("/api/drivers", postDriver); // add driver | Done

app.delete(
  "/api/race-sessions/:raceId/drivers/:driverId",
  deleteDriverFromRace
); // delete driver from race | Done
// app.patch("/api/raceId/drivers/:driverId", patchRaceById); // edit driver from race

// Here are driver controllers
app.get("/api/drivers", getAllDrivers);
app.get("/api/drivers/:driverId", getDriverById);

app.post("/api/laptimes", postLapTimes); // Create new lap time | Done
app.get("/api/laptimes/race/:raceId", getLapTimesByRace); // Get all lap times for a race | Done
app.get("/api/laptimes/driver/:driverId/", getLapTimesByDriver); // Get all lap times for a driver in a specific race
app.get(
  "/api/laptimes/race/:raceId/driver/:driverId",
  getLapTimesByRaceAndDriver
); // Get all lap times for a driver in a specific race,

app.patch("/api/drivers/:driverId", patchDriverById);
app.delete("/api/drivers/:driverId", deleteDriverById);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use("/authenticate", authRouter);

// Login route
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully.");
});

// Protected routes
app.get("/front-desk", authMiddleware("receptionist"), function (req, res) {
  res.sendFile(path.join(__dirname, "public/front-desk.html"));
});

app.get("/lap-line-tracker", authMiddleware("observer"), (req, res) => {
  res.sendFile(path.join(__dirname, "public/lap-line-tracker.html"));
});

app.get("/race-control", authMiddleware("safety"), (req, res) => {
  res.sendFile(path.join(__dirname, "public/race-control.html"));
});

import errorHandler from "./app/middleware/errorHandler.js";

// Error handling middleware
app.use(errorHandler);

// Starts the server
const PORT = process.env.PORT || 3000; // Sets the port number, checks for environment variables, default is 3000.
httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`); // Start listening to requests at PORT
});

// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const port = process.env.PORT || 8080;
// app.get('/', function(req, res) {
//   res.sendfile('index.html');
// });
// io.on('connection', (socket) => {
//   console.log('user connected');
//   socket.on('disconnect', function () {
//     console.log('user disconnected');
//   });
// })
// server.listen(port, function() {
//   console.log(`Listening on port ${port}`);
// });

// <!DOCTYPE html>
// <html>
//    <head>
//       <title>Hello!</title>
//    </head>
//    <script src = "/socket.io/socket.io.js"></script>
//    <script>
//       const socket = io();
//    </script>
//    <body>Integrating Socket.io with Node.js and Express</body>
// </html>
