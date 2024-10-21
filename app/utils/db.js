// import * as pg from "pg";
// const { Pool } = pg;

import pkg from "pg";
const { Pool } = pkg;

// import { Pool } from "pg/lib/index.js"

const pool = new Pool({
  user: "andreas",
  database: "racetrack",
  password: "koodjohvi",
  port: 5432,
  host: "localhost",
});

export { pool as default };
