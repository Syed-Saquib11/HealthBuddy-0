import mongoose from "mongoose";

const outbreakSchema = new mongoose.Schema({
  disease_name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
  cases_reported: { type: Number, required: true },
  date_reported: { type: Date, required: true },
});

const Outbreak = mongoose.model("Outbreak", outbreakSchema);
export default Outbreak;
