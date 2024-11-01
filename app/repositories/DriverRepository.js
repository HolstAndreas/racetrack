import pool from "../utils/db.js";
import logger from "../utils/logger.js";

export const checkDriverExists = async (id) => {
  logger.info(`DriverRepository.checkDriverExists(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [id]);
    return res.rows.length > 0;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const findById = async (id) => {
  logger.info(`DriverRepository.findById(id:${id})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(`DriverRepository.findById | Error: ${err}`);
    throw err;
  }
};

export const findAll = async () => {
  logger.info(`DriverRepository.findAll()`);
  try {
    const res = await pool.query("SELECT * FROM drivers;");
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const findByName = async (name) => {
  logger.info(`DriverRepository.findByName(name:${name})`);
  try {
    const res = await pool.query("SELECT * FROM drivers WHERE name = $1;", [
      name,
    ]);
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
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
    throw err;
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
    throw err;
  }
};

export const insertDriver = async (name) => {
  logger.info(`insertData.insertDriver(driver:${name})`);
  try {
    const res = await pool.query(
      "INSERT INTO drivers (name) VALUES ($1) RETURNING *;",
      [name]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const postCarToDriver = async (driverId, carId) => {
  logger.info(
    `DriverRepository.postCarToDriver(driverId:${driverId}, carId:${carId})`
  );
  try {
    const res = await pool.query(
      "UPDATE drivers SET car = $1 WHERE id = $2 RETURNING *;",
      [carId, driverId]
    );
    return res.rows;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const updateDriverName = async (driverId, name) => {
  logger.info(
    `DriverRepository.updateDriverName(driverId:${driverId}, name:${name})`
  );
  try {
    const res = await pool.query(
      "UPDATE drivers SET name = $1 WHERE id = $2 RETURNING *;",
      [name, driverId]
    );
    return res.rows[0];
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const deleteDriver = async (driverId) => {
  logger.info(`DriverRepository.deleteDriver(driverId:${driverId})`);

  if (!Number.isInteger(Number(driverId))) {
    throw new Error("Invalid driver ID");
  }

  try {
    // Start a transaction since we are making multiple changes
    await pool.query("BEGIN");

    // Remove driver from races drivers array
    await pool.query("UPDATE races SET drivers = array_remove(drivers, $1)", [
      driverId,
    ]);

    // Delete the driver
    const res = await pool.query(
      "DELETE FROM drivers WHERE id = $1 RETURNING *;",
      [driverId]
    );

    await pool.query("COMMIT");
    return res.rowCount > 0;
  } catch (err) {
    await pool.query("ROLLBACK");
    logger.error(err);
    throw err;
  }
};

// CREATE TABLE drivers(id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   car INTEGER,
//   current_Race INTEGER REFERENCES races(id),
//   );

// INSERT INTO drivers (name, car, current_race)
// VALUES ('Jaan Kood', 1, 1);

// SELECT * FROM drivers;
