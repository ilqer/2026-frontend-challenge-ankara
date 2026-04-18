import { motion } from 'motion/react';
import { MapPin, MessageSquare, StickyNote, Eye, Info, Layers } from 'lucide-react';

const filterOptions = [
  { value: 'all', label: 'All Evidence', icon: Layers },
  { value: 'checkins', label: 'Check-ins', icon: MapPin },
  { value: 'messages', label: 'Messages', icon: MessageSquare },
  { value: 'notes', label: 'Notes', icon: StickyNote },
  { value: 'sightings', label: 'Sightings', icon: Eye },
  { value: 'tips', label: 'Tips', icon: Info },
];

export function FilterChips({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.value;
        
        return (
          <motion.button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              relative px-4 py-2 rounded-full font-mono text-sm
              flex items-center gap-2 transition-all
              ${isActive 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                : 'bg-slate-900 dark:bg-slate-900 bg-slate-100 text-slate-400 dark:text-slate-400 text-slate-600 hover:bg-slate-800 dark:hover:bg-slate-800 hover:bg-slate-200 border border-slate-800 dark:border-slate-800 border-slate-300'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
