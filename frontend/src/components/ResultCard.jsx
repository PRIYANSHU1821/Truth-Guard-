import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ResultCard = ({ item, variants }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/trending/${item.id}`);
  };

  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/60 group"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <span className="px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-red-500/90 text-white backdrop-blur-sm">
            {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 lg:p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <span className="text-[10px] md:text-xs text-[#000000]/60 font-medium">
            {item.date}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#65A9E0]" />
          <span className="px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[10px] md:text-xs font-semibold bg-[#E4EDFF] text-[#65A9E0]">
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-[#000000] mb-2 md:mb-3 line-clamp-2 group-hover:text-[#65A9E0] transition-colors">
          {item.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs md:text-sm text-[#000000]/70 mb-4 md:mb-5 line-clamp-3 leading-relaxed">
          {item.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-[#E4EDFF]">
          {/* Author Info */}
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#E4EDFF]"
            />
            <div>
              <p className="text-xs md:text-sm font-semibold text-[#000000]">
                {item.author.name}
              </p>
              <p className="text-[10px] md:text-xs text-[#000000]/60">
                {item.author.role}
              </p>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="text-right">
            <p className="text-[10px] md:text-xs font-bold text-[#65A9E0]">
              {item.confidence}%
            </p>
            <p className="text-[9px] md:text-[10px] text-[#000000]/50">
              Confidence
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ResultCard;