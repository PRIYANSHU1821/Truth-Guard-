import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const elem = document.getElementById(targetId);
      if (elem) {
        const headerOffset = 100;
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  const footerLinks = [
    { name: "Trending", href: "trending" },
    { name: "How it Works", href: "how-it-works" },
    { name: "Disclaimer", href: "disclaimer" },
    { name: "About", href: "about" },
  ];

  return (
    <footer className="w-full relative mt-20 pt-10 pb-8 px-6 md:px-12 lg:px-16 overflow-hidden bg-linear-to-b from-brand-bg-end to-brand-bg-start rounded-t-[2.5rem]">
      
      <div className="absolute top-0 left-0 right-0 h-px bg-white/40" />
      <div className="max-w-360 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12">
          
          {/* brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
            <a 
              href="#" 
              onClick={(e) => handleScroll(e, "home")}
              className="text-2xl font-bold text-brand-text mb-2 tracking-tight hover:text-brand-primary transition-colors"
            >
              TruthGuard
            </a>
            <p className="text-xs md:text-sm text-brand-text/70 leading-relaxed font-medium">
              Empowering the digital world with ethical AI analysis to fight misinformation and restore trust.
            </p>
          </div>

          {/* navigation links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-12">
            <div className="flex flex-col items-center md:items-start gap-2">
              <h4 className="font-bold text-brand-text text-sm mb-1">Explore</h4>
              <button 
                onClick={(e) => handleScroll(e, "home")}
                className="text-xs md:text-sm text-brand-text/70 hover:text-brand-primary transition-colors font-medium"
              >
                Home
                GitHub
              </a>

              {/* email */}
              <a href="mailto:contact@fatiyalabibah17@gmail.com" className="flex items-center gap-2 text-xs md:text-sm text-brand-text/70 hover:text-brand-primary transition-colors font-medium group">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-8 pt-6 border-t border-brand-text/10 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="text-[10px] md:text-xs text-brand-text/60 font-medium">
            © 2025 TruthGuard. All rights reserved.
          </p>
          <p className="text-[10px] text-brand-text/50 font-medium">
            Designed for Global AI Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;