import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const enrichData = (rawData) => {
  const categoryImageMap = {
    Politics:
      "https://images.unsplash.com/photo-1607778417094-1fef13315e6e?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Health:
      "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Tech: "https://itchronicles.com/wp-content/uploads/2021/01/technology-impact-on-life.jpg",
    Science:
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    Society:
      "https://images.unsplash.com/photo-1513682121497-80211f36a7d3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const categories = Object.keys(categoryImageMap);
  const roles = ["Fact-Checker", "Journalist", "Analyst", "Researcher"];

  return rawData.map((item, index) => {
    let originalStatus = item.status || "Unverified";
    let shortStatus = originalStatus;

    if (shortStatus.length > 20) {
      const lower = shortStatus.toLowerCase();
      if (lower.includes("false") || lower.includes("fake")) {
        shortStatus = "False";
      } else if (lower.includes("true") || lower.includes("correct")) {
        shortStatus = "True";
      } else if (lower.includes("misleading")) {
        shortStatus = "Misleading";
      } else {
        shortStatus = "See Report";
      }
    } else {
      shortStatus = shortStatus.replace(/\.$/, "");
    }

    const assignedCategory = categories[index % categories.length];

    return {
      id: index,
      title: item.title || "No Title Available",
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

      status: shortStatus,
      fullStatus: originalStatus,

      sourceName: item.source,
      url: item.url,
      excerpt: `Claim by ${item.claimant}: "${item.title}". This claim has been reviewed by ${item.source}.`,

      image: categoryImageMap[assignedCategory],
      category: assignedCategory,

      confidence: Math.floor(Math.random() * (99 - 85) + 85),
      sources: Math.floor(Math.random() * (50 - 10) + 10),
      author: {
        name: item.source || "Unknown Source",
        role: roles[index % roles.length],
        avatar: `https://ui-avatars.com/api/?name=${item.source}&background=random`,
      },
    };
  });
};

const TrendingSection = ({ onItemClick }) => {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/trending`);
        const enriched = enrichData(response.data);
        setTrendingData(enriched);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
        setError("Failed to load trending topics.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-360 mx-auto px-6 md:px-12 lg:px-16 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-10 text-center"
      >
        <div className="bg-brand-secondary text-brand-text px-3 py-0.5 md:px-4 md:py-1 rounded-full text-[12px] md:text-sm font-semibold border border-brand-primary">
          Global Insights
        </div>

        <h2 className="text-[28px] md:text-5xl font-bold text-brand-text mt-6">
          Trending <span className="text-brand-primary">Misinformation</span>
        </h2>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/40 h-80 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-brand-text/60 py-10">
          <p>{error}</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {trendingData.map((item) => (
            <TrendingCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
              variants={itemVariants}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const TrendingCard = ({ item, onClick, variants }) => {
  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-brand-surface/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-brand-surface/60 group flex flex-col h-full"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-80" />

        {/* badge status */}
        <div className="absolute top-2 right-2 max-w-30">
          <span
            className="block truncate px-2 py-0.5 rounded-full md:text-[11px] text-[12px] font-bold text-brand-primary backdrop-blur-md border border-brand-primary/20 bg-brand-bg-end"
            title={item.fullStatus}
          >
            {item.status}
          </span>
        </div>

        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 rounded-lg text-[12px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-brand-text/50 font-medium">
            {item.date}
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-brand-text/30" />
          <span className="text-[10px] text-brand-primary font-semibold">
            {item.sources} Sources
          </span>
        </div>

        <h3 className="text-sm md:text-[15px] font-bold text-brand-text mb-2 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
          {item.title}
        </h3>

        <p className="text-[11px] text-brand-text/70 mb-4 line-clamp-2 leading-relaxed grow">
          {item.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-brand-secondary/50 mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-6 h-6 rounded-full border border-brand-secondary object-cover"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-brand-text truncate max-w-20">
                {item.author.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-brand-secondary/30 px-2 py-1 rounded-md">
            <span className="text-[11px] font-bold text-brand-primary">
              {item.confidence}%
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default TrendingSection;
