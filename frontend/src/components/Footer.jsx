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
              WonderAI
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
              </button>
              {footerLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-xs md:text-sm text-brand-text/70 hover:text-brand-primary transition-colors font-medium"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* social contact */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <h4 className="font-bold text-brand-text text-sm mb-1">Connect</h4>
              
              {/* linkedin */}
              <a href="https://www.linkedin.com/in/fatiya-labibah/" className="flex items-center gap-2 text-xs md:text-sm text-brand-text/70 hover:text-brand-primary transition-colors font-medium group">
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Linkedin
              </a>

              {/* github */}
              <a href="https://github.com/fatiya17" className="flex items-center gap-2 text-xs md:text-sm text-brand-text/70 hover:text-brand-primary transition-colors font-medium group">
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
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
            © 2025 Wonder AI. All rights reserved.
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