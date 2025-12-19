import { useState } from "react";
import React from "react";
import Navbar from "./components/Navbar";
import AnalyzeForm from "./components/AnalyzeForm";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 overflow-hidden pt-24">

      {/* --- background --- */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-bgStart rounded-full blur-3xl opacity-40 -z-10"></div>

      {/* --- navbar --- */}
      <Navbar />

      {/* badge */}
      <div className="bg-brand-secondary text-brand-text px-4 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-semibold border border-brand-primary mb-6 mt-8">
        AI Misinformation Detection
      </div>

      {/* title 1 */}
      <motion.h1
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-[28px] md:text-4xl lg:text-5xl font-bold text-brand-text leading-tight mb-2 text-center"
      >
        Verify Before You <span className="text-brand-primary">Trust</span>
      </motion.h1>

      {/* title 2 */}
      <motion.h1
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{
          duration: 0.8,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-[28px] md:text-4xl lg:text-5xl font-bold text-brand-text leading-tight mb-12 text-center"
      >
        With Wonder AI
      </motion.h1>

      {/* --- main content --- */}
      <main className="w-full max-w-3xl z-10">
        <AnalyzeForm />
      </main>

      <footer className="mt-auto py-8 text-brand-text/60 text-sm">
        © 2025 Wonder AI. All rights reserved.
      </footer>
    </div>
  );
}

export default App;