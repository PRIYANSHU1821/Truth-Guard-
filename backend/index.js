import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyze.js";
import trendingRoutes from "./routes/trending.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/analyze", analyzeRoutes);   
app.use("/api/trending", trendingRoutes); 

app.listen(PORT, () => console.log(`🚀 WonderAI Server running on port ${PORT}`));