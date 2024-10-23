import pool from "../utils/db.js";
import logger from "../utils/logger.js";

export const getLapTimesByRace = async (raceId) => {
    logger.info(`LapTimeRepository.getLapTimesByRace(raceId:${raceId})`);
    try {
        const res = await pool.query(
            "SELECT * FROM lap_times WHERE race_id = $1 ORDER BY lap_number ASC;",
            [raceId]
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const getLapTimesByDriver = async (driverId) => {
    logger.info(`LapTimeRepository.getLapTimesByDriver(driverId:${driverId})`);
    try {
        const res = await pool.query(
            "SELECT * FROM lap_times WHERE driver_id = $1 ORDER BY lap_number ASC;",
            [driverId]
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const insertLapTime = async (driverId, raceId, lapTime, lapNumber) => {
    logger.info(
        `LapTimeRepository.insertLapTime(driverId:${driverId}, raceId:${raceId}, lapTime:${lapTime}, lapNumber:${lapNumber})`
    );
    try {
        const res = await pool.query(
            "INSERT INTO lap_times (driver_id, race_id, lap_time, lap_number) VALUES ($1, $2, $3, $4) RETURNING *;",
            [driverId, raceId, lapTime, lapNumber]
        );
        return res.rows[0];
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const getFastestLapByRace = async (raceId) => {
    logger.info(`LapTimeRepository.getFastestLapByRace(raceId:${raceId})`);
    try {
        const res = await pool.query(
            "SELECT * FROM lap_times WHERE race_id = $1 ORDER BY lap_time ASC LIMIT 1;",
            [raceId]
        );
        return res.rows[0];
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const getFastestLapByDriver = async (driverId, raceId) => {
    logger.info(
        `LapTimeRepository.getFastestLapByDriver(driverId:${driverId}, raceId:${raceId})`
    );
    try {
        const res = await pool.query(
            "SELECT * FROM lap_times WHERE driver_id = $1 AND race_id = $2 ORDER BY lap_time ASC LIMIT 1;",
            [driverId, raceId]
        );
        return res.rows[0];
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const getLastLapNumber = async (driverId, raceId) => {
    logger.info(
        `LapTimeRepository.getLastLapNumber(driverId:${driverId}, raceId:${raceId})`
    );
    try {
        const res = await pool.query(
            "SELECT MAX(lap_number) as last_lap FROM lap_times WHERE driver_id = $1 AND race_id = $2;",
            [driverId, raceId]
        );
        return res.rows[0].last_lap || 0;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const getLapTimesByDriverAndRace = async (driverId, raceId) => {
    logger.info(
        `LapTimeRepository.getLapTimesByDriverAndRace(driverId:${driverId}, raceId:${raceId})`
    );
    try {
        const res = await pool.query(
            "SELECT * FROM lap_times WHERE driver_id = $1 AND race_id = $2 ORDER BY lap_number ASC;",
            [driverId, raceId]
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

// CREATE TABLE lap_times (
//   id SERIAL PRIMARY KEY,
//   driver_id INTEGER REFERENCES drivers(id),
//   race_id INTEGER REFERENCES races(id),
//   lap_time INTEGER,
//   lap_number INTEGER,
//   UNIQUE(driver_id, race_id, lap_number)
// );
