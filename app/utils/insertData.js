// import { pool } from "../utils/db.js";

async function insertData() {
  const [name, color] = process.argv.slice(2);
  const res = await pool.query(
    "INSERT INTO shark (name, color) VALUES ($1, $2)",
    [name, color]
  );
  console.log(`Added a shark with the name ${name}`);
}

insertData();

// CREATE TABLE races (
//   id SERIAL PRIMARY KEY,
//   start_time TIMESTAMP,
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
