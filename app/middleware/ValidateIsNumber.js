import logger from "../utils/logger.js";

export const validateIsNumber = (req, res, next) => {
  const { raceId } = req.params;
  const id = parseInt(raceId, 10);
  logger.info(`ValidateIsNumber.validateIsNumber(${raceId})`);
  if (isNaN(id)) {
    logger.error(`ValidateIsNumber.validateIsNumber | NaN`);
    return res.status(400).json({ error: "Invalid data" });
  }
  next();
};

export default validateIsNumber;
