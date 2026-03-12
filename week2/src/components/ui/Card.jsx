import { motion } from "framer-motion";

export function Card({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md shadow-slate-950/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}

