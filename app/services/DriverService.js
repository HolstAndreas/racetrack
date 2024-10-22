import * as insertData from "../utils/insertData.js";
import Driver from "../entities/Driver.js";
import logger from "../utils/logger.js";

export const createDriver = async (name) => {
  const driver = new Driver(name);
  logger.info("DriverService.createDriver" + JSON.stringify(driver));
  driver.id = await insertData.insertDriver(name);
  logger.info("DriverService.createDriver" + JSON.stringify(driver));
  return driver;
};
