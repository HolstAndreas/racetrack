import pool from "./db.js";
import logger from "../utils/logger.js";

async function retrieveData() {
  try {
    const res = await pool.query("SELECT * FROM races");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  }
}

export const checkRaceExists = async (id) => {
  logger.info(`retrieveData.checkRaceExists(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM races WHERE id = $1;", [id]);
    return res.rows.length > 0;
  } catch (err) {
    logger.error(err);
  }
};

export const checkDriverExists = async (id) => {
  logger.info(`retrieveData.checkDriverExists(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [id]);
    return res.rows.length > 0;
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
  logger.info(`retrieveData.getRaceById(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM races WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getCurrentRace = async () => {
  logger.info(`retrieveData.getCurrentRace`);
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
  logger.info(`retrieveData.getUpcomingRaces`);
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
  logger.info(`retrieveData.getRaceModeById(id:${id})`);
  try {
    const res = await pool.query("SELECT mode FROM races WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getRemainingTimeById = async (id) => {
  logger.info(`retrieveData.getRemainingTimeById(id:${id})`);
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
  logger.info(`retrieveData.getNextRace(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM races WHERE id = $1;", [
      id + 1,
    ]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getDrivers = async () => {
  logger.info(`retrieveData.getDrivers()`);
  try {
    const res = await pool.query("SELECT * FROM drivers;");
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getDriversByCar = async (carId) => {
  logger.info(`retrieveData.getDriversByCar(carId:${carId})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE car = $1;", [
      carId,
    ]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getDriversByRace = async (id) => {
  logger.info(`retrieveData.getDriversByRace(id:${id})`);
  try {
    const res = await pool.query("SELECT drivers FROM races WHERE id = $1;", [
      id,
    ]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};
