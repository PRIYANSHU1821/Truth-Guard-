import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ResultCard from "./ResultCard";

const AnalyzeForm = () => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("Text");
  const [showDropdown, setShowDropdown] = useState(false);

  const [processTime, setProcessTime] = useState(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setProcessTime(null);

    // start timer
    const startTime = performance.now();

    try {
      // call api
      const API_URL = "https://wonder-ai-backend.vercel.app"; 

      const response = await axios.post(`${API_URL}/api/analyze`, {
        text: inputText,
      });

      // stop timer
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      setProcessTime(duration);
      setResult(response.data);
    } catch (err) {
      console.error("Analysis Error:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "We couldn't reach the server. Please try again later or ensure the backend is active.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-2 md:px-0 mb-35 md:mb-30">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-brand-surface rounded-4xl md:rounded-[2.5rem] p-4 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-white/60 relative overflow-hidden"
      >
        {/* --- error message --- */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-2xl flex items-start gap-3 text-gray-600 overflow-hidden"
            >
              <svg
                className="w-5 h-5 shrink-0 mt-0.5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs md:text-sm font-medium leading-relaxed">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          id="analyze-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            mode === "Text" ? "Paste text here..." : "Paste link here..."
          }
          className="w-full h-24 md:h-36 bg-transparent outline-none text-sm md:text-base text-brand-text placeholder-gray-300 resize-none font-medium leading-relaxed p-2"
        />

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-secondary/50">
          {/* dropdown mode */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 bg-brand-secondary text-brand-primary px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[11px] md:text-sm font-bold shadow-sm transition-all"
            >
              <motion.span animate={{ rotate: showDropdown ? 180 : 0 }}>
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.span>
              {mode}
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -5, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-2 w-32 md:w-36 bg-white backdrop-blur-xl border border-brand-secondary rounded-xl md:rounded-2xl shadow-xl overflow-hidden z-20"
                >
                  <div className="flex flex-col">
                    {["Text", "Link"].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setMode(item);
                          setShowDropdown(false);
                        }}
                        className={`px-4 py-2.5 md:py-3 text-[11px] md:text-sm font-medium text-left flex items-center justify-between transition-all ${
                          mode === item
                            ? "bg-brand-primary text-white"
                            : "text-brand-text hover:bg-brand-secondary"
                        }`}
                      >
                        {item}
                        {mode === item && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* analyze button */}
          <motion.button
            disabled={loading || !inputText}
            whileHover={
              !(loading || !inputText) ? { scale: 1.05, brightness: 1.1 } : {}
            }
            whileTap={!(loading || !inputText) ? { scale: 0.95 } : {}}
            onClick={handleAnalyze}
            className={`
              flex items-center gap-2 px-5 py-2 md:px-7 md:py-3 rounded-full text-[12px] md:text-sm font-bold text-white shadow-lg transition-all
              bg-brand-primary 
              ${
                loading || !inputText
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-brand-primary/40"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Analyze With AI
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
                </svg>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* --- result section --- */}
      <AnimatePresence>
        {/* success state */}
        {result && <ResultCard result={result} processTime={processTime} />}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzeForm;
