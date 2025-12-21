import React, { useState, useEffect } from "react";
import logoImg from "../assets/wonder-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e, href) => {
    e.preventDefault(); 
    
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    
    if (elem) {
      const headerOffset = 100; 
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    
    setIsOpen(false); 
  };

  const navLinks = [
    { name: "Trending", href: "#trending" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Disclaimer", href: "#disclaimer" },
    { name: "About", href: "#about" },
  ];

  return (
    <>
      {/* mobile backdrop */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 right-0 z-40 md:hidden pointer-events-none"
          style={{ 
            height: '470px', 
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)'
          }}
        />
      )}
      
      {/* transparent click overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* main navbar */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className={`
            relative w-full max-w-4xl
            transition-all duration-700 ease-out
            ${scrolled ? 'bg-white/30' : 'bg-white/25'}
            backdrop-blur-3xl backdrop-saturate-180%
            rounded-full
          `}
          style={{
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.6),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* glass effect */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent rounded-full" />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/40 via-white/10 to-transparent opacity-70" />
          <div className="pointer-events-none absolute inset-x-4 -bottom-1 h-2 bg-linear-to-b from-black/5 to-transparent blur-sm rounded-full" />

          {/* content container */}
          <div className="relative z-10 px-5 py-2 flex justify-between items-center">
            <a
              href="#"
              onClick={(e) => handleSmoothScroll(e, "#")} 
              className="flex items-center gap-2 text-lg font-semibold tracking-tight text-brand-text transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            >
              {/* logo */}
              <img 
                src={logoImg} 
                alt="WonderAI Logo" 
                className="w-8 h-8 object-contain" 
              />
              WonderAI
            </a>

            {/* desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="
                    relative group
                    px-1
                    text-sm font-medium
                    text-brand-text/80
                    transition-all duration-300
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    hover:text-brand-primary
                    hover:-translate-y-0.5
                    active:scale-95  /* Efek animasi klik (mengecil) */
                  "
                >
                  <span className="relative z-10">
                    {link.name}
                  </span>

                  {/* glass hover background */}
                  <span className="absolute -inset-1.5 rounded-xl bg-white/30 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100 z-0" />

                  {/* underline glow */}
                  <span className="absolute left-1/2 -bottom-2 h-0.5 w-0 bg-brand-primary rounded-full blur-[0.5px] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0" />
                </a>
              ))}

              {/* get started button */}
              <button
                className="relative overflow-hidden group px-5 py-1.5 rounded-full transition-all duration-300 hover:scale-[1.08] active:scale-95"
                style={{
                  background: 'rgba(101, 169, 224, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 24px rgba(101, 169, 224, 0.4)'
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/90 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/30 via-transparent to-black/10 rounded-full" />
                <span className="relative z-10 text-sm font-medium text-white">Get Started</span>
                <div className="pointer-events-none absolute inset-0 bg-white/20 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </div>

            {/* mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1 text-brand-text transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          {/* mobile menu dropdown */}
          <div
            className={`
              md:hidden absolute top-full left-0 right-0 mt-3 z-50
              bg-white/40 backdrop-blur-3xl backdrop-saturate-180%
              rounded-3xl
              shadow-[0_20px_60px_rgba(0,0,0,0.15)]
              overflow-hidden
              transition-all duration-300 ease-out origin-top
              ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
            `}
            style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)' }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent" />

            <div className="flex flex-col p-4 space-y-2 text-left">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  // Handler scroll untuk mobile
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="
                    py-2 pl-4 rounded-xl
                    text-brand-text font-medium
                    transition-all duration-200
                    hover:bg-brand-secondary/70
                    hover:scale-[1.03]
                    active:scale-95  /* Efek tekan di mobile */
                  "
                >
                  {link.name}
                </a>
              ))}

              <button className="relative overflow-hidden mt-2 w-full py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95"
                style={{ background: 'rgba(101, 169, 224, 0.9)', backdropFilter: 'blur(20px)' }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent" />
                <span className="relative z-10 text-white">Get Started</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;