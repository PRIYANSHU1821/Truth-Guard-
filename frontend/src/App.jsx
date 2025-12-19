import { useState } from 'react'
import React from 'react'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 overflow-hidden pt-28"> 
      {/* Note: pt-28 (padding-top) ditambahkan agar konten tidak tertutup Navbar yang fixed */}

      {/* --- background --- */}
      <div className="absolute top-20 right-0 md:right-1/4 w-96 h-96 bg-brand-star rounded-full blur-3xl opacity-80 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-bgStart rounded-full blur-3xl opacity-40 -z-10"></div>

      {/* --- navbar --- */}
      <Navbar />

      {/* --- main content --- */}
      <main className="flex flex-col items-center w-full max-w-3xl text-center z-10">
  
      </main>

      <footer className="mt-auto py-8 text-brand-text/60 text-sm">
        © 2025 VeriScope AI. Powered by Gemini.
      </footer>

    </div>
  )
}

export default App
