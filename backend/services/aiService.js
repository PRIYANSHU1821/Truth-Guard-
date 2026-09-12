import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to extract and parse JSON from LLM responses
const parseJsonResponse = (textResponse) => {
  const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid JSON format returned by the AI");
  }
  return JSON.parse(jsonMatch[0]);
};

// Provider 1: Google Gemini (Supports Google Search Grounding for real-time news!)
const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("your_")) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // Enable Google Search tool to fetch live real-time information for news checking!
    tools: [{ googleSearch: {} }]
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Provider 2: Groq API (Fallback)
const callGroq = async (prompt) => {
  const apiKey = (process.env.GROQ_API_KEY || "").replace(/"/g, "").trim();
  if (!apiKey || apiKey.includes("your_")) {
    throw new Error("Groq API key is not configured.");
  }

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    },
    {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 12000 // 12 second timeout
    }
  );

  return response.data.choices[0].message.content;
};

// Provider 3: OpenRouter API (Second Fallback)
const callOpenRouter = async (prompt) => {
  const apiKey = (process.env.OPENROUTER_API_KEY || "").replace(/"/g, "").trim();
  if (!apiKey || apiKey.includes("your_")) {
    throw new Error("OpenRouter API key is not configured.");
  }

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3.3-70b-instruct", // Verified working OpenRouter model
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/fatiya17/ai-misinformation-detector",
        "X-Title": "TruthGuard Misinformation Detector"
      },
      timeout: 12000 // 12 second timeout
    }
  );

  return response.data.choices[0].message.content;
};

// Helper to search real-time fact checks using Google Fact Check Tools API
const fetchFactCheckContext = async (query) => {
  try {
    const googleKey = process.env.GOOGLE_API_KEY;
    if (!googleKey || googleKey.includes("your_")) {
      return "No valid GOOGLE_API_KEY configured for search grounding.";
    }

    const response = await axios.get(
      "https://factchecktools.googleapis.com/v1alpha1/claims:search",
      {
        params: {
          key: googleKey,
          query: query,
          languageCode: "en",
          pageSize: 5
        },
        timeout: 5000
      }
    );

    const claims = response.data.claims || [];
    if (claims.length === 0) {
      return "No matching fact checks found on Google Fact Check Tools API for this claim/query.";
    }

    return claims
      .map((item, index) => {
        const review = item.claimReview?.[0] || {};
        return `${index + 1}. Claim: "${item.text}" by ${item.claimant || "Unknown"}\n   Verdict: ${review.textualRating || "Unverified"}\n   Publisher: ${review.publisher?.name || "Unknown"}\n   URL: ${review.url || "N/A"}`;
      })
      .join("\n\n");
  } catch (err) {
    console.warn(`⚠️ Failed to fetch fact check context: ${err.message}`);
    return "Could not retrieve real-time fact check context due to API error/restrictions.";
  }
};

export const analyzeText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text or Link is required" });
  }

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

  // Pipeline Attempt Chain: Gemini (with search) -> Groq (Llama) -> OpenRouter
  try {
    console.log("⚡ Attempting verification with Gemini API (Google Search Grounding)...");
    const rawResponse = await callGemini(prompt);
    const resultJson = parseJsonResponse(rawResponse);
    console.log("✅ Success using Gemini!");
    return res.json(resultJson);
  } catch (geminiError) {
    console.warn(`⚠️ Gemini API failed: ${geminiError.message}`);
    
    // Fetch live fact-check data to ground the fallback models
    console.log("🔍 Fetching live fact-check context for fallback models...");
    let factCheckContext = "";
    try {
      factCheckContext = await fetchFactCheckContext(text);
      console.log("ℹ️ Live fact-check context fetched successfully.");
    } catch (contextError) {
      console.warn(`⚠️ Error fetching fact-check context: ${contextError.message}`);
      factCheckContext = "Could not retrieve real-time fact check context.";
    }

    const fallbackPrompt = `
      ${prompt}
      
      ======================================================
      ADDITIONAL REAL-TIME CONTEXT (Ground your analysis here):
      We queried the Google Fact Check Tools API for the user's input/query and found the following reviews:
      ---
      ${factCheckContext}
      ---
      Please incorporate this real-time fact-check context into your analysis. Even if your internal knowledge is outdated, prioritize the fact-check context above to formulate the correct "label" and "explanation".
      ======================================================
    `;

    // Check if Gemini failed due to quota/rate limits
    try {
      console.log("⚡ Falling back: Attempting verification with Groq API (Llama 3.3)...");
      const rawResponse = await callGroq(fallbackPrompt);
      const resultJson = parseJsonResponse(rawResponse);
      console.log("✅ Success using Groq!");
      return res.json(resultJson);
    } catch (groqError) {
      console.warn(`⚠️ Groq API failed: ${groqError.message}`);

      try {
        console.log("⚡ Falling back: Attempting verification with OpenRouter API...");
        const rawResponse = await callOpenRouter(fallbackPrompt);
        const resultJson = parseJsonResponse(rawResponse);
        console.log("✅ Success using OpenRouter!");
        return res.json(resultJson);
      } catch (openRouterError) {
        console.error(`❌ All AI providers failed. OpenRouter error: ${openRouterError.message}`);

        return res.status(500).json({
          error: "Service Temporarily Unavailable",
          detail: "All AI analysis services are currently busy or out of quota. Please try again in a few moments."
        });
      }
    }
  }
};

export const analyzeImage = async (req, res) => {
  const { image, mimeType = "image/jpeg", cropBox } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image data (base64) is required" });
  }

  // Clean base64 string if data URL prefix exists
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

  const cropInfoText = cropBox
    ? `(Focus specifically on the cropped ROI bounding box area)`
    : "";

  const prompt = `
    Act as TruthGuard Lens, an advanced Google Lens-like Optical Character Recognition (OCR) and Misinformation Detection Assistant. ${cropInfoText}

    Your Tasks:
    1. **OCR Extraction**: Extract ALL readable text, headlines, claims, quote text, or overlay text in the image/snippet accurately.
    2. **Verification & Fact Checking**: Verify the extracted claims against reliable facts and determine whether it is genuine news, satire, unverified, or misinformation.
    3. **Detect Language**: Identify the primary language of the text in the image.
    4. **Output**: Return strictly valid JSON format.
    5. **Language Consistency**: The "label" and "explanation" MUST be translated into the SAME LANGUAGE as the extracted text.

    JSON OUTPUT FORMAT (Pure JSON object, no Markdown code blocks):
    {
      "extractedText": "Exact text extracted from the scanned area",
      "label": "Classify into one of: 'Likely Misinformation', 'Questionable / Unverified', 'Likely Factual', 'Satire / Opinion'",
      "confidence": 0.95,
      "explanation": "Concise explanation (max 3 sentences) verifying the claim in the SAME LANGUAGE as the image text."
    }
  `;

  // Attempt 1: Gemini Direct API with models gemini-2.5-flash / gemini-1.5-flash
  const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro"];

  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("your_")) {
    for (const modelName of geminiModels) {
      try {
        console.log(`⚡ Attempting image OCR analysis with Gemini (${modelName})...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const rawText = response.text();
        const resultJson = parseJsonResponse(rawText);

        console.log(`✅ Success using Gemini Vision OCR (${modelName})!`);
        return res.json(resultJson);
      } catch (err) {
        console.warn(`⚠️ Gemini (${modelName}) failed: ${err.message}`);
      }
    }
  }

  // Attempt 2: Fallback to OpenRouter Vision API (google/gemini-2.5-flash)
  try {
    console.log("⚡ Falling back: Attempting vision analysis with OpenRouter (google/gemini-2.5-flash)...");
    const apiKey = (process.env.OPENROUTER_API_KEY || "").replace(/"/g, "").trim();
    if (!apiKey || apiKey.includes("your_")) {
      throw new Error("OpenRouter API key is not configured.");
    }

    const openRouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Data}`
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/fatiya17/ai-misinformation-detector",
          "X-Title": "TruthGuard Misinformation Detector"
        },
        timeout: 25000
      }
    );

    const rawText = openRouterResponse.data.choices[0].message.content;
    const resultJson = parseJsonResponse(rawText);

    console.log("✅ Success using OpenRouter Vision OCR!");
    return res.json(resultJson);
  } catch (openRouterError) {
    console.error(`❌ OpenRouter Vision failed: ${openRouterError.message}`);
    
    return res.status(500).json({
      error: "Image OCR Processing Failed",
      detail: "Vision AI service is currently busy or updating. Please try scanning text directly using the Text tab."
    });
  }
};