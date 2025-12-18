import express from "express";
import axios from "axios";

const router = express.Router();
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://factchecktools.googleapis.com/v1alpha1/claims:search",
      {
        params: {
          key: GOOGLE_KEY,
          query: "misinformation", 
          languageCode: "en",      
          pageSize: 20,
          maxAgeDays: 90
        },
      }
    );

    const claims = response.data.claims || [];

    const cleanData = claims.map((item) => ({
      title: item.text,
      claimant: item.claimant || "Social Media",
      date: item.claimDate,
      status: item.claimReview[0]?.textualRating || "Unverified",
      source: item.claimReview[0]?.publisher?.name || "Fact Check Source",
      url: item.claimReview[0]?.url
    }));

    res.json(cleanData);

  } catch (error) {
    console.error("Failed to fetch trending:", error.message);
    // Fallback data (English)
    res.json([
      {
        title: "Example: The Earth is flat (Demo Data)",
        claimant: "Facebook User",
        date: new Date().toISOString(),
        status: "False",
        source: "Snopes",
        url: "#"
      }
    ]);
  }
});

export default router;