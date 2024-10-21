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
