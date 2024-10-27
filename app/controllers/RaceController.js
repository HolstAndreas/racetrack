import Race from "../entities/Race.js";
import * as RaceService from "../services/RaceService.js";
import logger from "../utils/logger.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = async (req, res, next) => {
  logger.info("RaceController.getAll()");
  try {
    const races = await RaceService.findAll();
    if (!races) {
      throw ApiError.notFound("No races found");
    }
    logger.success(
      "RaceController | Got result: \n" + JSON.stringify(races, null, 2)
    );
    return ApiResponse.success(races, "Races retrieved successfully").send(res);
  } catch (error) {
    next(error);
  }
};

// GET race by ID
export const getRaceById = async (req, res, next) => {
  const { raceId } = req.params;
  logger.info(`RaceController.getRaceById(raceId:${raceId})`);
  try {
    const race = await RaceService.findById(raceId);
    if (!race) {
      throw ApiError.notFound("Race not found");
    }
    logger.success("RaceController | Got result: \n" + JSON.stringify(race));
    return ApiResponse.success(race, "Race retrieved successfully").send(res);
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  const { raceId } = req.params;
  try {
    const leaderboard = await RaceService.getLeaderboard(raceId);
    return ApiResponse.success(
      leaderboard,
      "Leaderboard retrieved successfully"
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRaces = async (req, res, next) => {
  logger.info("RaceController.upcomingRaces()");
  try {
    const result = await RaceService.findUpcomingRaces();
    return ApiResponse.success(
      result,
      "Upcoming races list created successfully"
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const getCurrentRace = async (req, res, next) => {
  try {
    const result = await RaceService.findCurrentRace();
    if (result.length < 1) {
      throw ApiError.notFound("No current race found.");
    }
    return ApiResponse.success(
      result,
      "Current race retrieved successfully"
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const getNextRace = async (req, res, next) => {
  const { raceId } = req.params;
  logger.info(`RaceController.getNextRace(raceId:${raceId})`);
  try {
    const result = await RaceService.findNextRace(raceId); // Fetches a next race
    logger.success("RaceController | Got result: \n" + JSON.stringify(result));
    if (result.length === 0) {
      throw ApiError.notFound("No next race found.");
    } else {
      return ApiResponse.success(
        result,
        "Next race retrieved successfully"
      ).send(res);
    }
  } catch (error) {
    next(error);
  }
};

export const getRaceFlags = async (req, res, next) => {
  const { raceId } = req.params;
  logger.info(`RaceController.getRaceFlags(raceId:${raceId})`);
  try {
    const result = await RaceService.findModeById(raceId); // Fetches a race mode by ID
    logger.success(
      "RaceController | Got result: \n" + JSON.stringify(result, null, 2)
    );
    if (result.length === 0) {
      throw ApiError.notFound("No race found.");
    } else {
      return ApiResponse.success(
        result,
        "Race flags retrieved successfully"
      ).send(res);
    }
  } catch (error) {
    next(error);
  }
};

export const getRemainingTime = async (req, res, next) => {
  const { raceId } = req.params;
  logger.info(`RaceController.getRemainingTime(raceId:${raceId})`);
  try {
    const result = await RaceService.findRemainingTimeById(raceId); // Fetches a race remaining time by ID
    logger.success(
      "RaceController | Got result: \n" + JSON.stringify(result, null, 2)
    );
    if (result.length === 0) {
      throw ApiError.notFound("No race found.");
    } else {
      return ApiResponse.success(
        result,
        "Remaining time retrieved successfully"
      ).send(res);
    }
  } catch (error) {
    next(error);
  }
};

// POST
export const postDriverToRace = async (req, res, next) => {
  const { raceId, driverId } = req.params;
  logger.info(
    `RaceController.postDriverToRace(raceId:${raceId}, driverId:${driverId})`
  );
  try {
    const result = await RaceService.addDriverToRace(raceId, driverId);

    if (result.error) {
      switch (result.error) {
        case "RACE_NOT_FOUND":
          throw ApiError.notFound("Race not found.");
        case "DRIVER_NOT_FOUND":
          throw ApiError.notFound("Driver not found.");
        case "DRIVER_ALREADY_IN_RACE":
          throw ApiError.badRequest("Driver already in race.");
        default:
          throw ApiError.internal("Internal server error.");
      }
    } else {
      return ApiResponse.success(
        result,
        "Driver added to race successfully"
      ).send(res);
    }
  } catch (error) {
    next(error);
  }
};

export const postRace = async (req, res, next) => {
  const { drivers } = req.body;
  logger.info(`RaceController.postRace(drivers:${drivers})`);
  try {
    // Validate required fields
    if (!Array.isArray(drivers)) {
      throw ApiError.badRequest("Drivers must be an array.");
    } else if (!drivers || drivers.length === 0) {
      throw ApiError.badRequest("At least one driver is required.");
    }

    logger.info(`RaceController.postRace(drivers:${drivers})`);
    const result = await RaceService.addRace(drivers);
    if (result.error) {
      switch (result.error) {
        case "DRIVER_NOT_FOUND":
          throw ApiError.notFound(`Driver ${result.driver} not found.`);
        default:
          throw ApiError.internal("Internal server error.");
      }
    }
    return ApiResponse.created(result, "Race created successfully").send(res);
  } catch (error) {
    next(error);
  }
};

export const updateRaceStatus = async (req, res, next) => {
  const { raceId } = req.params;
  const { status } = req.body;

  logger.info(
    `RaceController.updateRaceStatus(raceId:${raceId}, status:${status})`
  );

  try {
    if (!status) {
      throw ApiError.badRequest("Status is required.");
    }

    const result = await RaceService.updateRaceStatus(raceId, status);
    if (result.error === "RACE_NOT_FOUND") {
      throw ApiError.notFound("Race not found");
    }

    return ApiResponse.success(result, "Race status updated successfully").send(
      res
    );
  } catch (err) {
    next(err);
  }
};

export const updateRaceMode = async (req, res, next) => {
  const { raceId } = req.params;
  const { mode } = req.body;

  logger.info(`RaceController.updateRaceMode(raceId:${raceId}, mode:${mode})`);

  try {
    if (!mode) {
      throw ApiError.badRequest("Mode is required.");
    }

    const result = await RaceService.updateRaceMode(raceId, mode);
    if (result.error === "RACE_NOT_FOUND") {
      throw ApiError.notFound("Race not found");
    }

    return ApiResponse.success(result, "Race mode updated successfully").send(
      res
    );
  } catch (err) {
    next(err);
  }
};

export const startCurrentRace = async (req, res, next) => {
  const { raceId } = req.params;
  logger.info(`RaceController.setStartTime(raceId: ${raceId})`);

  try {
    const result = await RaceService.startCurrentRace(raceId);
    if (result.error === "NO_DRIVERS_IN_RACE") {
      throw ApiError.badRequest("Cannot start race with no drivers");
    }
    return ApiResponse.success(result, "Race started successfully").send(res);
  } catch (err) {
    next(err);
  }
};
// // PATCH
// export const patchRaceById = async (req, res) => {
//   const { raceId } = req.params;
//   logger.info(`RaceController.patchRaceById: ${raceId}`);
//   const result = await RaceService.patchRaceById();
//   res.send("patchRaceById: " + raceId);
// };

// DELETE
export const deleteDriverFromRace = async (req, res, next) => {
  const { raceId, driverId } = req.params;
  if (!raceId || !driverId) {
    logger.error(
      "RaceController.deleteDriverFromRace() | Race ID and driver ID are required."
    );
    return next(ApiError.badRequest("Race ID and driver ID are required."));
  }

  logger.info(
    `RaceController.deleteDriverFromRace(raceId:${raceId}, driverId:${driverId})`
  );

  try {
    const result = await RaceService.removeDriverFromRace(raceId, driverId);

    if (result.error) {
      switch (result.error) {
        case "RACE_NOT_FOUND":
          throw ApiError.notFound("Race not found.");
        case "DRIVER_NOT_FOUND":
          throw ApiError.notFound("Driver not found.");
        case "RACE_DATA_NOT_FOUND":
          throw ApiError.notFound("Race data not found.");
        case "DRIVER_NOT_IN_RACE":
          throw ApiError.badRequest("Driver is not in this race.");
        default:
          throw ApiError.internal("Internal server error.");
      }
    }

    return ApiResponse.noContent(
      result,
      "Driver removed from race successfully"
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteRace = async (req, res, next) => {
  const { raceId } = req.params;
  logger.info(`RaceController.deleteRace(raceId:${raceId})`);
  try {
    const result = await RaceService.deleteRace(raceId);
    return ApiResponse.noContent(result, "Race deleted successfully").send(res);
  } catch (error) {
    next(error);
  }
};
