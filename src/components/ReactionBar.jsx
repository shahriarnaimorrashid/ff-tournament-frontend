import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
];

export default function ReactionBar({ tournamentId }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ like: 0, fire: 0, wow: 0, sad: 0 });
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    axios.get(`/tournaments/${tournamentId}/reactions`)
      .then(r => { setCounts(r.data.counts); setUserReaction(r.data.userReaction); })
      .catch(() => {});
  }, [tournamentId]);

  const react = async (type) => {
    if (!user) return toast.error('Login to react');
    try {
      const res = await axios.post(`/tournaments/${tournamentId}/reactions`, { type });
      setUserReaction(res.data.action === 'removed' ? null : res.data.type);
      // Optimistic update
      const next = { ...counts };
      if (res.data.action === 'removed') next[type] = Math.max(0, next[type] - 1);
      else if (res.data.action === 'changed') { next[userReaction] = Math.max(0, next[userReaction] - 1); next[type]++; }
      else next[type]++;
      setCounts(next);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="flex gap-3 flex-wrap my-4">
      {REACTIONS.map(r => (
        <button key={r.type} onClick={() => react(r.type)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition ${
            userReaction === r.type
              ? 'bg-purple-600 border-purple-500 text-white'
              : 'border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white'
          }`}>
          <span>{r.emoji}</span>
          <span>{counts[r.type]}</span>
        </button>
      ))}
    </div>
  );
}