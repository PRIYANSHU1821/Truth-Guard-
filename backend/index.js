import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const hfResponse = await axios.post(
      HF_API_URL,
      {
        inputs: text,
        parameters: {
          candidate_labels: [
            "misinformation",
            "potentially misleading",
            "likely factual",
          ],
        },
        options: { wait_for_model: true }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let result = hfResponse.data;

    if (Array.isArray(result)) {
      result = result[0];
    }

    const finalLabel = result.labels ? result.labels[0] : result.label;
    const finalScore = result.scores ? result.scores[0] : result.score;

    if (finalLabel !== undefined) {
      res.json({
        label: finalLabel,
        confidence: finalScore,
        explanation: generateExplanation(finalLabel),
      });
    } else {
      res.status(500).json({
        error: "Format data tidak dikenali",
        raw: result
      });
    }

  } catch (error) {
    console.error("HuggingFace Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI analysis failed",
      detail: error.response?.data || error.message,
    });
  }
});

function generateExplanation(label) {
  if (label === "misinformation") {
    return "The content shows patterns commonly associated with misinformation, such as unverified claims or absolute statements.";
  }
  if (label === "potentially misleading") {
    return "The content may lack full context or use ambiguous language that could mislead readers.";
  }
  return "The content appears consistent with factual and neutral language patterns.";
}

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
