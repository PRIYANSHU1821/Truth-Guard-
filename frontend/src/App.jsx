import { useState, useEffect, useRef } from "react";
import React from "react";
import Navbar from "./components/Navbar";
import AnalyzeForm from "./components/AnalyzeForm";
import TrendingSection from "./components/TrendingSection";
import TrendingDetail from "./pages/TrendingDetail";
import HowItWorks from "./components/HowItWorks";
import Disclaimer from "./components/Disclaimer";
import About from "./components/About";
import ScrollToTop from "./components/ScrollToTop";
import Guidelines from "./components/Guidelines";
import logoImg from "./assets/truthguard-logo.png";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const audio = new Audio("/splash-sound.mp3"); 
    audio.volume = 0.5;
    
    audio.play().catch((err) => {
      console.log("Autoplay sound blocked or file not found:", err);
    });

    const timer = setTimeout(() => {
      setIsSplashing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 overflow-hidden pt-24">
      
      {/* --- splash screen animation --- */}
      <AnimatePresence>
  {isSplashing && (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.6, ease: "circOut" } 
      }}
      animate={{ 
        background: [
          "linear-gradient(to bottom, #81A1E0, #C3D7F6, #F0F6FF)",
          "linear-gradient(to bottom, #C3D7F6, #F0F6FF, #81A1E0)",
          "linear-gradient(to bottom, #81A1E0, #C3D7F6, #F0F6FF)"
        ]
      }}
      transition={{ 
        background: { duration: 3, repeat: Infinity, ease: "linear" } 
      }}
      className="fixed inset-0 z-200 flex items-center justify-center"
    >
      <div className="relative flex flex-col items-center">
        <motion.img
          layoutId="truthguard-logo-shared"
          src={logoImg}
          alt="TruthGuard Logo"
          className="w-28 h-28 md:w-36 md:h-36 object-contain"
          initial={{ scale: 0.5, opacity: 1 }} 
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,    
            layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 flex flex-col items-center"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-[0.3em] drop-shadow-md">
            TRUTHGUARD
          </h2>
          
          <div className="mt-4 w-16 h-1 bg-white/30 rounded-full overflow-hidden">
             <motion.div 
               initial={{ x: "-100%" }}
               animate={{ x: "100%" }}
               transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
               className="w-full h-full bg-brand-primary shadow-[0_0_8px_#fff]"
             />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

      {/* --- background --- */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-bgStart rounded-full blur-3xl opacity-40 -z-10"></div>
      {!selectedTrend && <Navbar isSplashing={isSplashing} />}

      {/* --- scroll to top --- */}
      {!selectedTrend && <ScrollToTop />}

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
              Verify Before You{" "}
              <span className="text-brand-primary">Trust</span>
            </motion.h1>

            {/* title 2 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[29px] md:text-4xl lg:text-5xl font-bold text-brand-text leading-tight mb-12 text-center"
            >
              With TruthGuard
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
              <Disclaimer onReadGuidelines={() => setShowGuidelines(true)} />
            </section>
            
            {/* --- about section --- */}
            <section className="w-full z-10">
              <About />
            </section>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showGuidelines && (
          <Guidelines onClose={() => setShowGuidelines(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
