import React from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

const Guidelines = ({ onClose }) => {
  // generate pdf
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("TruthGuard: Transparency & Ethics", 20, 20);

    // version line
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Version 1.0 | Automated Report", 20, 28);
    doc.line(20, 32, 190, 32);

    // content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = 45;

    const sections = [
      { t: "1. Our Vision", b: "TruthGuard acts as a digital shield. We combine AI with global fact-checking networks to restore trust in information." },
      { t: "2. How it Works", b: "Paste text or URL. Our engine analyzes claims, fallacies, and logic. Results provide a Confidence Score and Verdict." },
      { t: "3. AI Limitations", b: "AI models can hallucinate. Results are for reference only, not absolute truth. Always verify critical info manually." },
      { t: "4. Privacy Policy", b: "We do NOT store your input text personally. Processing is real-time and ephemeral for your safety." },
      { t: "5. User Responsibility", b: "'Trust, but Verify.' Users are responsible for sharing information. Please cross-reference with official sources." }
    ];

    sections.forEach((sec) => {
      doc.setFont("helvetica", "bold");
      doc.text(sec.t, 20, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(sec.b, 170);
      doc.text(splitText, 20, yPos);
      yPos += (splitText.length * 6) + 10;
    });

    doc.save("TruthGuard_Guidelines.pdf");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex justify-center items-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 bg-brand-primary text-white flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold">Guidelines & Ethics</h2>
          
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <p className="font-medium">Welcome to TruthGuard. Please read our guidelines:</p>
          <ul className="space-y-3 list-disc pl-5 text-sm text-gray-700">
            <li><strong>AI Limitations:</strong> AI may hallucinate. Use as a second opinion.</li>
            <li><strong>Data Privacy:</strong> We process data in real-time and do not store inputs.</li>
            <li><strong>Responsibility:</strong> Verify critical news (Health/Politics) manually.</li>
          </ul>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-200">Close</button>
          <button onClick={handleDownloadPDF} className="px-6 py-2 rounded-full text-sm font-bold text-white bg-brand-primary hover:shadow-lg">Download PDF</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Guidelines;