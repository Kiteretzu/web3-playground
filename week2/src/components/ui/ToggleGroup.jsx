import { motion } from "framer-motion";

const options = [
  { id: "bitcoin", label: "Bitcoin", short: "BTC" },
  { id: "ethereum", label: "Ethereum", short: "ETH" },
  { id: "solana", label: "Solana", short: "SOL" },
];

export function ToggleGroup({ value, onChange }) {
  const isSelected = (id) => value.includes(id);

  const handleToggle = (id) => {
    if (!onChange) return;
    if (isSelected(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/60 p-1 shadow-sm shadow-slate-950/40">
      {options.map((opt) => (
        <motion.button
          key={opt.id}
          type="button"
          onClick={() => handleToggle(opt.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`relative flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isSelected(opt.id)
              ? "bg-sky-500 text-slate-950"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-[0.65rem] font-semibold">
            {opt.short}
          </span>
          <span>{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

