import express from "express";
import { createReportedOutbreak, getReportedOutbreaks } from "../controllers/reportedOutbreakController.js";

const router = express.Router();

router.post("/", createReportedOutbreak);   // POST /api/reported-outbreaks
router.get("/", getReportedOutbreaks);      // GET /api/reported-outbreaks
router.get("/", getReportedOutbreaks);

export default router;
