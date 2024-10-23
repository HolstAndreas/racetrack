import * as DriverRepository from "../repositories/DriverRepository.js";
import Driver from "../entities/Driver.js";
import logger from "../utils/logger.js";

export const createDriver = async (name) => {
  // const driver = new Driver(name);
  logger.info(`DriverService.createDriver(name:${name})`);
  const res = await DriverRepository.insertDriver(name);
  return res[0];
};

export const findById = async (id) => {
  logger.info(`DriverService.findById(id:${id})`);
  const res = await DriverRepository.findById(id);
  return res[0];
};

export const findAll = async () => {
  logger.info(`DriverService.findAll()`);
  const res = await DriverRepository.findAll();
  return res;
};
