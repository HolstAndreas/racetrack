import * as insertData from "../utils/insertData.js";
import Driver from "../entities/Driver.js";
import logger from "../utils/logger.js";

export const createDriver = async (name) => {
  // const driver = new Driver(name);
  logger.info(`DriverService.createDriver(name:${name})`);
  const res = await insertData.insertDriver(name);
  return res[0];
};
