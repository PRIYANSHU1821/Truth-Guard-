import React from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const steps = [
    {
      id: 1,
      title: "Input Data",
      desc: "Paste the article text or URL link you want to verify into the analysis box above.",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "AI Processing",
      desc: "Our engine uses advanced LLMs to cross-reference claims against global fact-check databases.",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Instant Verdict",
      desc: "Receive a comprehensive report with a credibility score, source analysis, and explanation.",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      id="how-it-works"
      className="w-full max-w-360 mx-auto px-6 md:px-12 lg:px-16 mb-24"
    >
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-12 text-center"
      >
        <div className="bg-brand-secondary text-brand-text px-4 py-1 rounded-full text-xs md:text-sm font-bold border border-brand-primary mb-4">
          The Process
        </div>
        <h2 className="text-[28px] md:text-5xl font-bold text-brand-text">
          How It <span className="text-brand-primary">Works</span>
        </h2>
      </motion.div>

      {/* steps grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            variants={itemVariants}
            
            whileHover={{ 
              y: -10,
              scale: 1.02, 
              borderColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            whileTap={{ 
              scale: 0.95, 
              y: 0, 
              borderColor: "rgba(101, 169, 224, 0.8)", 
              boxShadow: "0 5px 10px rgba(0,0,0,0.05)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}

            className="relative bg-brand-surface/40 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-lg overflow-hidden group cursor-pointer"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl group-hover:bg-brand-primary/30 transition-all duration-500" />

            {/* icon box */}
            <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
              {step.icon}
            </div>

            {/* number */}
            <div className="absolute top-4 right-6 text-[80px] font-bold text-brand-text/5 pointer-events-none select-none">
              0{step.id}
            </div>

            <h3 className="text-sm md:text-xl font-bold text-brand-text mb-3">
              {step.title}
            </h3>
            <p className="text-[12px] md:text-sm text-brand-text/70 leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* explanation section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        // Container Utama: Shadow & Border hanya muncul di Desktop (md:)
        className="relative w-full bg-transparent md:bg-brand-surface/60 md:backdrop-blur-2xl md:border md:border-white/60 rounded-[3rem] p-0 md:p-12 shadow-none md:shadow-2xl overflow-visible md:overflow-hidden"
      >
        {/* gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-brand-secondary/30 via-transparent to-brand-primary/5 pointer-events-none hidden md:block" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 md:gap-10">
          {/* left text */}
          <div className="lg:w-1/2 text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-brand-text mb-4">
              Powered by <span className="text-brand-primary">Advanced AI</span>
            </h3>
            <p className="text-[12px] md:text-base text-brand-text/80 leading-relaxed mb-6 text-justify">
              TruthGuard leverages the reasoning capabilities of{" "}
              <strong>Google Gemini Pro</strong> combined with real-time
              verification from <strong>Google Fact Check Tools API</strong>.
            </p>

            <p className="text-[12px] md:text-base text-brand-text/80 leading-relaxed text-justify">
              Unlike standard keyword matching, our system understands{" "}
              <strong>context</strong>, <strong>sarcasm</strong>, and{" "}
              <strong>logical fallacies</strong> to determine whether
              information is valid, misleading, or satire.
            </p>

            <div className="flex flex-wrap gap-2 md:gap-4 mt-5 md:mt-8 justify-start">
              {/* gemini badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/60 rounded-full border border-brand-secondary">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold text-brand-text whitespace-nowrap">
                  Gemini 2.5 Flash
                </span>
              </div>

              {/* fact check badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/60 rounded-full border border-brand-secondary">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold text-brand-text whitespace-nowrap">
                  Fact Check API
                </span>
              </div>
            </div>
          </div>

          {/* right visual / illustration */}
          <div className="hidden lg:flex lg:w-1/2 w-full h-72 bg-linear-to-br from-brand-primary to-brand-accent rounded-[2.5rem] relative overflow-hidden items-center justify-center group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

            {/* elements animation */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <svg
                    className="w-5 h-5 text-brand-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
                <div className="h-3 w-20 bg-white/50 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-32 bg-white/30 rounded-full" />
                <div className="h-2 w-24 bg-white/30 rounded-full" />
              </div>
            </motion.div>

            {/* orbital rings */}
            <div
              className="absolute w-96 h-96 border border-white/20 rounded-full animate-spin-slow pointer-events-none"
              style={{ animationDuration: "20s" }}
            />
            <div
              className="absolute w-64 h-64 border border-white/10 rounded-full animate-spin-slow pointer-events-none"
              style={{
                animationDuration: "15s",
                animationDirection: "reverse",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowItWorks;