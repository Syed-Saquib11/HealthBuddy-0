import Outbreak from "../models/Outbreak.js";

export const createOutbreak = async (req, res) => {
  try {
    const newOutbreak = new Outbreak(req.body);
    await newOutbreak.save();
    res.status(201).json({ message: "Outbreak report created", outbreak: newOutbreak });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
