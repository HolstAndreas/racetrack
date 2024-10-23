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
    return res;
};

export const findAll = async () => {
    logger.info(`DriverService.findAll()`);
    const res = await DriverRepository.findAll();
    return res;
};

export const assignCarToDriver = async (driverId, carId) => {
    logger.info(
        `DriverService.assignCarToDriver(driverId: ${driverId}, carId: ${carId})`
    );
    try {
        // Check if driver exists
        const driverExists = await DriverRepository.checkDriverExists(driverId);
        if (!driverExists) {
            logger.error(
                `DriverService.assignCarToDriver() | Driver ${driverId} not found `
            );
            return { error: "DRIVER_NOT_FOUND" };
        }

        // Check if any other driver has this car
        const carDrivers = await DriverRepository.getDriversByCar(carId);
        if (carDrivers.length > 0) {
            console.log(carDrivers[0].id);
            return { error: "CAR_TAKEN_BY", id: carDrivers[0].id };
        }

        const result = await DriverRepository.postCarToDriver(driverId, carId);
        return result[0];
    } catch (err) {
        logger.error(`DriverService.assignCarToDriver() | Error: ${err}`);
        return { error: "UNKNOWN_ERROR" };
    }
};
