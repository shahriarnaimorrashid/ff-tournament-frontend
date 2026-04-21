// src/pages/TournamentDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../utils/axios';
import toast from 'react-hot-toast';
import ReactionBar from '../components/ReactionBar';
import CommentSection from '../components/CommentSection';
import ShareButtons from '../components/ShareButtons';
import CountdownTimer from '../components/CountdownTimer';
import Chat from '../components/Chat';
import Leaderboard from '../components/Leaderboard';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const fireConfetti = () => {
  const end = Date.now() + 800;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

export default function TournamentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ স্ক্রল টু টপ - পেজ ওপেন হলে উপরের অংশ দেখাবে
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchTournament = async () => {
    try {
      const res = await axiosInstance.get(`/tournaments/${id}`);
      setTournament(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t('error.generic'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament();
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setJoinLoading(true);
    setMessage('');
    try {
      const res = await axiosInstance.post(`/tournaments/${id}/join`);
      setMessage(res.data.msg || t('tournament.joinSuccess'));
      toast.success(res.data.msg || t('tournament.joinSuccess'));
      // Track joined games in localStorage for client-side recommendations
      try {
        const joined = JSON.parse(localStorage.getItem('joinedGames') || '[]');
        if (tournament?.game && !joined.includes(tournament.game)) {
          joined.push(tournament.game);
          localStorage.setItem('joinedGames', JSON.stringify(joined));
        }
      } catch (_) { /* ignore */ }
      await fetchTournament();
    } catch (err) {
      const msg = err.response?.data?.message || t('error.generic');
      if (err.response?.status === 402) {
        toast.error(`${msg} — ${t('wallet.topupHint')}`, { duration: 5000 });
      } else {
        toast.error(msg);
      }
      setMessage(msg);
    } finally {
      setJoinLoading(false);
    }
  };

  const userId = user?._id || user?.id;
  const isRegistered = user && tournament?.registeredUsers?.some(registered => {
    if (typeof registered === 'object' && registered !== null) {
      return registered._id === userId;
    }
    return registered === userId;
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen dark:text-white">
      {t('common.loading')}
    </div>
  );
  
  if (!tournament) return (
    <div className="flex justify-center items-center min-h-screen dark:text-white">
      Tournament not found
    </div>
  );

  return (
    // ✅ অতিরিক্ত প্যাডিং টপ - ফিক্সড হেডার এড়ানোর জন্য (প্রয়োজনে pt-20 বা pt-24)
    <div className="container mx-auto px-4 pt-20 pb-8 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">{tournament.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{tournament.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 dark:text-gray-300">
          <div><strong>{t('tournaments.game')}:</strong> {tournament.game}</div>
          <div><strong>{t('tournaments.date')}:</strong> {new Date(tournament.date).toLocaleString()}</div>
          <div><strong>{t('tournaments.prize')}:</strong> {tournament.prize || t('tournaments.notSpecified')}</div>
          <div><strong>{t('tournaments.participants')}:</strong> {tournament.registeredUsers?.length || 0} / {tournament.maxParticipants}</div>
        </div>

        {message && (
          <p className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
            {message}
          </p>
        )}

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Starts in</p>
          <CountdownTimer date={tournament.date} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isRegistered ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              disabled
              className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-6 py-2 rounded font-semibold cursor-default"
            >
              ✅ {t('tournaments.joined')}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={joinLoading}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 disabled:opacity-50 transition"
            >
              {joinLoading ? t('common.processing') : t('tournaments.join')}
            </motion.button>
          )}

          {/* Test trigger for confetti when a winner is declared */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={fireConfetti}
            className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-6 py-2 rounded font-semibold"
            title="Trigger winner celebration"
          >
            🏆 Win
          </motion.button>
        </div>

        <ReactionBar tournamentId={tournament._id} />
        <ShareButtons tournament={tournament} />
        <CommentSection tournamentId={tournament._id} />

        <Leaderboard tournamentId={tournament._id} />
        <Chat tournamentId={tournament._id} />
      </div>
    </div>
  );
}