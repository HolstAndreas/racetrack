// Middleware to authenticate JWT tokens
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      // return res.status(401).json({ message: "No token provided" });
      // return res.status(401).send("Unauthorized");
      logger.warning("authMiddleware.js | No token provided");
      const error = new Error("No token provided");
      error.status = 401;
      return next(error);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== requiredRole) {
        // return res.status(403).send("Insufficient permissions");
        logger.warning("authMiddleware.js | Insufficient permissions");
        const error = new Error("Insufficient permissions");
        error.status = 403;
        return next(error);
      }
      req.user = decoded;
      next();
      logger.success("authMiddleware.js | Token verified");
    } catch (err) {
      // return res.status(401).send("Invalid token");
      logger.error("authMiddleware.js | Invalid token");
      err.status = 401;
      next(err);
    }
  };
};

export default authMiddleware;
