// src/components/ThemeToggle.jsx
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      className={`p-2 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 hover:bg-white/20 transition text-white ${className}`}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </motion.button>
  );
}
