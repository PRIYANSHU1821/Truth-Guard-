import React from "react";
import { motion } from "framer-motion";

const Disclaimer = () => {
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

  return (
    <div
      id="disclaimer"
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
        <div className="bg-brand-secondary text-brand-text px-4 py-1 rounded-full text-[12px] md:text-sm font-bold border border-brand-primary mb-4">
          Transparency & Ethics
        </div>
        <h2 className="text-[28px] md:text-5xl font-bold text-brand-text">
          Important <span className="text-brand-primary">Disclaimer</span>
        </h2>
      </motion.div>

      {/* content grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="flex flex-col gap-6">
          
          {/* card 1 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-brand-surface/40 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-[2.5rem] shadow-lg flex flex-col md:flex-row gap-5 items-start cursor-pointer group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-2xl flex items-center justify-center shrink-0 border border-red-200 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="w-full">
              <h3 className="text-sm md:text-xl font-bold text-brand-text mb-3">
                AI Limitations
              </h3>
              <p className="text-[12px] md:text-sm text-brand-text/70 leading-relaxed text-justify">
                WonderAI utilizes advanced Artificial Intelligence (LLMs) to
                analyze patterns. While highly accurate,{" "}
                <strong>AI models can occasionally hallucinate</strong> or
                misinterpret context. Results should be used as a reference, not
                absolute truth.
              </p>
            </div>
          </motion.div>

          {/* card 2 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-brand-surface/40 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-[2.5rem] shadow-lg flex flex-col md:flex-row gap-5 items-start cursor-pointer group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-secondary rounded-2xl flex items-center justify-center shrink-0 border border-brand-primary/30 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-brand-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="w-full">
              <h3 className="text-sm md:text-xl font-bold text-brand-text mb-3">
                Data Privacy
              </h3>
              <p className="text-[12px] md:text-sm text-brand-text/70 leading-relaxed text-justify">
                We respect your privacy. The text and URLs you analyze are
                processed in real-time and{" "}
                <strong>are not stored personally</strong> on our servers. We
                prioritize ethical AI usage to ensure a safe experience.
              </p>
            </div>
          </motion.div>
        </div>

        {/* card right */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-brand-surface/60 backdrop-blur-2xl border border-white/60 p-6 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-center text-center h-full cursor-pointer group"
        >
          <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
               <svg className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.57-4.141m6.066 4.243A9.953 9.953 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>

            <h4 className="text-md md:text-3xl font-bold text-brand-text mb-4">
              Your Responsibility
            </h4>
            <p className="text-[10px] md:text-base text-brand-text/70 leading-relaxed mb-4 text-justify lg:text-center">
              "Trust, but Verify." Our tool is designed to assist, not replace
              critical thinking. Always cross-reference critical information
              with official sources (Government, WHO, Credible News Outlets)
              before sharing.
            </p>

            <button className="px-6 py-2.5 md:px-8 md:py-3 bg-brand-primary text-white text-[12px] md:text-sm font-bold rounded-full hover:shadow-lg hover:brightness-110 transition-all transform group-hover:-translate-y-1">
              Read Full Guidelines
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Disclaimer;