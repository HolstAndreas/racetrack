import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import path from "path";
import { fileURLToPath } from "url";

// Defined __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      details: err.details,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Handle JWT errors for specific status codes
  if (err.name === "TokenExpiredError") {
    return res.redirect("../../401.html");
  }

  if (err.name === "JsonWebTokenError" || err.status === 401) {
    res.status(401);
    return res.sendFile(path.join(__dirname, "../../401.html"));
  }

  if (err.status === 403) {
    res.status(403);
    return res.sendFile(path.join(__dirname, "../../403.html"));
  }

  // Default error
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
