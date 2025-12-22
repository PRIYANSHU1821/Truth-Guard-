import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text or Link is required" });

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Act as VeriScope, an intelligent misinformation detection assistant.
    
    The user has provided the following INPUT (It could be a direct text article OR a URL link):
    "${text}"

    Your Tasks:
    1. **Identify the Input Type**: Determine if the input is a direct text or a URL.
    2. **Analyze**: 
       - If it's **TEXT**: Analyze the claims, logical fallacies, and factual accuracy.
       - If it's a **URL**: Analyze the credibility of the domain/source, the typical reliability of content from this URL, and if possible, the specific story mentioned in the URL slug. If you cannot access the live content, analyze based on the source's reputation and URL pattern.
    3. **Detect Language**: Detect the language of the input (e.g., English, Indonesian, etc.).
    4. **Output**: Provide the result strictly in JSON format.
    5. **Language**: BOTH the "label" and "explanation" fields MUST be in the SAME LANGUAGE as the input.

    JSON OUTPUT FORMAT (No Markdown, pure JSON):
    {
      "label": "Classify into one of these 4 categories (Translate this label to the detected language): 'Likely Misinformation', 'Questionable / Unverified', 'Likely Factual', 'Satire / Opinion'",
      "confidence": (float between 0.0 - 1.0 representing your certainty),
      "explanation": "Concise explanation (max 3 sentences) why you gave this verdict, in the SAME LANGUAGE as the input."
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
      console.error(`⚠️ Attempt #${attempts} Error: ${error.message}`);

      // --- limit ---
      if (error.message.includes("429") || error.message.includes("Quota") || error.message.includes("resource has been exhausted")) {
        return res.status(429).json({
          error: "Usage Limit Reached",
          detail: "Daily AI limit reached. We’re currently experiencing high demand. Please try again later or contact support. Thank you for visiting.𖹭"
        });
      }

      // retry logic untuk error (503/Overloaded)
      const isOverloaded = error.message.includes("503") || error.message.includes("Overloaded");
      if (attempts < maxAttempts && isOverloaded) {
        await sleep(2000); 
        continue; 
      }

      return res.status(500).json({
        error: "Server Error",
        detail: "AI Service is temporarily unavailable. Please try again.",
      });
    }
  }
};