import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-500 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search evidence, suspects, locations..."
        className="
          w-full pl-10 pr-10 py-2.5 rounded-lg
          bg-slate-900 dark:bg-slate-900 bg-slate-100
          border border-slate-800 dark:border-slate-800 border-slate-300
          text-slate-200 dark:text-slate-200 text-slate-900
          placeholder:text-slate-600 dark:placeholder:text-slate-600 placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
          transition-all font-mono text-sm
        "
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
