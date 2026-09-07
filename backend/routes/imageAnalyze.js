import express from "express";
import { analyzeImage } from "../services/aiService.js";

const router = express.Router();

router.post("/", analyzeImage);

export default router;
