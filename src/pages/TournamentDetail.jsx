// src/pages/TournamentDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { Calendar, Users, Trophy, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchTournament = async () => {
    try {
      const res = await axiosInstance.get(`/tournaments/${id}`);
      setTournament(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tournament');
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

    // ✅ প্রোফাইল চেক (ফোন নাম্বার থাকতে হবে)
    if (!user.phone || user.phone.trim() === '') {
      toast.error('Please complete your profile (add phone number) before joining.');
      navigate('/profile');
      return;
    }

    setJoinLoading(true);
    setMessage('');
    try {
      const res = await axiosInstance.post(`/tournaments/${id}/join`);
      setMessage(res.data.msg || 'Successfully joined!');
      toast.success('Joined successfully!');
      try {
        const joined = JSON.parse(localStorage.getItem('joinedGames') || '[]');
        if (tournament?.game && !joined.includes(tournament.game)) {
          joined.push(tournament.game);
          localStorage.setItem('joinedGames', JSON.stringify(joined));
        }
      } catch (_) {}
      await fetchTournament();
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred';
      if (err.response?.status === 402) {
        toast.error(msg + ' — Please top up your wallet.', { duration: 5000 });
      } else {
        toast.error(msg);
      }
      setMessage(msg);
    } finally {
      setJoinLoading(false);
    }
  };

  const userId = user?._id || user?.id;
  const isRegistered = user && tournament?.registeredUsers?.some(registered =>
    typeof registered === 'object' ? registered._id === userId : registered === userId
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Trophy size={64} className="text-gray-600 mb-4" />
        <p className="text-white text-xl">Tournament not found</p>
        <Link to="/tournaments" className="text-cyan-400 mt-4 hover:underline">← Back to tournaments</Link>
      </div>
    );
  }

  const participants = tournament.registeredUsers || [];
  const isFull = participants.length >= tournament.maxParticipants;
  const isDeadlinePassed = new Date() > new Date(tournament.registrationDeadline);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link to="/tournaments" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft size={18} />
          Back to tournaments
        </Link>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass-card p-8 mb-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{tournament.title}</h1>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                tournament.status === 'completed' ? 'bg-green-900 text-green-300' :
                tournament.status === 'ongoing' ? 'bg-yellow-900 text-yellow-300' :
                'bg-cyan-900 text-cyan-300'
              }`}>
                {tournament.status?.charAt(0).toUpperCase() + tournament.status?.slice(1) || 'Upcoming'}
              </span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">{tournament.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <Trophy size={24} className="text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">Prize Pool</p>
                  <p className="text-white font-bold text-lg">{tournament.prize || 'TBA'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <Calendar size={24} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">Date</p>
                  <p className="text-white font-semibold">{new Date(tournament.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">{new Date(tournament.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <Users size={24} className="text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">Participants</p>
                  <p className="text-white font-bold text-lg">{participants.length}/{tournament.maxParticipants}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <Clock size={24} className="text-pink-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">Game</p>
                  <p className="text-white font-semibold">{tournament.game}</p>
                </div>
              </div>
            </div>

            {/* Countdown + Join Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Tournament starts in</p>
                <CountdownTimer date={tournament.date} />
                {isDeadlinePassed && !tournament.status?.includes('completed') && (
                  <p className="text-red-400 text-sm mt-2">Registration deadline has passed.</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {isRegistered ? (
                  <motion.button
                    disabled
                    className="flex items-center gap-2 bg-green-600/30 text-green-300 px-6 py-3 rounded-full font-semibold cursor-default"
                  >
                    <CheckCircle size={20} />
                    You're registered
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoin}
                    disabled={joinLoading || isFull || isDeadlinePassed}
                    className="btn-gradient px-8 py-3 rounded-full text-white font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    {joinLoading ? 'Joining...' : isFull ? 'Tournament Full' : 'Join Tournament'}
                  </motion.button>
                )}
                {/* Win button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fireConfetti}
                  className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2"
                  title="Celebrate winner!"
                >
                  🏆 Win
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Participants Avatars */}
        {participants.length > 0 && (
          <div className="glass-card p-5 mb-8">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Registered Players ({participants.length})</h3>
            <div className="flex flex-wrap gap-2">
              {participants.slice(0, 10).map((p) => (
                <img
                  key={p._id || p}
                  src={p.profilePic || `https://ui-avatars.com/api/?name=${p.name || 'P'}&background=7c3aed&color=fff`}
                  alt={p.name}
                  className="w-10 h-10 rounded-full ring-2 ring-purple-500 object-cover"
                  title={p.name || p.email}
                />
              ))}
              {participants.length > 10 && (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold">
                  +{participants.length - 10}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reactions, Comments, Leaderboard, Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ReactionBar tournamentId={tournament._id} />
            <ShareButtons tournament={tournament} />
            <CommentSection tournamentId={tournament._id} />
          </div>
          <div className="space-y-6">
            <Leaderboard tournamentId={tournament._id} />
            <Chat tournamentId={tournament._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
