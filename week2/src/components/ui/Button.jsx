import { motion } from "framer-motion";

const baseClasses =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-sky-500 text-slate-950 hover:bg-sky-400 active:bg-sky-600 border border-sky-400/60",
  outline:
    "border border-slate-700 text-slate-100 hover:bg-slate-800 active:bg-slate-900",
  ghost:
    "text-slate-300 hover:bg-slate-800/80 active:bg-slate-900/80 border border-transparent",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variantClasses = variants[variant] ?? variants.primary;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

