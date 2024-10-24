import * as LapTimeService from "../services/LapTimeService.js";
import logger from "../utils/logger.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const postLapTimes = async (req, res, next) => {
    const { raceId, driverId, lapTime, lapNumber } = req.body;
    logger.info(
        `LapTimeController.postLapTimes(lapTime:${JSON.stringify(req.body)})`
    );
    try {
        // Check if all required fields are present
        if (!raceId) {
            throw ApiError.badRequest("Race ID is required");
        }
        if (!driverId) {
            throw ApiError.badRequest("Driver ID is required");
        }
        if (!lapTime) {
            throw ApiError.badRequest("Lap time is required");
        }
        if (!lapNumber) {
            throw ApiError.badRequest("Lap number is required");
        }

        // Check if all values are integers
        if (
            !Number.isInteger(raceId) ||
            !Number.isInteger(driverId) ||
            !Number.isInteger(lapTime) ||
            !Number.isInteger(lapNumber)
        ) {
            throw ApiError.badRequest("All values must be integers");
        }

        const result = await LapTimeService.postLapTime(
            driverId,
            raceId,
            lapTime,
            lapNumber
        );
        return ApiResponse.success(
            result,
            "Lap time recorded successfully"
        ).send(res);
    } catch (error) {
        next(error);
    }
};

export const getLapTimesByRace = async (req, res, next) => {
    const raceId = req.params.raceId;
    const fastest = req.query.fastest === "true"; // /api/laptimes/race/:raceId?fastest=true
    logger.info(`getLapTimesByRace: raceId: ${raceId}, fastest: ${fastest}`);
    try {
        if (!raceId) {
            throw ApiError.badRequest("Race ID is required.");
        }
        if (fastest) {
            const fastestLapTime = await LapTimeService.getFastestLapByRace(
                raceId
            );
            return ApiResponse.success(
                fastestLapTime,
                "Fastest lap time retrieved successfully"
            ).send(res);
        } else {
            const lapTimes = await LapTimeService.getLapTimesByRace(raceId);
            return ApiResponse.success(
                lapTimes,
                "Lap times retrieved successfully"
            ).send(res);
        }
    } catch (error) {
        next(error);
    }
};

export const getLapTimesByDriver = async (req, res, next) => {
    const { driverId } = req.params;

    try {
        if (!driverId) {
            throw ApiError.badRequest("Driver ID is required.");
        }

        const lapTimes = await LapTimeService.getLapTimesByDriver(driverId);
        return ApiResponse.success(lapTimes, "Lap times retrieved successfully").send(res);
    } catch (error) {
        next(error);
    }
};

export const getLapTimesByRaceAndDriver = async (req, res, next) => {
    const { raceId, driverId } = req.params;
    const fastest = req.query.fastest === "true";

    try {
        if (!raceId) {
            throw ApiError.badRequest("Race ID is required.");
        }
        if (!driverId) {
            throw ApiError.badRequest("Driver ID is required.");
        }

        if (fastest) {
            const fastestLap = await LapTimeService.getFastestLapByDriver(driverId, raceId);
            return ApiResponse.success(fastestLap, "Fastest lap time retrieved successfully").send(res);
        } else {
            const lapTimes = await LapTimeService.getLapTimesByDriverAndRace(driverId, raceId);
            return ApiResponse.success(lapTimes, "Lap times retrieved successfully").send(res);
        }
    } catch (error) {
        next(error);
    }
};
