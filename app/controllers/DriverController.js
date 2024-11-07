import * as DriverService from "../services/DriverService.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Get all drivers
export const getAllDrivers = async (req, res, next) => {
  try {
    logger.info("DriverController.getAllDrivers()");
    const drivers = await DriverService.findAll();
    return ApiResponse.success(drivers, "Drivers retrieved successfully").send(
      res
    );
  } catch (error) {
    next(error);
  }
};

// Get driver by ID
export const getDriverById = async (req, res, next) => {
  try {
    const { driverId } = req.params;
    logger.info(`DriverController.getDriverById(driverId:${driverId})`);

    const driver = await DriverService.findById(driverId);
    logger.debug(
      `DriverController.getDriverById | Retrieved driver: ${JSON.stringify(
        driver
      )}`
    );

    if (!driver) {
      throw ApiError.notFound("Driver not found");
    }

    return ApiResponse.success(driver, "Driver retrieved successfully").send(
      res
    );
  } catch (error) {
    next(error);
  }
};

export const postDriver = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw ApiError.badRequest("Name is required");
    }
    if (name.length < 3) {
      throw ApiError.badRequest("Name must be at least 3 characters long");
    }

    logger.info(`DriverController.postDriver(name:${name})`);
    const result = await DriverService.createDriver(name);

    if (result.error) {
      switch (result.error) {
        case "DRIVER_ALREADY_EXISTS":
          throw ApiError.badRequest("Driver already exists.");
        default:
          throw ApiError.internal("Internal server error.");
      }
    } else {
      return ApiResponse.created(result, "Driver created successfully").send(
        res
      );
    }
  } catch (error) {
    next(error);
  }
};

// Patch by ID
export const patchDriverById = async (req, res, next) => {
  const { driverId } = req.params;
  const { name } = req.body;
  try {
    if (!name || name.length < 3) {
      throw ApiError.badRequest("Name must be at least 3 characters long");
    }

    const updatedDriver = await DriverService.updateDriver(driverId, name);
    if (updatedDriver.error) {
      switch (updatedDriver.error) {
        case "DRIVER_ALREADY_EXISTS":
          throw ApiError.badRequest("Driver already exists.");
        case "DRIVER_NOT_FOUND":
          throw ApiError.notFound("Driver not found");
        case "DRIVER_RACING":
          throw ApiError.conflict(`Driver is currently racing`);
        default:
          throw ApiError.internal("Failed to change driver name.");
      }
    }
    if (!updatedDriver) {
      throw ApiError.notFound("Driver not found");
    }

    return ApiResponse.success(
      updatedDriver,
      "Driver updated successfully"
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// DELETE by ID
export const deleteDriverById = async (req, res, next) => {
  const { driverId } = req.params;
  try {
    const deleted = await DriverService.deleteDriver(driverId);
    if (deleted.error) {
      switch (deleted.error) {
        case "DRIVER_NOT_FOUND":
          throw ApiError.notFound("Driver not found");
        case "DRIVER_RACING":
          throw ApiError.conflict(`Driver is currently racing`);
        default:
          throw ApiError.internal("Failed to delete driver");
      }
    }
    if (!deleted) {
      throw ApiError.notFound("Driver not found");
    }
    return ApiResponse.noContent("Driver deleted successfully").send(res);
  } catch (error) {
    next(error);
  }
};

// Assign car to driver
export const assignCarToDriver = async (req, res, next) => {
  try {
    const { driverId, carId } = req.params;
    logger.info(
      `DriverController.assignCarToDriver(driverId:${driverId}, carId:${carId})`
    );

    const result = await DriverService.assignCarToDriver(driverId, carId);
    if (result.error) {
      switch (result.error) {
        case "DRIVER_NOT_FOUND":
          throw ApiError.notFound("Driver not found");
        case "CAR_TAKEN_BY":
          throw ApiError.conflict(
            `Car is already taken by driver: ${result.id}`
          );
        case "DRIVER_RACING":
          throw ApiError.conflict(`Driver is currently racing`);
        default:
          throw ApiError.internal("Failed to assign car to driver");
      }
    }

    return ApiResponse.success(
      result,
      "Car assigned to driver successfully"
    ).send(res);
  } catch (error) {
    next(error);
  }
};
