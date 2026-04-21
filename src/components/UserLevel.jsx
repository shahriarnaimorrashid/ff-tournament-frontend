// src/components/UserLevel.jsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function UserLevel({ level = 1, exp = 0, badges = [] }) {
  const max = Math.max(1, level * 100);
  const pct = Math.min(100, Math.round((exp / max) * 100));
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevel = useRef(level);

  useEffect(() => {
    if (level > prevLevel.current) {
      setShowLevelUp(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      const t = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(t);
    }
    prevLevel.current = level;
  }, [level]);

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">Level</p>
          <p className="text-3xl font-bold text-white">{level}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">EXP</p>
          <p className="text-white font-semibold">{exp} / {max}</p>
        </div>
      </div>
      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
        />
      </div>
      {badges?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {badges.map((b) => (
            <span
              key={b}
              className="text-xs bg-yellow-600/80 text-white px-3 py-1 rounded-full shadow-md"
            >
              🏆 {b}
            </span>
          ))}
        </div>
      )}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center text-sm font-semibold text-yellow-300"
          >
            🎉 Level Up! Welcome to level {level}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
