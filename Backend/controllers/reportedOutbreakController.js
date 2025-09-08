import ReportedOutbreak from "../models/ReportedOutbreak.js";

// Create a new reported outbreak
export const createReportedOutbreak = async (req, res) => {
  try {
    const newReport = new ReportedOutbreak(req.body);
    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully", report: newReport });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reported outbreaks (could add filters/pagination if needed)
export const getReportedOutbreaks = async (req, res) => {
  try {
    const reports = await ReportedOutbreak.find().sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

