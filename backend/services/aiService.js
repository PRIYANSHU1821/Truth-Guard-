import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Act as VeriScope, an intelligent misinformation detection assistant.
    Analyze the following text: "${text}"

    Your Tasks:
    1. Detect the language of the input text (e.g., English, Indonesian, Spanish, etc.).
    2. Provide the analysis strictly in JSON format.
    3. BOTH the "label" and "explanation" fields MUST be in the SAME LANGUAGE as the input text.

    JSON OUTPUT FORMAT (No Markdown):
    {
      "label": "Classify the text into one of these 4 categories and TRANSLATE the label into the detected language: 'Likely Misinformation', 'Questionable / Unverified', 'Likely Factual', 'Satire / Opinion'",
      "confidence": (float between 0.0 - 1.0),
      "explanation": "Concise explanation (max 3 sentences) in the SAME LANGUAGE as the input text."
    }
  `;

  // --- auto retry (max 3x) ---
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let textResponse = response.text();

      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON format returned by the AI");

      const jsonResponse = JSON.parse(jsonMatch[0]);

      return res.json(jsonResponse);

    } catch (error) {
      console.error(`⚠️ Attempt #${attempts} Failed: ${error.message}}`);

      const isOverloaded = error.message.includes("503") || error.message.includes("Overloaded");

      if (attempts < maxAttempts && isOverloaded) {
        console.log("⏳ Waiting 2 seconds before retrying....");
        await sleep(2000); 
        continue; 
      }

      return res.status(500).json({
        error: "Analysis Failed (Server Busy)",
        detail: "The AI is currently experiencing high traffic. Please try again shortly.",
        tech_message: error.message
      });
    }
  }
};