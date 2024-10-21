// Imports everything necessary for app.js to function as an express instance.
import express from "express"; // Import express module - handles routing, middleware, HTTP requests, responses
import path from "path"; // Provides ulities for working with file and directory paths.
import { fileURLToPath } from "url"; // converts a file URL into an actual filepath - in ES Node.js does not provide built-in __filename or __dirname...
import { getRaceById } from "./controllers/raceController.js"; // import all methods from raceControllers.js

// Sets up Express
const app = express(); // app is now an instance of Express application.

// Middleware Configuration:
app.use(express.json()); // Parse JSON - adds middleware that parses JSON payloads - convert the body into a JS object available under req.body.
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data from form submissions, true == allows rich objects and arrays.

// File and Directory Setup:
const __filename = fileURLToPath(import.meta.url); // Converts current URL of the module into a filepath using...
const __dirname = path.dirname(__filename); // Directory name where __filepath is full path. Useful for relative path in relation to current dir.

// Setting View Engine and Views Directory:
app.set("views", path.join(__dirname, "views")); // Express will look for views in the views folder located in the same dir as current file.
app.set("view engine", "ejs"); // Sets EJS as view engine.

// Here should all defined routes be. (Endpoint, method)
app.get("/race-sessions:raceId", getRaceById); // get a race by ID
app.get("/leader-board", getLeaderBoard); // get leaderboard
app.get("/next-race", getNextRace); // get next race
app.post("/lap-times", postLapTimes); // post/update lap-times
app.post("/raceId/drivers", postDriversInRace); // add driver to race
app.delete("/raceId/drivers", deleteDriversInRace); // delete driver from race
app.patch("/raceId/drivers/driverId", patchRaceById); // edit driver from race
app.post("/raceId/drivers/driverId/assign-car", assignCarToDriver); // assign a car to driver

// Starts the server
const PORT = process.env.PORT || 3000; // Sets the port number, checks for environment variables, default is 3000.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Start listening to requests at PORT
});
