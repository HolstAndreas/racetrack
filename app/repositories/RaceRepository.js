import pool from "../utils/db.js";
import logger from "../utils/logger.js";

export const checkDriverExists = async (id) => {
  logger.info(`RaceRepository.checkDriverExists(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [id]);
    console.log(res.rows.length > 0);
    return res.rows.length > 0;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const checkRaceExists = async (id) => {
  logger.info(`RaceRepository.checkRaceExists(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM races WHERE id = $1;", [id]);
    console.log(res.rows.length > 0);
    return res.rows.length > 0;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getDriversByRace = async (id) => {
  logger.info(`RaceRepository.getDriversByRace(id:${id})`);
  try {
    const res = await pool.query("SELECT drivers FROM races WHERE id = $1;", [
      id,
    ]);
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const findAll = async () => {
  logger.info(`RaceRepository.findAll()`);
  try {
    const res = await pool.query("SELECT * FROM races;");
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getRaceById = async (id) => {
  logger.info(`RaceRepository.getRaceById(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM races WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getCurrentRace = async () => {
  logger.info(`RaceRepository.getCurrentRace`);
  try {
    const res = await pool.query(
      "SELECT * from races WHERE status = 'STARTED';"
    );
    if (res.rows.length === 0) return []; // no started race;
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getUpcomingRaces = async () => {
  logger.info(`RaceRepository.getUpcomingRaces`);
  try {
    const res = await pool.query(
      "SELECT * from races WHERE start_time IS NULL ORDER BY id ASC;"
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getRaceModeById = async (id) => {
  logger.info(`RaceRepository.getRaceModeById(id:${id})`);
  try {
    const res = await pool.query("SELECT mode FROM races WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
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
    throw err;
  }
};

export const getNextRace = async () => {
  logger.info(`RaceRepository.getNextRace()`);
  try {
    // find race with STARTED status
    const currentRace = await pool.query(
      "SELECT id FROM races WHERE status = 'STARTED' LIMIT 1;"
    );

    let currentId;
    if (currentRace.rows.length > 0) {
      currentId = currentRace.rows[0].id;
    } else {
      // if no started race, get the earliest WAITING race
      const waitingRace = await pool.query(
        "SELECT id FROM races WHERE status = 'WAITING' ORDER BY id ASC LIMIT 1;"
      );
      if (waitingRace.rows.length === 0) return [];
      const nextRace = await pool.query("SELECT * FROM races WHERE id = $1;", [
        waitingRace.rows[0].id,
      ]);
      return nextRace.rows;
    }
    console.log(currentId);
    // Find the next race after the current one
    const nextRace = await pool.query(
      "SELECT * FROM races WHERE id > $1 ORDER BY id ASC LIMIT 1;",
      [currentId]
    );
    return nextRace.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export async function insertRace(drivers) {
  logger.info(`RaceRepository.insertRace(drivers:${drivers})`);
  try {
    const res = await pool.query(
      "INSERT INTO races (drivers) VALUES ($1) RETURNING *;",
      [drivers]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export async function updateTimeStamp(id) {
  logger.info(`RaceRepository.updateStartTime(raceId:${id})`);
  try {
    const res = await pool.query(
      "UPDATE races SET start_time = CURRENT_TIMESTAMP WHERE id = $1;",
      [id]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export async function updateRaceMode(raceId, mode) {
  logger.info(`RaceRepository.setRaceMode(raceId: ${raceId}, mode: ${mode})`);
  try {
    const res = await pool.query(
      "UPDATE races SET mode = $1 WHERE id = $2 RETURNING *;",
      [mode, raceId]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

// '2023-10-01 12:00:00'
export async function updateRaceStatus(raceId, status) {
  logger.info(
    `RaceRepository.updateRaceStatus(raceId: ${raceId}, status: ${status})`
  );
  try {
    const res = await pool.query(
      "UPDATE races SET status = $1 WHERE id = $2 RETURNING *;",
      [status, raceId]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export async function deleteRace(id) {
  logger.info(`RaceRepository.deleteRace(id:${id})`);
  try {
    // Start a transaction since we are making multiple changes
    await pool.query("BEGIN");

    // Remove driver from races drivers array
    await pool.query(
      "UPDATE drivers SET current_race = NULL WHERE current_race = $1",
      [id]
    );

    // Delete the driver
    const res = await pool.query("DELETE FROM races WHERE id = $1;", [id]);

    await pool.query("COMMIT");
    logger.info(`Deleted race with ID: ${id}`);
    return res.rowCount > 0;
  } catch (err) {
    await pool.query("ROLLBACK");
    logger.error(err);
    throw err;
  }
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
    throw err;
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
