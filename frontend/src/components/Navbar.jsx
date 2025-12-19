import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const BLUR_AREA_HEIGHT = 430; 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Trending", href: "#trending" },
    { name: "How it Works", href: "#how-it-works" },
  ];

  return (
    <>
      {/* mobile backdrop */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 right-0 z-40 md:hidden pointer-events-none"
          style={{ 
            height: `${BLUR_AREA_HEIGHT}px`, 
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
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
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
          {/* glass reflection */}
          <div
            className="
              pointer-events-none absolute inset-x-0 top-0 h-px
              bg-linear-to-r from-transparent via-white/80 to-transparent
              rounded-full
            "
          />

          {/* inner glow for optical depth */}
          <div
            className="
              pointer-events-none absolute inset-0
              rounded-full
              bg-linear-to-b from-white/40 via-white/10 to-transparent
              opacity-70
            "
          />

          {/* bottom shadow for depth */}
          <div
            className="
              pointer-events-none absolute inset-x-4 -bottom-1 h-2
              bg-linear-to-b from-black/5 to-transparent
              blur-sm
              rounded-full
            "
          />

          {/* content container */}
          <div className="relative z-10 px-6 py-3 flex justify-between items-center">
            {/* Logo */}
            <a
              href="#"
              className="
                text-xl font-semibold tracking-tight
                text-brand-text
                transition-transform duration-200
                hover:scale-[1.04]
                active:scale-95
              "
            >
              WonderAI
            </a>

            {/* desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="
                    relative group
                    px-1
                    text-sm font-medium
                    text-brand-text/80
                    transition-all duration-300
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    hover:text-brand-primary
                    hover:-translate-y-0.5
                  "
                >
                  <span className="relative z-10">
                    {link.name}
                  </span>

                  {/* glass hover background */}
                  <span
                    className="
                      absolute -inset-1.5
                      rounded-xl
                      bg-white/30
                      backdrop-blur-md
                      opacity-0
                      scale-90
                      transition-all duration-300
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:opacity-100
                      group-hover:scale-100
                      z-0
                    "
                  />

                  {/* underline glow */}
                  <span
                    className="
                      absolute left-1/2 -bottom-2
                      h-0.5 w-0
                      bg-brand-primary
                      rounded-full
                      blur-[0.5px]
                      transition-all duration-300
                      ease-out
                      group-hover:w-full
                      group-hover:left-0
                    "
                  />
                </a>
              ))}

              {/* liquid glass effect */}
              <button
                className="
                  relative overflow-hidden group
                  px-6 py-2
                  rounded-full
                  transition-all duration-300
                  hover:scale-[1.08]
                  active:scale-95
                "
                style={{
                  background: 'rgba(101, 169, 224, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `
                    0 4px 24px rgba(101, 169, 224, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `
                }}
              >
                {/* top highlight */}
                <div
                  className="
                    pointer-events-none absolute inset-x-0 top-0 h-px
                    bg-linear-to-r from-transparent via-white/90 to-transparent
                  "
                />

                {/* inner gradient for depth */}
                <div
                  className="
                    pointer-events-none absolute inset-0
                    bg-linear-to-b from-white/30 via-transparent to-black/10
                    rounded-full
                  "
                />

                <span className="relative z-10 text-sm font-medium text-white">
                  Get Started
                </span>

                {/* hover glow */}
                <div
                  className="
                    pointer-events-none absolute inset-0
                    bg-white/20
                    rounded-full
                    opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />
              </button>
            </div>

            {/* mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
                md:hidden
                p-1 text-brand-text
                transition-transform duration-200
                hover:scale-110
                active:scale-90
              "
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
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
              ${
                isOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }
            `}
            style={{
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.5)
              `
            }}
          >
            {/* mobile menu */}
            <div
              className="
                pointer-events-none absolute inset-x-0 top-0 h-px
                bg-linear-to-r from-transparent via-white/70 to-transparent
              "
            />

            <div className="flex flex-col p-4 space-y-2 text-left">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="
                    py-2 pl-4 rounded-xl
                    text-brand-text font-medium
                    transition-all duration-200
                    hover:bg-brand-secondary/70
                    hover:scale-[1.03]
                    active:scale-95
                  "
                >
                  {link.name}
                </a>
              ))}

              {/* mobile CTA button */}
              <button
                className="
                  relative overflow-hidden
                  mt-2 w-full
                  py-2.5 rounded-xl
                  font-medium
                  transition-all duration-200
                  hover:scale-[1.03]
                  active:scale-95
                "
                style={{
                  background: 'rgba(101, 169, 224, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `
                    0 4px 20px rgba(101, 169, 224, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5)
                  `
                }}
              >
                {/* top highlight */}
                <div
                  className="
                    pointer-events-none absolute inset-x-0 top-0 h-px
                    bg-linear-to-r from-transparent via-white/80 to-transparent
                  "
                />
                
                <span className="relative z-10 text-white">
                  Get Started
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;