import { useState } from "react";
import React from "react";
import Navbar from "./components/Navbar";
import AnalyzeForm from "./components/AnalyzeForm";
import TrendingSection from "./components/TrendingSection";
import TrendingDetail from "./pages/TrendingDetail";
import HowItWorks from "./components/HowItWorks";
import Disclaimer from "./components/Disclaimer";
import About from "./components/About";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [selectedTrend, setSelectedTrend] = useState(null);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 overflow-hidden pt-24">
      {/* --- background --- */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-bgStart rounded-full blur-3xl opacity-40 -z-10"></div>
      {!selectedTrend && <Navbar />}

      <AnimatePresence mode="wait">
        {selectedTrend ? (
          /* --- trending detail --- */
          <TrendingDetail 
            key="detail"
            item={selectedTrend} 
            onBack={() => setSelectedTrend(null)} 
          />
        ) : (
          /* --- home --- */
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center"
          >
            {/* badge */}
            <div className="bg-brand-secondary text-brand-text px-3 py-0.5 md:px-4 md:py-1 rounded-full text-[12px] md:text-sm font-semibold border border-brand-primary mb-6 mt-20 md:mt-8">
              AI Misinformation Detection
            </div>

            {/* title 1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[29px] md:text-4xl lg:text-5xl font-bold text-brand-text leading-tight mb-2 text-center"
            >
              Verify Before You <span className="text-brand-primary">Trust</span>
            </motion.h1>

            {/* title 2 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[29px] md:text-4xl lg:text-5xl font-bold text-brand-text leading-tight mb-12 text-center"
            >
              With Wonder AI
            </motion.h1>

            {/* --- main content --- */}
            <main className="w-full max-w-3xl z-10">
              <AnalyzeForm />
            </main>

            {/* --- trending section --- */}
            <section id="trending" className="w-full max-w-7xl z-10 mb-16">
              <TrendingSection onItemClick={setSelectedTrend} />
            </section>

            {/* --- how it works section --- */}
            <section className="w-full z-10">
              <HowItWorks />
            </section>

            {/* --- disclaimer section --- */}
            <section className="w-full z-10">
              <Disclaimer />
            </section>

            {/* --- about section --- */}
            <section className="w-full z-10">
              <About />
            </section>

            {/* --- footer section --- */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;