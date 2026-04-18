import { motion } from 'motion/react';
import { AlertTriangle, Briefcase, MapPin } from 'lucide-react';

export function SuspectCard({ suspect, onClick }) {
  const getSuspicionColor = (level) => {
    if (level >= 80) return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', ring: 'ring-red-500/50' };
    if (level >= 60) return { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', ring: 'ring-orange-500/50' };
    return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', ring: 'ring-yellow-500/50' };
  };

  const colors = getSuspicionColor(suspect.suspicionLevel);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className={`
        cursor-pointer p-4 rounded-lg border ${colors.border}
        bg-slate-900/50 dark:bg-slate-900/50 light:bg-white
        backdrop-blur-sm hover:shadow-xl transition-all
        hover:ring-2 ${colors.ring}
      `}
    >
      {/* Header with Avatar */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          bg-gradient-to-br from-slate-700 to-slate-800
          dark:from-slate-700 dark:to-slate-800
          light:from-slate-200 light:to-slate-300
          font-mono text-lg text-slate-200 dark:text-slate-200 light:text-slate-700
        `}>
          {suspect?.name ? suspect.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
            {suspect.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
            <Briefcase className="w-3 h-3" />
            {suspect.occupation || 'Person of Interest'}
          </div>
        </div>
      </div>

      {/* Suspicion Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className={`w-3.5 h-3.5 ${colors.text}`} />
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">
              Suspicion Level
            </span>
          </div>
          <span className={`font-mono font-bold ${colors.text}`}>
            {suspect.suspicionLevel || 0}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${suspect.suspicionLevel || 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${colors.bg} ${colors.border} border-r-2`}
          />
        </div>
      </div>

      {/* Evidence Count */}
      <div className="mt-3 pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-500 light:text-slate-600">
            Connected Evidence
          </span>
          <span className="font-mono text-slate-400 dark:text-slate-400 light:text-slate-700 font-semibold">
            {suspect.evidenceCount || Math.floor(1) + 3}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
