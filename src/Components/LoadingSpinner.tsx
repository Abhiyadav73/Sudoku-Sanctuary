// DualArcSpinner.tsx
import React from "react";
import { motion } from "framer-motion";

const colors = ["#ff4d6d", "#ffa64d", "#fffa4d", "#4dff9e", "#854dffff", "#a84dff"];
const LoadingMessages: string[] = ["Getting Started", "Generating Board", "Populating Grid", "Almost There...", "Enjoy the game", "Dhrundhar...!!","You are not ready for this!!!","You are still not ready for this!!!"];

const DualArcSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-surface/80 backdrop-blur-md flex-col">
      <motion.svg width="120" height="120" viewBox="0 0 100 100">
        {/* First Arc */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={colors[0]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="62.8 188.4"
          strokeDashoffset="0"
          style={{ filter: "blur(0.5px)" }}
          animate={{ rotate: 360, stroke: colors }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
            times: Array(colors.length).fill(0).map((_, i) => i / (colors.length - 1)),
          }}
        />

        {/* Second Arc (opposite direction) */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke={colors[2]}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="47.1 141.3"
          strokeDashoffset="0"
          style={{ filter: "blur(0.5px)" }}
          animate={{ rotate: -360, stroke: colors.slice().reverse() }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
            times: Array(colors.length).fill(0).map((_, i) => i / (colors.length - 1)),
          }}
        />
      </motion.svg>
      <p className="text-[#9FA1FF] text-xl font-bold mt-4 animate-pulseColor bigbesty">{LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)]}</p>  
    </div>
  );
};

export default DualArcSpinner;