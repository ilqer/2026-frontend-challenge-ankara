import { Moon, Sun, Shield, PanelLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onToggleNavigation?: () => void;
}

export function Header({ onToggleNavigation }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [hasScrollOffset, setHasScrollOffset] = useState(false);

  useEffect(() => {
    const containers = Array.from(
      document.querySelectorAll('[data-scroll-container="true"]')
    );

    const updateOffset = () => {
      setHasScrollOffset(containers.some((el) => el.scrollTop > 10));
    };

    containers.forEach((el) => el.addEventListener('scroll', updateOffset, { passive: true }));
    updateOffset();

    return () => {
      containers.forEach((el) => el.removeEventListener('scroll', updateOffset));
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-800 dark:border-slate-800 border-slate-200 px-6 py-4 transition-all ${
        hasScrollOffset
          ? 'bg-slate-950/80 dark:bg-slate-950/80 bg-white/80 backdrop-blur-md shadow-md shadow-black/20'
          : 'bg-slate-950 dark:bg-slate-950 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onToggleNavigation}
            className="p-2.5 rounded-lg bg-slate-900 dark:bg-slate-900 bg-slate-100 border border-slate-800 dark:border-slate-800 border-slate-300 hover:bg-slate-800 dark:hover:bg-slate-800 hover:bg-slate-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle navigation"
          >
            <PanelLeft className="w-5 h-5 text-slate-300 dark:text-slate-300 text-slate-700" />
          </motion.button>
          <motion.div
            className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-mono tracking-tight text-white dark:text-white text-slate-900">
              Missing Podo
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-500 text-slate-600 font-mono">
              CASE-ANKARA-2024 • CLASSIFIED
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg bg-slate-900 dark:bg-slate-900 bg-slate-100 border border-slate-800 dark:border-slate-800 border-slate-300 hover:bg-slate-800 dark:hover:bg-slate-800 hover:bg-slate-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </motion.button>
      </div>
    </header>
  );
}
