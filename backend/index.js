import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import analyzeRoutes from "./routes/analyze.js";
import trendingRoutes from "./routes/trending.js";
import imageAnalyzeRoutes from "./routes/imageAnalyze.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env first, then project root /.env as fallback.
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.use("/api/analyze", analyzeRoutes);   
app.use("/api/analyze-image", imageAnalyzeRoutes);
app.use("/api/trending", trendingRoutes); 


app.listen(PORT, () => console.log(`🚀 TruthGuard Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("🚀 TruthGuard Backend is Running Successfully!");
});