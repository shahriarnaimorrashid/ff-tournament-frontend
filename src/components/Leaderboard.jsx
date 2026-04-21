// src/components/Leaderboard.jsx
// Real-time leaderboard via socket.io-client. If backend is unreachable,
// falls back to a small dummy leaderboard so the UI is never empty.
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

const FALLBACK = [
  { name: 'AlphaWolf', score: 980 },
  { name: 'NeonStrike', score: 920 },
  { name: 'PixelKing', score: 875 },
  { name: 'ShadowAce', score: 810 },
  { name: 'BlazeFox', score: 770 },
];

export default function Leaderboard({ tournamentId }) {
  const [players, setPlayers] = useState(FALLBACK);

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL;
    if (!url || !tournamentId) return;
    const socket = io(url, { transports: ['websocket'], reconnectionAttempts: 3 });
    socket.on('connect', () => {
      socket.emit('join-room', { roomId: `leaderboard-${tournamentId}` });
    });
    socket.on('leaderboard-update', (data) => {
      if (Array.isArray(data)) setPlayers(data.slice(0, 10));
    });
    return () => socket.disconnect();
  }, [tournamentId]);

  const top = [...players]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10);

  return (
    <div className="mt-6 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={18} className="text-yellow-400" />
        <h3 className="text-white font-semibold">Live Leaderboard</h3>
      </div>
      <ul className="space-y-1">
        <AnimatePresence initial={false}>
          {top.map((p, i) => (
            <motion.li
              key={p.name + i}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                i === 0 ? 'bg-yellow-500/15' : 'bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 text-sm font-bold ${
                  i === 0 ? 'text-yellow-300' : i === 1 ? 'text-gray-200' : i === 2 ? 'text-orange-300' : 'text-gray-400'
                }`}>
                  #{i + 1}
                </span>
                <span className="text-white text-sm">{p.name}</span>
              </span>
              <span className="text-cyan-300 font-mono text-sm">{p.score}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
