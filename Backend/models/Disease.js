import mongoose from "mongoose";

const diseaseSchema = mongoose.Schema({
  name: { type: String, required: true },
  symptoms: [String],
  precautions: [String],
  severity: String,
});

const Disease = mongoose.model("Disease", diseaseSchema);

export default Disease;
