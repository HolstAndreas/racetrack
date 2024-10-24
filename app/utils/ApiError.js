class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, details = null) {
        return new ApiError(400, message || "Bad Request", details);
    }

    static unauthorized(message, details = null) {
        return new ApiError(401, message || "Unauthorized", details);
    }

    static forbidden(message, details = null) {
        return new ApiError(403, message || "Forbidden", details);
    }

    static notFound(message, details = null) {
        return new ApiError(404, message || "Not Found", details);
    }

    static conflict(message, details = null) {
        return new ApiError(409, message || "Conflict", details);
    }

    static internal(message, details = null) {
        return new ApiError(500, message || "Internal Server Error", details);
    }
}

export default ApiError;
