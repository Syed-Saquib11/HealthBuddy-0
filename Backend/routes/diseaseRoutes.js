import express from "express";
import Disease from "../models/Disease.js";

const router = express.Router();

// GET all diseases
router.get("/", async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
