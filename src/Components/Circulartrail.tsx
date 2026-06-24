import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

const CircularTrail: React.FC = () => {
  const [_, setCursorPosition] = useState<Position>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Position[]>([]);

  const colors: string[] = [
    "#3B82F6", // blue
    "#EF4444", // red
    "#10B981", // green
    "#FACC15", // yellow
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#6366F1", // indigo
  ];

  const maxTrail = 20; // number of trail dots

  const updateCursorPosition = (e: MouseEvent) => {
    const newPos: Position = { x: e.clientX, y: e.clientY };
    setCursorPosition(newPos);

    // Add new position to trail
    setTrail((prev) => {
      const updated = [...prev, newPos];
      if (updated.length > maxTrail) updated.shift(); // remove oldest to keep trail length
      return updated;
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateCursorPosition);
    return () => window.removeEventListener("mousemove", updateCursorPosition);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {trail.map((pos, index) => {
          const color = colors[index % colors.length];
          const size = 10 + (index / maxTrail) * 20; // small to big
          const opacity = 0.2 + (index / maxTrail) * 0.8; // fade in/out

          return (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: 1,
                opacity: opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 0.5,
              }}
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: color,
                position: "absolute",
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                mixBlendMode: "screen" as const,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CircularTrail;