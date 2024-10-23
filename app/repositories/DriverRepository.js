import pool from "../utils/db.js";
import logger from "../utils/logger.js";

export const checkDriverExists = async (id) => {
  logger.info(`DriverRepository.checkDriverExists(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [id]);
    return res.rows.length > 0;
  } catch (err) {
    logger.error(err);
  }
};

export const findById = async (id) => {
  logger.info(`DriverRepository.findById(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const findAll = async () => {
  logger.info(`DriverRepository.findAll()`);
  try {
    const res = await pool.query("SELECT * FROM drivers;");
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getDrivers = async () => {
  logger.info(`DriverRepository.getDrivers()`);
  try {
    const res = await pool.query("SELECT * FROM drivers;");
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getDriversByCar = async (carId) => {
  logger.info(`DriverRepository.getDriversByCar(carId:${carId})`);
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
  logger.info(`DriverRepository.getDriversByRace(id:${id})`);
  try {
    const res = await pool.query("SELECT drivers FROM races WHERE id = $1;", [
      id,
    ]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export async function insertDriver(driver) {
  logger.info(`insertData.insertDriver(driver:${driver})`);
  try {
    const res = await pool.query(
      "INSERT INTO drivers (name) VALUES ($1) RETURNING *",
      [driver]
    );
    return res.rows;
  } catch (err) {
    throw err;
  }
}

export const postCarToDriver = async (driverId, carId) => {
  logger.info(
    `DriverRepository.postCarToDriver(driverId:${driverId}, carId:${carId})`
  );
  try {
    const res = await pool.query(
      `UPDATE drivers SET car = $1 WHERE id = $2 RETURNING *;`,
      [carId, driverId]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

//   CREATE TABLE drivers(id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     car INTEGER,
//     current_Race INTEGER REFERENCES races(id),
//     );

// INSERT INTO drivers (name, car, current_race)
// VALUES ('Jaan Kood', 1, 1);

// SELECT * FROM drivers;
