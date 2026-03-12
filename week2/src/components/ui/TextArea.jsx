export function TextArea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full min-h-28 resize-y rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${className}`}
      {...props}
    />
  );
}

