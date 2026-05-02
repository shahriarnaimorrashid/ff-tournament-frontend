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

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const fetchTournament = async () => {
    try { const res = await axiosInstance.get(`/tournaments/${id}`); setTournament(res.data); } catch (err) { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchTournament(); }, [id]);

  const handleJoin = async () => {
    if (!user) return navigate('/login');
    if (!user.phone || user.phone.trim() === '') {
      toast.error('Please complete your profile (add phone number) before joining.');
      return navigate('/profile');
    }
    setJoinLoading(true);
    try {
      const res = await axiosInstance.post(`/tournaments/${id}/join`);
      toast.success('Joined!');
      await fetchTournament();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setJoinLoading(false); }
  };

  const userId = user?._id || user?.id;
  const isRegistered = user && tournament?.registeredUsers?.some(r => typeof r === 'object' ? r._id === userId : r === userId);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!tournament) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Tournament not found</div>;

  const participants = tournament.registeredUsers || [];
  const isFull = participants.length >= tournament.maxParticipants;
  const isDeadlinePassed = new Date() > new Date(tournament.registrationDeadline);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-5xl mx-auto">
        <Link to="/tournaments" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"><ArrowLeft size={18} /> Back</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative glass-card p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{tournament.title}</h1>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${tournament.status === 'completed' ? 'bg-green-900 text-green-300' : tournament.status === 'ongoing' ? 'bg-yellow-900 text-yellow-300' : 'bg-cyan-900 text-cyan-300'}`}>{tournament.status || 'Upcoming'}</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">{tournament.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5"><Trophy size={24} className="text-yellow-500" /><div><p className="text-xs text-gray-400 uppercase">Prize</p><p className="text-white font-bold">{tournament.prize || 'TBA'}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5"><Calendar size={24} className="text-cyan-400" /><div><p className="text-xs text-gray-400 uppercase">Date</p><p className="text-white font-semibold">{new Date(tournament.date).toLocaleDateString()}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5"><Users size={24} className="text-purple-400" /><div><p className="text-xs text-gray-400 uppercase">Participants</p><p className="text-white font-bold">{participants.length}/{tournament.maxParticipants}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5"><Clock size={24} className="text-pink-400" /><div><p className="text-xs text-gray-400 uppercase">Game</p><p className="text-white font-semibold">{tournament.game}</p></div></div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div><p className="text-sm text-gray-400 mb-2">Starts in</p><CountdownTimer date={tournament.date} /></div>
              <div className="flex items-center gap-3">
                {isRegistered ? <motion.button disabled className="flex items-center gap-2 bg-green-600/30 text-green-300 px-6 py-3 rounded-full font-semibold"><CheckCircle size={20} /> You're registered</motion.button>
                : <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleJoin} disabled={joinLoading || isFull || isDeadlinePassed} className="btn-gradient px-8 py-3 rounded-full text-white font-semibold disabled:opacity-50">{joinLoading ? 'Joining...' : isFull ? 'Full' : 'Join Tournament'}</motion.button>}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={fireConfetti} className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold">🏆 Win</motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        {participants.length > 0 && (
          <div className="glass-card p-5 mb-8">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Registered Players ({participants.length})</h3>
            <div className="flex flex-wrap gap-2">
              {participants.slice(0,10).map(p => <img key={p._id||p} src={p.profilePic || `https://ui-avatars.com/api/?name=${p.name||'P'}&background=7c3aed&color=fff`} className="w-10 h-10 rounded-full ring-2 ring-purple-500 object-cover" alt={p.name} />)}
              {participants.length > 10 && <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold">+{participants.length-10}</div>}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6"><ReactionBar tournamentId={tournament._id} /><ShareButtons tournament={tournament} /><CommentSection tournamentId={tournament._id} /></div>
          <div className="space-y-6"><Leaderboard tournamentId={tournament._id} /><Chat tournamentId={tournament._id} /></div>
        </div>
      </div>
    </div>
  );
}
