import { motion } from 'motion/react';
import { Shield, Search, MapPin, User, LucideIcon } from 'lucide-react';

export function LoadingScreen() {
  const icons: LucideIcon[] = [Shield, Search, MapPin, User];

  return (
    <div className="fixed inset-0 bg-slate-950 dark:bg-slate-950 light:bg-slate-50 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Animated Icon Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 1,
              }}
            >
              <Icon className="w-12 h-12 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
            </motion.div>
          ))}
        </div>

        {/* Glitch Text Effect */}
        <div className="space-y-4">
          <motion.h1
            className="text-4xl font-mono tracking-wider text-cyan-400 dark:text-cyan-400 light:text-cyan-600"
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            ACCESSING DATABASE
          </motion.h1>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono">
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ▓
            </motion.span>
            <span>Gathering Evidence</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              ▓
            </motion.span>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-slate-800 dark:bg-slate-800 light:bg-slate-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>

        {/* Case Number */}
        <motion.p
          className="text-sm font-mono text-slate-500 dark:text-slate-500 light:text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          CASE-ANKARA-2024-PODO
        </motion.p>
      </div>
    </div>
  );
}
