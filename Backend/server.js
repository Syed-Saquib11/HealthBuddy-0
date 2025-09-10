import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import diseaseRoutes from "./routes/DiseaseRoutes.js";
import outbreakRoutes from "./routes/outbreakRoutes.js"
import reportedOutbreakRoutes from "./routes/reportedOutbreakRoutes.js";
import allOutbreaksRoutes from "./routes/allOutbreaksRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/diseases", diseaseRoutes);
app.use("/api/outbreaks", outbreakRoutes);

app.use("/api/reported_outbreaks", reportedOutbreakRoutes);

app.use("/api/all-outbreaks", allOutbreaksRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
