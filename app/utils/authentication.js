// Route to handle authentication

import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const VALID_ACCESS_KEYS = {
    receptionist_key: "8ded6076",
    observer_key: "662e0f6c",
    safety_key: "a2d393bc",
};

router.post("/", (req, res) => {
    const { accessKey, role } = req.body;

    if (!accessKey) {
        return res.status(400).json({ message: "Access key is required" });
    }

    if (VALID_ACCESS_KEYS[role] !== accessKey) {
        return res.status(401).json({ message: "Invalid access key" });
    }

    const payload = { accessKey, role };

    // Sign the token with the secret key and set an expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({ token });
});

export default router;
