// src/pages/Tournaments.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Sparkles, Search, Filter } from 'lucide-react';
import axiosInstance from '../utils/axios';
import { useTranslation } from 'react-i18next';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const { t } = useTranslation();

  useEffect(() => {
    axiosInstance.get('/tournaments')
      .then(res => setTournaments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const uniqueGames = ['all', ...new Set(tournaments.map(t => t.game))];

  // ক্লায়েন্ট-সাইড রেকমেন্ডেশন
  let joinedGames = [];
  try { joinedGames = JSON.parse(localStorage.getItem('joinedGames') || '[]'); } catch (_) { joinedGames = []; }
  const recommended = joinedGames.length
    ? tournaments.filter(t => joinedGames.includes(t.game)).slice(0, 3)
    : [];

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesGame = gameFilter === 'all' ? true : t.game === gameFilter;
    return matchesSearch && matchesGame;
  });

  // ----- লোডিং স্টেট (ডার্ক থিম প্রিমিয়াম স্কেলেটন) -----
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          {/* টাইটেল স্কেলেটন */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 w-2/3 sm:w-1/3 bg-white/5 rounded-2xl mx-auto mb-3" />
            <div className="h-5 w-1/2 sm:w-1/4 bg-white/5 rounded-2xl mx-auto" />
          </div>
          {/* সার্চ ও ফিল্টার স্কেলেটন */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-pulse">
            <div className="flex-1 h-12 bg-white/5 rounded-2xl" />
            <div className="w-full sm:w-44 h-12 bg-white/5 rounded-2xl" />
          </div>
          {/* কার্ড স্কেলেটন */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card p-5 md:p-6 animate-pulse">
                <div className="h-6 bg-white/5 rounded-2xl w-3/4 mb-5" />
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-white/5 rounded-2xl" />
                  <div className="h-4 bg-white/5 rounded-2xl w-4/5" />
                  <div className="h-4 bg-white/5 rounded-2xl w-2/3" />
                </div>
                <div className="h-12 bg-white/5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----- আসল UI -----
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* হেডার */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            <span className="text-gradient-primary">{t('tournaments.upcoming')}</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-2xl mx-auto">
            {t('tournaments.checkBack')}
          </p>
        </motion.div>

        {/* AI Recommended */}
        {recommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={22} className="text-pink-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Recommended for you</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((tournament, idx) => (
                <motion.div
                  key={`rec-${tournament._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="glass-card overflow-hidden p-5 md:p-6 relative group"
                >
                  {/* ব্যানার ইমেজ থাকলে */}
                  {tournament.bannerImage && (
                    <img loading="lazy" src={tournament.bannerImage} alt={tournament.title} className="h-36 w-full object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" />
                  )}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{tournament.title}</h3>
                    <Trophy size={20} className="text-yellow-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full">{tournament.game}</span>
                    <span>•</span>
                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300 mb-5">
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-purple-400 flex-shrink-0" />
                      <span>{tournament.registeredUsers?.length || 0} / {tournament.maxParticipants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={15} className="text-yellow-500 flex-shrink-0" />
                      <span>{tournament.prize || 'TBA'}</span>
                    </div>
                  </div>
                  <Link to={`/tournaments/${tournament._id}`} className="block">
                    <button className="w-full btn-gradient py-2.5 rounded-full text-white font-semibold text-sm tracking-wide">
                      View Details
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* সার্চ ও ফিল্টার */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-modern pl-11"
            />
          </div>
          <div className="relative w-full sm:w-52">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="input-modern pl-11 appearance-none"
            >
              {uniqueGames.map(game => (
                <option key={game} value={game}>{game === 'all' ? 'All Games' : game}</option>
              ))}
            </select>
          </div>
        </div>

        {/* টুর্নামেন্ট গ্রিড */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament, idx) => (
            <motion.div
              key={tournament._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="glass-card overflow-hidden p-5 md:p-6 group relative"
            >
              {/* ব্যানার ইমেজ প্রিভিউ */}
              {tournament.bannerImage && (
                <img loading="lazy" src={tournament.bannerImage} alt={tournament.title} className="h-40 w-full object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
              )}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-bold text-white line-clamp-1">{tournament.title}</h3>
                <Trophy size={20} className="text-yellow-400 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{tournament.game}</span>
                <span>•</span>
                <span>{new Date(tournament.date).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300 mb-5">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-purple-400 flex-shrink-0" />
                  <span>{tournament.registeredUsers?.length || 0} / {tournament.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={15} className="text-yellow-500 flex-shrink-0" />
                  <span>{tournament.prize || 'TBA'}</span>
                </div>
              </div>
              <Link to={`/tournaments/${tournament._id}`} className="block">
                <button className="w-full btn-gradient py-2.5 rounded-full text-white font-semibold text-sm tracking-wide">
                  View Details
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* এম্পটি স্টেট */}
        {filteredTournaments.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy size={56} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-300 text-lg font-semibold">No tournaments found</p>
            <p className="text-gray-500 text-sm mt-2">Try a different search or filter</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
