import Pool from "pg";

const pool = new Pool({
  user: "andreas",
  database: "racetrack",
  password: "koodjohvi",
  port: 5432,
  host: "localhost",
});

export default pool;
