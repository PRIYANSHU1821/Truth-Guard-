import React from "react";
import { motion } from "framer-motion";

const ResultCard = ({ result, processTime }) => {
  if (!result) return null;

  const getStatusStyle = (label) => {
    const lowerLabel = label.toLowerCase();
    
    // 1. misinformation (red)
    if (lowerLabel.includes('misinformation') || lowerLabel.includes('hoax')) {
      return 'bg-red-100 text-red-700 border-red-200';
    } 
    // 2. questionable / unverified (orange)
    else if (lowerLabel.includes('questionable') || lowerLabel.includes('unverified')) {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    }
    // 3. satire / opinion (yellow)
    else if (lowerLabel.includes('satire') || lowerLabel.includes('opinion')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } 
    // 4. factual / valid (green)
    else {
      return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const badgeClass = getStatusStyle(result.label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full mt-6 bg-brand-surface/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-4xl shadow-2xl relative overflow-hidden"
    >
      {/* background */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none -z-10 bg-brand-primary" />

      {/* metrics badge */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
         {processTime && (
           <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/50 rounded-full border border-brand-secondary/50" title="Waktu pemrosesan server">
              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-[13px] md:text-md font-bold text-brand-primary font-mono">{processTime}s</span>
           </div>
         )}
      </div>

      {/* label & confidence */}
      <div className="flex flex-col items-start gap-2 mb-4">
        <span className={`px-4 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider shadow-sm border ${badgeClass}`}>
          {result.label}
        </span>
        
        <div className="flex items-end gap-2">
          <span className="text-3xl md:text-5xl font-bold text-brand-text">
            {(result.confidence * 100).toFixed(0)}%
          </span>
          <span className="text-xs md:text-sm font-medium text-brand-text/60 mb-1.5 md:mb-2">
            Confidence Score
          </span>
        </div>
      </div>
      
      {/* explanation */}
      <div className="bg-brand-secondary/20 p-4 rounded-2xl border border-brand-secondary/50">
        <p className="text-brand-text text-sm md:text-base leading-relaxed font-medium">
          "{result.explanation}"
        </p>
      </div>

      {/* footer result */}
      <div className="mt-4 flex items-center gap-2 text-[10px] text-brand-text/40">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        <span>Verified by Google Gemini 2.5 Flash</span>
      </div>

    </motion.div>
  );
};

export default ResultCard;