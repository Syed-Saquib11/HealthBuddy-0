import express from "express";
import { getAllOutbreaks } from "../controllers/allOutbreaksController.js";

const router = express.Router();

router.get("/", getAllOutbreaks);

export default router;
