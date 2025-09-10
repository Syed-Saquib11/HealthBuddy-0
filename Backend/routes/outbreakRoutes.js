import express from "express";
import Outbreak from "../models/Outbreak.js";
import { createOutbreak } from "../controllers/outbreakController.js";

const router = express.Router();

router.post("/", createOutbreak);

// GET hot outbreaks - Top diseases with severity and case counts
router.get("/", async (req, res) => {
  try {
    // Query top outbreaks sorted by severity and recent date
    const outbreaks = await Outbreak.find()
      .sort({ severity: -1, date_reported: -1, cases_reported: -1 })
      .limit(10);
    res.json(outbreaks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
