import express from "express";
import { analyzeText } from "../services/aiService.js";

const router = express.Router();

router.post("/", analyzeText);

export default router;
