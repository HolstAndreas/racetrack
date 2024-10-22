import { error } from "console";
import pool from "./db.js";
import logger from "../utils/logger.js";

export async function insertData() {
  const [name, color] = process.argv.slice(2);
  const res = await pool.query(
    "INSERT INTO shark (name, color) VALUES ($1, $2)",
    [name, color]
  );
  console.log(`Added a shark with the name ${name}`);
}

// insertRace({ start_time: "2023-10-01 12:00:00", drivers: [1, 2, 3] });
// Added a race with the start time 2023-10-01 12:00:00, generated ID: 3
export async function insertRace(race) {
  try {
    const res = await pool.query(
      "INSERT INTO races (start_time, drivers) VALUES ($1, $2) RETURNING id",
      [race.start_time, race.drivers]
    );
    const raceId = res.rows[0].id;
    console.log(
      `Added a race with the start time ${race.start_time}, generated ID: ${raceId}`
    );
  } catch (e) {
    throw error;
  }
}

// insertRace({ start_tiddme: "2023-10-01 d2$22:00:00", drivewdars: [1, a, 3] });

export async function deleteRace(id) {
  const res = await pool.query("DELETE FROM races WHERE id = $1", [id]);
  console.log(`Deleted race with ID: ${id}`);
}

export async function insertDriver(driver) {
  logger.info("insertData.js - createDriver: " + driver);
  try {
    const res = await pool.query(
      "INSERT INTO drivers (name) VALUES ($1) RETURNING id",
      [driver]
    );
    const driverId = res.rows[0].id;
    logger.info(
      `Added a driver with a name ${driver}, generated ID: ${driverId}`
    );
    return driverId;
  } catch (err) {
    throw err;
  }
}

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
