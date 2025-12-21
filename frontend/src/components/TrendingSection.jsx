import React from "react";
import { motion } from "framer-motion";

const TrendingSection = ({ onItemClick }) => {
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
      {/* header section */}
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

      {/* grid layout - 4 columns */}
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
    </div>
  );
};

// trending card component
const TrendingCard = ({ item, onClick, variants }) => {
  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -5, scale: 1.01 }} 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-brand-surface/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-brand-surface/60 group flex flex-col h-full"
    >
      {/* image */}
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
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-0.5 rounded-full md:text-[11px] text-[12px] font-bold text-brand-primary backdrop-blur-md border border-brand-primary/20 ${
              item.status === "Debunked" ? "bg-brand-bg-end" : "bg-brand-accent"
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* category badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 rounded-lg text-[12px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
            {item.category}
          </span>
        </div>
      </div>

      {/* content */}
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

        {/* title */}
        <h3 className="text-sm md:text-[15px] font-bold text-brand-text mb-2 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
          {item.title}
        </h3>

        <p className="text-[11px] text-brand-text/70 mb-4 line-clamp-2 leading-relaxed grow">
          {item.excerpt}
        </p>

        {/* footer */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-secondary/50 mt-auto">
          {/* avatar */}
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

          {/* score */}
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

// data
export const trendingData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    date: "Dec 18, 2024",
    category: "Health",
    title: "Fake vaccine side effects spreading online",
    excerpt:
      "False claims about vaccine causing unusual symptoms have been debunked by health experts.",
    author: {
      name: "Dr. Sarah",
      role: "Medical Fact-Checker",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    confidence: 94,
    sources: 15,
    status: "Debunked",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    date: "Dec 15, 2024",
    category: "Technology",
    title: "AI system allegedly gains consciousness",
    excerpt:
      "Viral story about AI achieving sentience has been thoroughly investigated and found to be fabricated.",
    author: {
      name: "Marcus J.",
      role: "Tech Analyst",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    confidence: 89,
    sources: 22,
    status: "Debunked",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    date: "Dec 12, 2024",
    category: "Environment",
    title: "Climate data manipulation allegations",
    excerpt:
      "Claims of scientists falsifying climate data have been investigated and proven false.",
    author: {
      name: "Emma R.",
      role: "Journalist",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    confidence: 96,
    sources: 31,
    status: "Debunked",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    date: "Dec 10, 2024",
    category: "Politics",
    title: "Deepfake video of politician circulates",
    excerpt:
      "A controversial video showing a politician making inflammatory remarks confirmed as deepfake.",
    author: {
      name: "David K.",
      role: "Analyst",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    confidence: 98,
    sources: 12,
    status: "Debunked",
  },
];

export default TrendingSection;
