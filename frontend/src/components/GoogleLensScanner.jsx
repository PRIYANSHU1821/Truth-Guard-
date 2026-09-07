import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ResultCard from "./ResultCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GoogleLensScanner = ({ onClose }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processTime, setProcessTime] = useState(null);

  // Marquee crop selection box coordinates
  const [cropBox, setCropBox] = useState({ x: 30, y: 30, w: 320, h: 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setBase64Image(reader.result);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x: clickX, y: clickY });
    setCropBox({ x: clickX, y: clickY, w: 20, h: 20 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = Math.abs(currentX - dragStart.x);
    const height = Math.abs(currentY - dragStart.y);
    const x = Math.min(dragStart.x, currentX);
    const y = Math.min(dragStart.y, currentY);

    setCropBox({ x, y, w: width, h: height });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScanImage = async () => {
    if (!base64Image) return;

    setLoading(true);
    setError(null);
    setResult(null);
    const startTime = performance.now();

    try {
      const response = await axios.post(`${API_URL}/api/analyze-image`, {
        image: base64Image,
        mimeType: "image/jpeg",
        cropBox: {
          x: Math.round(cropBox.x),
          y: Math.round(cropBox.y),
          width: Math.round(cropBox.w),
          height: Math.round(cropBox.h),
        },
      });

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      setProcessTime(duration);

      setResult({
        ...response.data,
        // Wrap explanation with OCR text tag if present
        explanation: response.data.extractedText
          ? `[Extracted OCR Text: "${response.data.extractedText}"] — ${response.data.explanation}`
          : response.data.explanation,
      });
    } catch (err) {
      console.error("Lens OCR Analysis Error:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Could not analyze image. Please ensure backend server is reachable.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-4 md:p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white tracking-wide">
                Google Lens OCR Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Draw a box over text or news clipping to verify fake news
              </p>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs md:text-sm">
            {error}
          </div>
        )}

        {/* Viewport Canvas Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative w-full h-64 md:h-96 bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-700/80 flex items-center justify-center cursor-crosshair select-none"
        >
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt="Scan viewport"
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Google Lens Marquee Bounding Box Selection */}
              <div
                style={{
                  left: `${cropBox.x}px`,
                  top: `${cropBox.y}px`,
                  width: `${cropBox.w}px`,
                  height: `${cropBox.h}px`,
                }}
                className="absolute border-2 border-blue-400 bg-blue-500/15 pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-75"
              >
                {/* Corner reticles */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-300"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-300"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-300"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-300"></div>

                {/* Animated Scan Beam */}
                <motion.div
                  animate={{ y: [0, Math.max(10, cropBox.h - 4), 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#38bdf8]"
                />

                <span className="absolute bottom-1 right-2 text-[10px] text-cyan-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded">
                  Scan Zone
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Upload or Drop Image to Scan
              </p>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                Click below to select a newspaper snippet, tweet image, headline screenshot, or flyer.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-blue-500/25"
              >
                Choose Image File
              </button>
            </div>
          )}
        </div>

        {/* Footer Toolbar */}
        {imageSrc && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Change Image
            </button>

            <motion.button
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScanImage}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs md:text-sm font-bold rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scanning OCR & Fact Checking...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Scan Selected Text
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Result Output */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full mt-6"
          >
            <ResultCard result={result} processTime={processTime} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleLensScanner;
