import { motion } from "framer-motion";
import React from "react";

function PageTransition({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className={className}
      style={className ? {} : { position: "absolute", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;