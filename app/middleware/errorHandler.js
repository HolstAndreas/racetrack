import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

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

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            status: "fail",
            message: "Invalid token",
        });
    }

    // Default error
    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export default errorHandler;
