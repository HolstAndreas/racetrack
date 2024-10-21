// äpp peaks käivituma package.json scripti järgi, konsoolis:
// npm run dev
console.log("Hello World");

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getRaceById } from "./controllers/raceController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
