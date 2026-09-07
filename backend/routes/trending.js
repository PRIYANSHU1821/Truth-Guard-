import express from "express";
import axios from "axios";

const router = express.Router();

const getFallbackTrendingClaims = async () => {
  const prompt = `
    Act as VeriScope Misinformation Intelligence.
    Provide a list of 10 currently viral or recent trending news misinformation claims circulating globally across Health, Politics, Technology, and Society.

    Return ONLY a valid JSON array of objects with the following keys for each claim:
    [
      {
        "title": "Claim headline or statement being debunked",
        "claimant": "Who spread it (e.g. Social Media Posts, Viral Video, Telegram Channels)",
        "date": "2026-07-25",
        "status": "False",
        "source": "Snopes / Reuters Fact Check / AFP / PolitiFact",
        "url": "https://www.snopes.com"
      }
    ]
  `;

  // Try Groq first
  const groqKey = (process.env.GROQ_API_KEY || "").replace(/"/g, "").trim();
  if (groqKey && !groqKey.includes("your_")) {
    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );
      const rawText = res.data.choices[0].message.content;
      const jsonMatch = rawText.match(/\[[\s\S]*\]/) || rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed : (parsed.claims || parsed.trending || []);
      }
    } catch (e) {
      console.warn("Groq fallback for trending failed:", e.message);
    }
  }

  // Try OpenRouter next
  const openRouterKey = (process.env.OPENROUTER_API_KEY || "").replace(/"/g, "").trim();
  if (openRouterKey && !openRouterKey.includes("your_")) {
    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "meta-llama/llama-3.3-70b-instruct",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );
      const rawText = res.data.choices[0].message.content;
      const jsonMatch = rawText.match(/\[[\s\S]*\]/) || rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed : (parsed.claims || parsed.trending || []);
      }
    } catch (e) {
      console.warn("OpenRouter fallback for trending failed:", e.message);
    }
  }

  // Hardcoded default fallback list if all APIs fail
  return [
    {
      title: "AI-generated video falsely claims major global power outage scheduled for next week",
      claimant: "Viral TikTok & X Posts",
      date: "2026-07-25",
      status: "False",
      source: "Reuters Fact Check",
      url: "https://www.reuters.com/fact-check"
    },
    {
      title: "Drinking warm saltwater immunizes against new seasonal respiratory virus strains",
      claimant: "WhatsApp & Telegram Messages",
      date: "2026-07-28",
      status: "False",
      source: "WHO & Snopes",
      url: "https://www.snopes.com"
    },
    {
      title: "Central Banks silently replacing physical cash with mandatory microchips next month",
      claimant: "Facebook Posts",
      date: "2026-07-20",
      status: "False",
      source: "AFP Fact Check",
      url: "https://factcheck.afp.com"
    }
  ];
};

router.get("/", async (req, res) => {
  try {
    const googleKey = (process.env.GOOGLE_API_KEY || "").replace(/"/g, "").trim();

    if (googleKey && !googleKey.includes("your_") && !googleKey.startsWith("AQ.Ab")) {
      const response = await axios.get(
        "https://factchecktools.googleapis.com/v1alpha1/claims:search",
        {
          params: {
            key: googleKey,
            query: "misinformation", 
            languageCode: "en",      
            pageSize: 20,
            maxAgeDays: 90
          },
          timeout: 5000
        }
      );

      const claims = response.data.claims || [];
      if (claims.length > 0) {
        const cleanData = claims.map((item) => ({
          title: item.text,
          claimant: item.claimant || "Social Media",
          date: item.claimDate,
          status: item.claimReview[0]?.textualRating || "Unverified",
          source: item.claimReview[0]?.publisher?.name || "Fact Check Source",
          url: item.claimReview[0]?.url
        }));

        return res.json(cleanData);
      }
    }

    // Fallback to Groq / OpenRouter / AI generator if Google API fails or is invalid
    console.log("ℹ️ Fetching trending claims using AI fallback pipeline...");
    const fallbackClaims = await getFallbackTrendingClaims();
    return res.json(fallbackClaims);

  } catch (error) {
    console.warn("⚠️ Google Fact Check API failed, using AI fallback:", error.message);
    const fallbackClaims = await getFallbackTrendingClaims();
    return res.json(fallbackClaims);
  }
});

export default router;