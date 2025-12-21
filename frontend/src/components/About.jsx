import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div
      id="about"
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
        <div className="bg-brand-secondary text-brand-text px-4 py-1 rounded-full text-[10px] md:text-xs font-bold border border-brand-primary mb-4">
          About Us
        </div>
        <h2 className="text-[28px] md:text-5xl font-bold text-brand-text">
          Guardians of <span className="text-brand-primary">Truth</span>
        </h2>
      </motion.div>

      {/* bento grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        // Grid: 2 kolom (Mobile/Tablet), 4 kolom (Desktop)
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 auto-rows-min md:auto-rows-[200px]"
      >
        {/* card 1 */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5 }}
          className="col-span-2 lg:col-span-2 lg:row-span-2 relative bg-brand-surface/40 backdrop-blur-xl border border-white/60 rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 overflow-hidden shadow-lg group flex flex-col justify-between min-h-70 md:min-h-full"
        >
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-brand-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-brand-primary/20 transition-all duration-500" />
          
          <div className="relative z-10 h-full flex flex-col justify-between gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 md:w-7 md:h-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-4xl font-bold text-brand-text mb-2 md:mb-4 leading-tight">
                Fighting the Era of <br className="hidden md:block"/> Misinformation.
              </h3>
              <p className="text-xs md:text-base text-brand-text/70 leading-relaxed text-justify md:text-left max-w-xl">
                Wonder AI stands as a digital shield against fake news. We combine ethical AI with global fact-checking networks to restore trust.
              </p>
            </div>
          </div>
        </motion.div>

        {/* card speed */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="col-span-1 lg:col-span-1 relative bg-transparent md:bg-brand-secondary/30 md:backdrop-blur-md border-none md:border md:border-brand-secondary rounded-3xl md:rounded-[2.5rem] p-4 md:p-5 flex flex-col justify-center items-center text-center shadow-none md:shadow-md overflow-hidden min-h-35 md:min-h-full"
        >
          <div className="absolute inset-0 bg-brand-primary/5 animate-pulse hidden md:block" />
          
          <div className="mb-1 md:mb-2">
             <svg className="w-5 h-5 md:w-6 md:h-6 text-brand-primary opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>

          <h4 className="text-2xl md:text-4xl font-bold text-brand-primary mb-0.5">
            &lt;1s
          </h4>
          <p className="text-[9px] md:text-[10px] font-bold text-brand-text uppercase tracking-widest">
            Speed
          </p>
          <p className="text-[8px] md:text-[10px] text-brand-text/60 mt-1 leading-tight px-1">
            Real-time check
          </p>
        </motion.div>

        {/* card accuracy */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="col-span-1 lg:col-span-1 relative bg-transparent md:bg-brand-surface/60 md:backdrop-blur-xl border-none md:border md:border-white/60 rounded-3xl md:rounded-[2.5rem] p-4 md:p-5 flex flex-col justify-center items-center text-center shadow-none md:shadow-lg min-h-35 md:min-h-full"
        >
          <div className="relative w-12 h-12 md:w-20 md:h-20 mb-2">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="45%" stroke="white" strokeWidth="6" fill="transparent" className="opacity-50" />
                <circle cx="50%" cy="50%" r="45%" stroke="#65A9E0" strokeWidth="6" fill="transparent" strokeDasharray="283" strokeDashoffset="20" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm md:text-xl font-bold text-brand-text">96%</span>
             </div>
          </div>
          <p className="text-[9px] md:text-[10px] font-bold text-brand-text uppercase tracking-widest">
            Accuracy
          </p>
        </motion.div>

        {/* card ethical AI */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.01 }}
          className="col-span-2 lg:col-span-2 relative bg-brand-surface/40 backdrop-blur-xl border border-white/60 rounded-3xl md:rounded-[2.5rem] p-5 md:p-6 flex flex-row items-center justify-start md:justify-center gap-4 md:gap-6 text-left shadow-lg min-h-25 md:min-h-full"
        >
           <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-accent/20 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 text-brand-primary">
             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
             </svg>
           </div>
           <div>
             <h4 className="text-base md:text-xl font-bold text-brand-text mb-0.5 md:mb-1">Ethical First</h4>
             <p className="text-[10px] md:text-xs text-brand-text/70 leading-relaxed max-w-xs md:max-w-sm">
               Algorithms trained to detect bias & ensure neutrality.
             </p>
           </div>
        </motion.div>

        {/* card open source*/}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5 }}
          className="col-span-2 lg:col-span-4 relative bg-linear-to-br from-brand-primary to-brand-accent rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl overflow-hidden flex flex-col md:flex-row items-center md:justify-between gap-6"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          <div className="text-center md:text-left z-10 max-w-2xl">
            <div className="flex justify-center md:justify-start mb-2 md:mb-3">
               <svg className="w-6 h-6 md:w-8 md:h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
            </div>
            <h3 className="text-lg md:text-3xl font-bold mb-2 md:mb-3">
              Built for the Community
            </h3>
            <p className="text-[10px] md:text-sm text-white/90 leading-relaxed">
              Transparency is our core value. Our methodology is open-source and reviewed by independent researchers to ensure zero bias.
            </p>
          </div>

          {/* buttons */}
          <div className="z-10 flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 sm:justify-center">
             
             {/* github */}
             <a 
               href="https://github.com/fatiya17/ai-misinformation-detector" 
               target="_blank" 
               rel="noopener noreferrer"
               className="px-4 py-2 md:px-5 md:py-2.5 bg-white text-brand-primary text-[10px] md:text-sm font-bold rounded-full hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 no-underline"
             >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View on GitHub
             </a>
             
             {/* documentation button */}
             <button className="px-4 py-2 md:px-5 md:py-2.5 bg-brand-surface/20 text-white border border-white/30 text-[10px] md:text-sm font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center">
                Read Documentation
             </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default About;