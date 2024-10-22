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
export async function getRaceById(id) {
  logger.info("retrieveData.js - getRaceById: " + id);
  try {
    const res = await pool.query("SELECT * FROM races WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
}

export const getRaceModeById = async (id) => {
  logger.info("retrieveData.js - getRaceModeById: " + id);
  try {
    const res = await pool.query("SELECT mode FROM races WHERE id = $1;", [id]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};

export const getRemainingTimeById = async (id) => {
  logger.info("retrieveData.js - getRemainingTimeById: " + id);
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
  logger.info("retrieveData.js - getNextRace");
  try {
    const res = await pool.query("SELECT * FROM races WHERE id = $1;", [
      id + 1,
    ]);
    return res.rows;
  } catch (err) {
    logger.error(err);
  }
};
