// Imports everything necessary for app.js to function as an express instance.
import express from "express"; // Import express module - handles routing, middleware, HTTP requests, responses
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path"; // Provides ulities for working with file and directory paths.
import { fileURLToPath } from "url"; // converts a file URL into an actual filepath - in ES Node.js does not provide built-in __filename or __dirname...
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import * as LapTimeService from "./app/services/LapTimeService.js";
import * as RaceService from "./app/services/RaceService.js";
import logger from "./app/utils/logger.js";
import routes from "./app/routes/index.js";
import errorHandler from "./app/middleware/errorHandler.js";
import { getCurrentRace } from "./app/repositories/RaceRepository.js";

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

// Sets up Express
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {});

let globalTimer = null;
let timerInterval = null;

io.on("connection", (socket) => {
  logger.debug(`User connected: ${socket.id}`);

  // Send initial timer value
  io.emit("timerUpdate", globalTimer || process.env.TIMER);

  const updateInitialRace = async () => {
    const race = await RaceService.findCurrentRace();
    io.emit("raceUpdate", race);

    const upcomingRaces = await RaceService.findUpcomingRaces();
    io.emit("upcomingRacesUpdate", upcomingRaces);
  };
  updateInitialRace();

  const updateInitialMode = async () => {
    const mode = await RaceService.getMode();
    io.emit("modeUpdate", mode);
  };
  updateInitialMode();

  const updateInitialLeaderBoard = async () => {
    const currentRace = await RaceService.findCurrentRace();
    if (currentRace) {
      const laps = await LapTimeService.getLapTimesByRace(currentRace[0].id);
      io.emit("lapUpdate", laps);
    } else {
      io.emit("lapUpdate", []);
    }
  };
  updateInitialLeaderBoard();

  socket.on("connectToRoom", (roomName) => {
    socket.join(roomName);
    logger.debug(`${socket.id} joined room: ${roomName}`);
    io.to(roomName).emit("newUserJoined", socket.id);
  });

  socket.on("startRace", async () => {
    const race = await RaceService.findCurrentRace();
    if (race.length > 0) {
      await startRaceTimer(race[0].id);
    }
  });

  socket.on("raceUpdated", async (raceId) => {
    // Get updated currentrace data
    const updatedRace = await RaceService.findById(raceId);
    io.emit("raceUpdate", updatedRace);
  });

  socket.on("registerLapTime", async ({ driverId, currentTimestamp }) => {
    await LapTimeService.postLapTime2(driverId, currentTimestamp);

    const currentRace = await RaceService.findCurrentRace();
    if (currentRace) {
      const laps = await LapTimeService.getLapTimesByRace(currentRace[0].id);
      io.emit("lapUpdate", laps);
    } else {
      io.emit("lapUpdate", []);
    }

    // TODO: EMIT LEADERBOARD UPDATE
  });

  socket.on("raceStarted", (raceId) => {
    logger.info(`Socket got the info that race started.`);
    io.emit("newRaceStarted", raceId);
  });

  socket.on("changeStatus", async (data) => {
    logger.info(`Socket status in service: ${data.status}`);
    try {
      await RaceService.updateRaceStatus(data.raceId, data.status);
      if (data.status === "STARTED") {
        io.emit("raceStarted", data.raceId);
      }
    } catch (err) {
      logger.error(`Error updating race status: ${err}`);
    }
  });
});

const startRaceTimer = async (raceId) => {
  // Clear any existing timer
  if (timerInterval) clearInterval(timerInterval);

  const race = await RaceService.findCurrentRace();
  if (race.length === 0) return;

  globalTimer = race[0].remaining_time || parseInt(process.env.TIMER);

  // MODE -> SAFE ON 'RACE START'
  await RaceService.setMode("SAFE");

  timerInterval = setInterval(async () => {
    if (globalTimer > 0) {
      // THIS IS A TEST BLOCK FOR RESET RACE BTN TO REMOVE LATER
      // const TESTrace = await RaceService.findCurrentRace();
      // if (typeof TESTrace[0].remaining_time === "undefined") {
      //   clearInterval(timerInterval);
      //   io.emit("timerUpdate", parseInt(process.env.TIMER));
      //   globalTimer = parseInt(process.env.TIMER);
      //   return;
      // }

      globalTimer--;
      // update remaining time in database
      await RaceService.updateRemainingTime(race[0].id, globalTimer);
      io.emit("timerUpdate", globalTimer);
    } else {
      clearInterval(timerInterval);
      io.emit("timerUpdate", 0);
      await RaceService.setMode("FINISH");
      io.emit("raceEnded");
    }
  }, 1000);
};

const initializeRaceState = async () => {
  try {
    const currentRace = await RaceService.findCurrentRace();
    if (currentRace.length > 0 && currentRace[0].status === "STARTED") {
      // Directly start the timer instead of emitting an event
      await startRaceTimer(currentRace[0].id);
    }
  } catch (err) {
    logger.error("Failed to initialize race state:", err);
  }
};

const initializeMode = async () => {
  try {
    const mode = await RaceService.getMode();
    io.emit("modeUpdate", mode);
  } catch (err) {
    logger.error("Failed to initialize global mode:", err);
  }
};

// Middleware Configuration:
app.use(express.json()); // Parse JSON - adds middleware that parses JSON payloads - convert the body into a JS object available under req.body.
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data from form submissions, true == allows rich objects and arrays.
app.use(cookieParser()); // Parse cookies

// File and Directory Setup:
const __filename = fileURLToPath(import.meta.url); // Converts current URL of the module into a filepath using...
const __dirname = path.dirname(__filename); // Directory name where __filepath is full path. Useful for relative path in relation to current dir.
app.use(express.static("public"));

// Define route for /favicon.png
app.get("/favicon.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.png"));
});

app.use(routes);
// app.use(errorHandler);

const PORT = process.env.PORT || 3000; // Sets the port number, checks for environment variables, default is 3000.

httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`); // Start listening to requests at PORT
  initializeRaceState();
  initializeMode();
});
