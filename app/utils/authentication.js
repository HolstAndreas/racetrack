// Route to handle authentication

import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const router = express.Router();

const VALID_ACCESS_KEYS = {
  receptionist_key: process.env.receptionist_key,
  observer_key: process.env.observer_key,
  safety_key: process.env.safety_key,
};

router.post("/", (req, res) => {
  const { accessKey, role } = req.body;

  if (!accessKey || !role) {
    logger.warning(
      `authentication.js | Access key or role is required: ${accessKey} on role ${role}`
    );
    setTimeout(() => {
      return res.status(400).json({ message: `Access key is required` });
    }, 500);
    return;
  }

  if (VALID_ACCESS_KEYS[role + "_key"] !== accessKey) {
    logger.warning(
      `authentication.js | Invalid access key: ${accessKey} on role ${role}`
    );
    setTimeout(() => {
      return res.status(401).json({ message: `Invalid access key` });
    }, 500);
    return;
  }

  const payload = { role };

  // Sign the token with the secret key and set an expiration time
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // set to true in production
    sameSite: "strict",
    maxAge: 36000000, // 1 hour
  });

  logger.success("Authentication successful");
  res.json({ message: "Authentication successful" });
});

export default router;
