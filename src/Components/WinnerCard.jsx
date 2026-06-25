import React, { useRef } from "react";
import html2canvas from "html2canvas-pro";

const performanceMessages = [
  { maxTime: 300, message: "Lightning Fast! 🔥", color: "text-amber-400" },
  { maxTime: 600, message: "Great Pace! ⏱️", color: "text-emerald-400" },
  { maxTime: 1200, message: "Steady & Accurate! 🧠", color: "text-blue-400" },
  { maxTime: Infinity, message: "Completed! Finished strong. 💪", color: "text-slate-400" }
];

const Card = ({ name = "Alex", score = 1050, time = 45, mode = "Hard Mode" }) => {
  const cardRef = useRef(null);

  const numericTime = typeof time === 'number' ? time : parseInt(time, 10) || 0;
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const runtimeStatus = performanceMessages.find((item) => numericTime <= item.maxTime) || performanceMessages[3];

  const downloadCardPNG = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0f172a",
        scale: 3,                   
        logging: false,
        onclone: (_doc, el) => {
          el.style.animation = 'none';
          el.style.opacity = '1';
          el.style.transform = 'none';
          
          el.querySelectorAll("*").forEach((node) => {
            node.style.animation = 'none';
            
            if (node.classList.contains("backdrop-blur-md")) {
              node.style.backdropFilter = "none";
              node.style.webkitBackdropFilter = "none";
              node.style.backgroundColor = "rgba(15, 23, 42, 0.75)";
            }
            
            if (node.classList.contains("bg-clip-text")) {
              node.style.background = "none";
              node.style.color = "#d8b4fe";
              node.style.webkitTextFillColor = "initial";
              node.classList.remove("text-transparent");
            }
            
            if (node.classList.contains("animate-[growLine_1s_1.2s_ease-out_both]")) {
              node.classList.remove("w-0");
              node.style.width = "100%";
            }
          });
          
          el.style.backgroundColor = "#0f172a";
        },
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `${name}_sudoku_card.png`;
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4 select-none">
      <div 
        ref={cardRef}
        className="relative flex flex-col items-center w-80 rounded-3xl p-6 text-white overflow-hidden border border-white/10 shadow-2xl bg-cover bg-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.3)] animate-[fadeInUp_0.6s_ease-out_both]"
        style={{ 
          backgroundImage: `url('${window.location.origin}/SudokuBoard.jpeg')` 
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-0" />
        <div className="relative z-10 w-full flex flex-col items-center">
          
          <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/10 border border-white/20 text-indigo-300 mb-6 transition-all duration-300 hover:bg-white/20">
            {mode}
          </span>

          <div className="w-20 h-20 mb-4 flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-indigo-500/30 shadow-lg transform rotate-45 hover:scale-[1.05] hover:animate-[shakeTrophy_0.1s_ease-in]"> 
            <div className="grid grid-rows-3 grid-cols-3 gap-1 w-10 h-10 -rotate-45">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    idx % 2 === 0 ? "bg-white scale-100" : "bg-white/40 scale-90"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center w-full my-2">
            <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm mb-1">{name}</h1>
            <div className="h-[2px] w-0 bg-linear-to-r from-transparent via-indigo-500 to-transparent mx-auto my-3 animate-[growLine_1s_1.2s_ease-out_both]" />
            
            <h2 className="text-4xl font-extrabold bg-linear-to-r from-indigo-200 via-purple-300 to-pink-200 bg-clip-text text-transparent tracking-tight">
              {score.toLocaleString()} <span className="text-sm font-light text-slate-400">pts</span>
            </h2>
          </div>

          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 my-4 flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-[spin_20s_linear_infinite]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Time Elapsed: <strong className="text-slate-200">{formatTime(numericTime)}</strong></span>
            </div>
            <p className={`text-sm font-semibold mt-1 tracking-wide drop-shadow-sm ${runtimeStatus.color}`}>
              {runtimeStatus.message}
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs my-1 group cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12"
            >
              <path d="M12 13v8" />
              <path d="M12 3v3" />
              <path d="M18.172 6a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
            </svg>
            <span className="transition-colors duration-300 group-hover:text-slate-200">Congratulations on solving the puzzle!</span>
          </div>

          <p className="text-[10px] tracking-widest text-slate-500 uppercase mt-6 font-medium">
            MindGames Sanctuary ©
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 border border-color-white-100 blur-2xl rounded-full pointer-events-none animate-pulse" />
      </div>
      <button 
        onClick={downloadCardPNG}
        className="w-80 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.96] transition transform duration-150 flex items-center justify-center gap-2 dynamic-btn animate-[fadeInUp_0.6s_ease-out_0.2s_both]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-y-0.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        Save Card (PNG)
      </button>
    </div>
  );
};

export default Card;