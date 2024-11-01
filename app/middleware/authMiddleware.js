// Middleware to authenticate JWT tokens
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      logger.warning("authMiddleware.js | No token provided");
      const error = new Error("No token provided");
      error.status = 401;
      return next(error);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== requiredRole) {
        logger.warning("authMiddleware.js | Insufficient permissions");
        const error = new Error("Insufficient permissions");
        error.status = 403;
        return next(error);
      }
      req.user = decoded;
      next();
      logger.success("authMiddleware.js | Token verified");
    } catch (err) {
      logger.error("authMiddleware.js | Invalid token");
      const error = new Error(err.message);
      error.name = err.name;
      error.status = 401;
      return next(error);
    }
  };
};

export default authMiddleware;
