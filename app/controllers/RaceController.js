import Race from "../entities/Race.js";
import * as RaceService from "../services/RaceService.js";
import logger from "../utils/logger.js";

// GET race by ID
export const getRaceById = async (req, res) => {
    const { raceId } = req.params;
    logger.info(`RaceController.getRaceById(raceId:${raceId})`);
    try {
        const race = await RaceService.findById(raceId);
        if (!race) {
            return res.status(404).json({ error: "Race not found" });
        }
        logger.success(
            "RaceController | Got result: \n" + JSON.stringify(race, null, 2)
        );
        res.status(200).json(race);
    } catch (error) {
        logger.error(`RaceController.getRaceById() | Error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
    // /api/race-sessions/1
};

export const getLeaderboard = (req, res) => {
    const { raceId } = req.params;
    // try {
    //   const { race, sortedDrivers } = await raceService.getLeaderboardData(
    //     raceId
    //   );
    //   res.render("leader-board", { race, sortedDrivers });
    // } catch (error) {
    //   console.error("Error fetching leaderboard:", error);
    //   res.status(500).send("An error occured");
    // }
    res.send("getLeaderboard: " + raceId);
};

export const createRaceList = async (req, res) => {
    logger.info("RaceController.createRaceList()");
    const result = await RaceService.createRaceList();
    return res.status(200).json(result);
};

export const getCurrentRace = async (req, res) => {
    const result = await RaceService.findCurrentRace();
    return res.status(200).json(result);
};

export const getNextRace = async (req, res) => {
    const { raceId } = req.params;
    logger.info(`RaceController.getNextRace(raceId:${raceId})`);
    const result = await RaceService.findNextRace(raceId); // Fetches a next race
    logger.success("RaceController | Got result: \n" + JSON.stringify(result));
    if (result.length === 0) {
        res.status(404).send("No next race found.");
    } else {
        res.status(200).json(result);
    }
    // /next-race/
};

export const getRaceFlags = async (req, res) => {
    const { raceId } = req.params;
    logger.info(`RaceController.getRaceFlags(raceId:${raceId})`);
    const result = await RaceService.findModeById(raceId); // Fetches a race mode by ID
    logger.success(
        "RaceController | Got result: \n" + JSON.stringify(result, null, 2)
    );
    if (result.length === 0) {
        res.status(404).send("No race found.");
    } else {
        res.status(200).json(result);
    }
    // /race-flags/:raceId
};

export const getRemainingTime = async (req, res) => {
    const { raceId } = req.params;
    logger.info(`RaceController.getRemainingTime(raceId:${raceId})`);
    const result = await RaceService.findRemainingTimeById(raceId); // Fetches a race remaining time by ID
    logger.success(
        "RaceController | Got result: \n" + JSON.stringify(result, null, 2)
    );
    if (result.length === 0) {
        res.status(404).send("No race found.");
    } else {
        res.status(200).json(result);
    }
    // /race-flags/:raceId
};

// POST
export const postDriverToRace = async (req, res) => {
    const { raceId, driverId } = req.params;
    logger.info(
        `RaceController.postDriverToRace(raceId:${raceId}, driverId:${driverId})`
    );
    const result = await RaceService.addDriverToRace(raceId, driverId);

    if (result.error) {
        switch (result.error) {
            case "RACE_NOT_FOUND":
                res.status(404).send("Race not found.");
                break;
            case "DRIVER_NOT_FOUND":
                res.status(404).send("Driver not found.");
                break;
            case "DRIVER_ALREADY_IN_RACE":
                res.status(400).send("Driver already in race.");
                break;
            default:
                res.status(500).send("Internal server error.");
        }
    } else {
        res.status(200).json(result);
    }
};

export const postRace = async (req, res) => {
    const { startTime, drivers } = req.body;
    const timeStampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    console.log(startTime, drivers);

    // Validate required fields
    if (!Array.isArray(drivers)) {
        logger.error("Drivers must be an array.");
        res.status(400).send("Drivers must be an array.");
        return;
    } else if (!drivers) {
        logger.error("Drivers array is required.");
        res.status(400).send("Drivers array is required.");
        return;
    } else if (drivers.length < 8) {
        logger.error("Drivers array must contain at least 8 drivers.");
        res.status(400).send("Drivers array must contain at least 8 drivers.");
        return;
    } else if (!startTime) {
        logger.error("Start time is required.");
        res.status(400).send("Start time is required.");
        return;
    } else if (!timeStampRegex.test(startTime)) {
        logger.error("Invalid startTime format. Use 'YYYY-MM-DD HH:mm:ss'.");
        res.status(400).send(
            "Invalid startTime format. Use 'YYYY-MM-DD HH:mm:ss'."
        );
        return;
    }

    const newRace = new Race(startTime, Object.values(drivers));
    logger.info(`RaceController.postRace(race:${newRace.toString()})})`);
    const result = await RaceService.addRace(newRace);

    res.status(200).send(result);
};

// // PATCH
// export const patchRaceById = async (req, res) => {
//   const { raceId } = req.params;
//   logger.info(`RaceController.patchRaceById: ${raceId}`);
//   const result = await RaceService.patchRaceById();
//   res.send("patchRaceById: " + raceId);
// };

// DELETE
export const deleteDriverFromRace = async (req, res) => {
    const { raceId, driverId } = req.params;
    if (!raceId || !driverId) {
        logger.error(
            "RaceController.deleteDriverFromRace() | Race ID and driver ID are required."
        );
        return res.status(400).send("Race ID and driver ID are required.");
    }

    logger.info(
        `RaceController.deleteDriverFromRace(raceId:${raceId}, driverId:${driverId})`
    );

    const result = await RaceService.removeDriverFromRace(raceId, driverId);

    if (result.error) {
        switch (result.error) {
            case "RACE_NOT_FOUND":
                return res.status(404).send("Race not found.");
            case "DRIVER_NOT_FOUND":
                return res.status(404).send("Driver not found.");
            case "RACE_DATA_NOT_FOUND":
                return res.status(404).send("Race data not found.");
            case "DRIVER_NOT_IN_RACE":
                return res.status(400).send("Driver is not in this race.");
            default:
                return res.status(500).send("Internal server error.");
        }
    }

    return res.status(200).send(result);
};
