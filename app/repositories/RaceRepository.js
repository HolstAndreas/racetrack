import pool from "../utils/db.js";
import logger from "../utils/logger.js";

export const checkDriverExists = async (id) => {
    logger.info(`DriverRepository.checkDriverExists(id:${id})`);
    try {
        const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [
            id,
        ]);
        return res.rows.length > 0;
    } catch (err) {
        logger.error(err);
    }
};

export const checkRaceExists = async (id) => {
    logger.info(`RaceRepository.checkRaceExists(id:${id})`);
    try {
        const res = await pool.query("SELECT * FROM races WHERE id = $1;", [
            id,
        ]);
        return res.rows.length > 0;
    } catch (err) {
        logger.error(err);
    }
};

export const getDriversByRace = async (id) => {
    logger.info(`DriverRepository.getDriversByRace(id:${id})`);
    try {
        const res = await pool.query(
            "SELECT drivers FROM races WHERE id = $1;",
            [id]
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

// getRaceById(6);
// [
//   {
//     id: 6,
//     start_time: 2024-10-22T10:23:44.933Z,
//     drivers: [ 1, 2, 3 ],
//     remaining_time: 600,
//     status: 'WAITING',
//     mode: 'DANGER'
//   }
// ]
export const getRaceById = async (id) => {
    logger.info(`RaceRepository.getRaceById(id:${id})`);
    try {
        const res = await pool.query("SELECT * FROM races WHERE id = $1;", [
            id,
        ]);
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

export const getCurrentRace = async () => {
    logger.info(`RaceRepository.getCurrentRace`);
    try {
        const res = await pool.query(
            "SELECT * from races WHERE start_time IS NOT NULL ORDER BY id DESC LIMIT 1;"
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

export const getUpcomingRaces = async () => {
    logger.info(`RaceRepository.getUpcomingRaces`);
    try {
        const res = await pool.query(
            "SELECT * from races WHERE start_time IS NULL;"
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

export const getRaceModeById = async (id) => {
    logger.info(`RaceRepository.getRaceModeById(id:${id})`);
    try {
        const res = await pool.query("SELECT mode FROM races WHERE id = $1;", [
            id,
        ]);
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

export const getRemainingTimeById = async (id) => {
    logger.info(`RaceRepository.getRemainingTimeById(id:${id})`);
    try {
        const res = await pool.query(
            "SELECT remaining_time FROM races WHERE id = $1;",
            [id]
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

export const getNextRace = async (id) => {
    logger.info(`RaceRepository.getNextRace(id:${id})`);
    try {
        const res = await pool.query("SELECT * FROM races WHERE id = $1;", [
            id + 1,
        ]);
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

// insertRace({ start_time: "2023-10-01 12:00:00", drivers: [1, 2, 3] });
// Added a race with the start time 2023-10-01 12:00:00, generated ID: 3
export async function insertRace(race) {
    logger.info(`insertData.insertRace(race:${race.toString()})`);
    try {
        const res = await pool.query(
            "INSERT INTO races (start_time, drivers) VALUES ($1, $2) RETURNING *",
            [race.getStartTime(), race.getDrivers()]
        );
        return res.rows;
    } catch (e) {
        throw error;
    }
}

export async function deleteRace(id) {
    logger.info(`insertData.deleteRace(id:${id})`);
    const res = await pool.query("DELETE FROM races WHERE id = $1", [id]);
    console.log(`Deleted race with ID: ${id}`);
}

export const postDriverToRace = async (raceId, drivers) => {
    logger.info(
        `RaceRepository.postDriverToRace(raceId:${raceId}, drivers:${drivers})`
    );
    try {
        const res = await pool.query(
            `UPDATE races SET drivers = $1 WHERE id = $2 RETURNING drivers;`,
            [drivers, raceId]
        );
        return res.rows;
    } catch (err) {
        logger.error(err);
    }
};

// CREATE TABLE races (
//   id SERIAL PRIMARY KEY,
//   start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   drivers INTEGER[],
//   remaining_time INTEGER DEFAULT 600,
//   status VARCHAR(50) DEFAULT 'WAITING',
//   mode VARCHAR(50) DEFAULT 'DANGER'
//   );

//     INSERT INTO races (start_time, remaining_time, status, mode)
// VALUES ('2023-10-01 12:00:00', 600, 'WAITING', 'DANGER');

// SELECT * FROM races;
