class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("2") ? "success" : "fail";
        this.message = message;
        this.data = data;
    }

    static success(data, message = "Success") {
        return new ApiResponse(200, message, data);
    }

    static created(data, message = "Created Successfully") {
        return new ApiResponse(201, message, data);
    }

    static noContent(message = "No Content") {
        return new ApiResponse(204, message);
    }

    send(res) {
        return res.status(this.statusCode).json({
            status: this.status,
            message: this.message,
            data: this.data,
        });
    }
}

export default ApiResponse;
