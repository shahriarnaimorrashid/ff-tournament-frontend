// src/pages/Tournaments.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Sparkles, Search, Filter } from 'lucide-react';
import axiosInstance from '../utils/axios';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

  // Client-side AI recommendation: based on previously joined games (localStorage)
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card p-5 md:p-6">
                <Skeleton height={24} className="mb-3" />
                <Skeleton count={3} className="mb-4" />
                <Skeleton height={40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="text-gradient-primary">{t('tournaments.upcoming')}</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">{t('tournaments.checkBack')}</p>
        </motion.div>

        {recommended.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-pink-400" /> Recommended for you
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommended.map((tournament, idx) => (
                <motion.div
                  key={`rec-${tournament._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{tournament.title}</h3>
                    <Trophy size={18} className="text-yellow-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-300 mb-3">{tournament.game} • {new Date(tournament.date).toLocaleDateString()}</p>
                  <Link to={`/tournaments/${tournament._id}`}>
                    <button className="w-full btn-gradient py-2 rounded-full text-white text-sm font-semibold">
                      View
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* সার্চ ও ফিল্টার বার */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-modern pl-10 w-full"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="input-modern pl-10 appearance-none w-full"
            >
              {uniqueGames.map(game => (
                <option key={game} value={game}>{game === 'all' ? 'All Games' : game}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredTournaments.map((tournament, idx) => (
            <motion.div
              key={tournament._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card overflow-hidden group"
            >
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg md:text-xl font-bold text-white line-clamp-1">{tournament.title}</h3>
                  <Trophy size={18} className="text-yellow-500 flex-shrink-0" />
                </div>
                <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2">{tournament.description || t('tournaments.description')}</p>
                <div className="space-y-1.5 text-xs md:text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-cyan-400 flex-shrink-0" />
                    <span>{t('tournaments.date')}: {new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-purple-400 flex-shrink-0" />
                    <span>{t('tournaments.participants')}: {tournament.registeredUsers?.length || 0} / {tournament.maxParticipants}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-pink-400 flex-shrink-0" />
                    <span>{t('tournaments.prize')}: {tournament.prize || 'TBA'}</span>
                  </div>
                </div>
                <Link to={`/tournaments/${tournament._id}`}>
                  <button className="w-full mt-5 md:mt-6 btn-gradient py-2 rounded-full text-white font-semibold text-sm md:text-base">
                    {t('tournaments.viewDetails')}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-16">
            <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-base md:text-lg">No tournaments found</p>
            <p className="text-gray-500 text-sm mt-2">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}