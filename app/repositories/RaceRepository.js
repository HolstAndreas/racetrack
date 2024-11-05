import pool from "../utils/db.js";
import logger from "../utils/logger.js";

export const checkDriverExists = async (id) => {
  logger.info(`RaceRepository.checkDriverExists(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [id]);
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
    return res.rows.length > 0;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const checkDriversHaveCars = async (raceId) => {
  logger.info(`RaceRepository.checkDriversHaveCars(drivers:${raceId})`);
  try {
    const res = await pool.query(
      "SELECT d.id AS driver_id, d.name FROM drivers d JOIN races r ON d.id = ANY(r.drivers) WHERE r.id = $1 AND d.car IS NULL;",
      [raceId]
    );
    return res.rows.length <= 0;
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
    const res = await pool.query(
      `SELECT 
          r.id AS id,
          r.start_time,
          json_agg(json_build_object('id', d.id, 'name', d.name, 'car', d.car)) AS drivers,
          r.status
      FROM 
          races r
      JOIN 
          LATERAL unnest(r.drivers) AS driver_id ON true
      JOIN 
          drivers d ON d.id = driver_id
            WHERE 
                r.id = $1
            GROUP BY 
                r.id;`,
      [id]
    );
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
      `SELECT 
                r.id AS id,
                r.start_time,
                r.remaining_time,
                json_agg(json_build_object('id', d.id, 'name', d.name, 'car', d.car)) AS drivers,
                r.status
            FROM 
                races r
            JOIN 
                LATERAL unnest(r.drivers) AS driver_id ON true
            JOIN 
                drivers d ON d.id = driver_id
            WHERE 
                r.status = 'STARTED'
            GROUP BY 
                r.id;`
    );
    if (res.rows[0] === undefined) return [];
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
      `SELECT 
            r.id AS id,
            json_agg(
              json_build_object(
                'id', d.id, 
                'name', d.name, 
                'car', d.car
              )
            ) AS drivers
          FROM 
            races r
          JOIN 
            LATERAL unnest(r.drivers) AS driver_id ON true
          JOIN 
            drivers d ON d.id = driver_id
          WHERE 
            r.status = 'WAITING'
          GROUP BY 
            r.id 
          ORDER BY 
            id ASC;`
    );
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
        `SELECT id FROM races WHERE status = 'WAITING' ORDER BY id ASC LIMIT 1;`
      );
      if (waitingRace.rows.length === 0) return [];
      const nextRace = await pool.query(
        `SELECT 
              r.id AS id,
              r.start_time,
              json_agg(json_build_object('id', d.id, 'name', d.name, 'car', d.car)) AS drivers,
              r.status
          FROM 
              races r
          JOIN 
              LATERAL unnest(r.drivers) AS driver_id ON true
          JOIN 
              drivers d ON d.id = driver_id
                WHERE 
                    r.id = $1
                GROUP BY 
                    r.id
          ORDER BY 
              id ASC 
          LIMIT 1;`,
        [waitingRace.rows[0].id]
      );
      return nextRace.rows;
    }
    // Find the next race after the current one
    const nextRace = await pool.query(
      `SELECT 
              r.id AS id,
              r.start_time,
              json_agg(json_build_object('id', d.id, 'name', d.name, 'car', d.car)) AS drivers,
              r.status
          FROM 
              races r
          JOIN 
              LATERAL unnest(r.drivers) AS driver_id ON true
          JOIN 
              drivers d ON d.id = driver_id
                WHERE 
                    r.id > $1
                GROUP BY 
                    r.id
          ORDER BY 
              id ASC 
          LIMIT 1;`,
      [currentId]
    );
    return nextRace.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getLeaderboard = async (id) => {
  logger.info(`RaceRepository.getLeaderboard(raceId:${id})`);
  try {
    const res = await pool.query(
      "SELECT * FROM lap_times WHERE race_id = $1 ORDER BY lap_time ASC;",
      [id]
    );
    return res.rows;
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

export const getMode = async () => {
  logger.info(`RaceRepository.getMode`);
  try {
    const res = await pool.query("SELECT mode FROM global_state WHERE id = 1;");
    return res.rows[0].mode;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const updateMode = async (mode) => {
  logger.info(`RaceRepository.updateMode(mode:${mode})`);
  try {
    const res = await pool.query(
      "UPDATE global_state SET mode = $1 WHERE id = 1 RETURNING *;",
      [mode]
    );
    return res.rows[0];
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

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

export const updateRemainingTime = async (raceId, remainingTime) => {
  // logger.info(
  // `RaceRepository.updateRemainingTime(raceId:${raceId}, remainingTime:${remainingTime})`
  // );
  try {
    const res = await pool.query(
      "UPDATE races SET remaining_time = $1 WHERE id = $2 RETURNING *;",
      [remainingTime, raceId]
    );
    return res.rows[0];
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

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

export const resetRace = async (raceId) => {
  logger.debug(`reset race ${raceId})`);
  try {
    await pool.query(
      `UPDATE global_state 
             SET mode = 'DANGER' 
             WHERE id = 1;`
    );
    const res = await pool.query(
      `UPDATE races 
       SET start_time = NULL, 
           status = 'WAITING',
           remaining_time = NULL
       WHERE id = $1 
       RETURNING *;`,
      [raceId]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
