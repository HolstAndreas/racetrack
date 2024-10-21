import { pool } from "db.js";

async function insertData() {
  const [name, color] = process.argv.slice(2);
  console.log(name, color);
}

insertData();
