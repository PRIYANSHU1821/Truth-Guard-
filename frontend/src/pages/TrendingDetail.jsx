import React from "react";
import { motion } from "framer-motion";

const TrendingDetail = ({ item, onBack }) => {
  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-60 bg-linear-to-b from-brand-bgEnd via-brand-bgMid to-brand-bgStart overflow-y-auto"
    >
      <div className="min-h-screen py-6 px-3 md:py-8 md:px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <motion.button
            onClick={onBack}
            whileHover={{ x: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // Ganti bg-brand-surface/60 dan border-brand-surface/60
            className="mb-4 flex items-center gap-1.5 px-3 py-1.5 bg-brand-surface/60 backdrop-blur-xl rounded-full text-brand-text text-xs md:text-sm font-medium hover:bg-brand-secondary transition-all shadow-sm border border-brand-surface/60"
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </motion.button>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            // Ganti bg-brand-surface/70 dan border-brand-surface/60
            className="bg-brand-surface/70 backdrop-blur-2xl rounded-2xl md:rounded-4xl overflow-hidden shadow-2xl border border-brand-surface/60"
          >
            {/* Header Section */}
            <div className="p-4 md:p-8 border-b border-brand-secondary/50">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                <div className="flex-1">
                  <h1 className="text-lg md:text-2xl font-bold text-brand-text mb-1.5 md:mb-2">
                    Misinformation Report
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-brand-text/60 font-medium">
                    <span className="bg-brand-secondary px-1.5 py-0.5 rounded">ID: #{item.id.toString().padStart(6, '0')}</span>
                    <span className="w-1 h-1 rounded-full bg-brand-accent" />
                    <span>{item.date}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // Text-brand-surface (putih) pada button primary
                  className="self-start px-4 py-1.5 md:px-5 md:py-2 bg-brand-primary text-brand-surface text-xs md:text-sm rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  View Full Report →
                </motion.button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-6 p-4 md:p-8">
              
              {/* Left Column - Image */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg aspect-video lg:aspect-auto lg:h-full group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient menggunakan brand-text (hitam) */}
                  <div className="absolute inset-0 bg-linear-to-t from-brand-text/50 to-transparent" />
                  
                  {/* Floating Status */}
                  {/* Ganti bg-white/20 -> bg-brand-surface/20, border-white -> border-brand-surface */}
                  <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 bg-brand-surface/20 backdrop-blur-md border border-brand-surface/30 p-2 md:p-3 rounded-lg md:rounded-xl">
                    <p className="text-brand-surface text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5">Current Status</p>
                    {/* Menggunakan text-brand-secondary agar kontras di background gelap, alih-alih merah/hijau */}
                    <p className="text-base md:text-lg font-bold text-brand-secondary">
                      {item.status}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-3 space-y-4 md:space-y-6">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-lg md:text-2xl font-bold text-brand-text mb-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm text-brand-text/70 leading-relaxed font-medium">
                    {item.excerpt}
                  </p>
                </motion.div>

                {/* status */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-2 md:gap-3"
                >
                  {/* verdict */}
                  <div className="bg-brand-secondary/30 p-3 md:p-4 rounded-xl border border-brand-secondary">
                    <p className="text-[9px] md:text-[12px] font-bold text-brand-primary uppercase tracking-wider mb-0.5 md:mb-1">Verdict</p>
                    <p className="text-sm md:text-md font-bold text-brand-text">{item.status}</p>
                  </div>

                  {/* confident */}
                  <div className="bg-brand-surface/50 p-3 md:p-4 rounded-xl border border-brand-secondary">
                    <p className="text-[9px] md:text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-0.5 md:mb-1">Confidence</p>
                    <p className="text-base md:text-xl font-bold text-brand-primary">{item.confidence}%</p>
                  </div>
                </motion.div>

                {/* author */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 p-2 md:p-3 bg-brand-surface/40 rounded-[35px] border border-brand-secondary/50"
                >
                  <img
                    src={item.author.avatar}
                    alt={item.author.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-surface shadow-md"
                  />
                  <div>
                    <p className="text-sm md:text-base font-bold text-brand-text">{item.author.name}</p>
                    <p className="text-[10px] md:text-xs text-brand-text/60">{item.author.role}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Detailed Analysis Section */}
            {/* Ganti bg-white/30 -> bg-brand-surface/30 */}
            <div className="p-4 md:p-8 border-t border-brand-secondary/50 bg-brand-surface/30">
              <h3 className="text-base md:text-lg font-bold text-brand-text mb-3">Detailed Analysis</h3>
              <p className="text-brand-text/80 leading-relaxed text-xs md:text-base">
                {item.fullContent}
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingDetail;