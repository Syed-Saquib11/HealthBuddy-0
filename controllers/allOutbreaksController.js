import Outbreak from "../models/Outbreak.js";
import ReportedOutbreak from "../models/ReportedOutbreak.js";

export const getAllOutbreaks = async (req, res) => {
  try {
    const official = await Outbreak.find().lean();
    const userReports = await ReportedOutbreak.find().lean();

    // Add a flag to distinguish data source
    const officialWithFlag = official.map(item => ({ ...item, source: "official" }));
    const userWithFlag = userReports.map(item => ({ ...item, source: "user" }));

    // Combine and sort by date_reported/created_at descending
    const combined = [...officialWithFlag, ...userWithFlag].sort((a, b) => {
      const dateA = new Date(a.date_reported || a.created_at);
      const dateB = new Date(b.date_reported || b.created_at);
      return dateB - dateA;
    });

    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
