import { error } from "console";
import pool from "./db.js";
import logger from "../utils/logger.js";
// import Race from "../entities/Race.js";

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

// insertRace({ start_tiddme: "2023-10-01 d2$22:00:00", drivewdars: [1, a, 3] });

export async function deleteRace(id) {
  logger.info(`insertData.deleteRace(id:${id})`);
  const res = await pool.query("DELETE FROM races WHERE id = $1", [id]);
  console.log(`Deleted race with ID: ${id}`);
}

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

export const postDriverToRace = async (raceId, drivers) => {
  logger.info(
    `retrieveData.postDriverToRace(raceId:${raceId}, drivers:${drivers})`
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

export const postCarToDriver = async (driverId, carId) => {
  logger.info(
    `retrieveData.postCarToDriver(driverId:${driverId}, carId:${carId})`
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

// CREATE TABLE races (
//   id SERIAL PRIMARY KEY,
//   start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   drivers INTEGER[],
//   remaining_time INTEGER DEFAULT 600,
//   status VARCHAR(50) DEFAULT 'WAITING',
//   mode VARCHAR(50) DEFAULT 'DANGER'
//   );

//   CREATE TABLE drivers(id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     car INTEGER,
//     current_Race INTEGER REFERENCES races(id),
//     lap_times INTEGER[]
//     );

//     INSERT INTO races (start_time, remaining_time, status, mode)
// VALUES ('2023-10-01 12:00:00', 600, 'WAITING', 'DANGER');

// INSERT INTO drivers (name, car, current_race, lap_times)
// VALUES ('Jaan Kood', 1, 1, ARRAY[90, 92, 88]);

// SELECT * FROM races;

// SELECT * FROM drivers;

// SELECT d.name, d.car, r.start_time, d.lap_times
// FROM drivers d
// JOIN races r ON d.current_race = r.id;

// CREATE TABLE lap_times (
//   id SERIAL PRIMARY KEY,
//   driver_id INTEGER REFERENCES drivers(id),
//   race_id INTEGER REFERENCES races(id),
//   lap_time INTEGER,
//   lap_number INTEGER,
//   UNIQUE(driver_id, race_id, lap_number)
// );
