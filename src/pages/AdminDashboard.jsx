// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axios';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, Calendar, Users, Trophy, X, Check, BarChart3, DollarSign, UserCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalTournaments: 0, totalDeposits: 0, monthlyData: [] });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', game: 'Free Fire', date: '', registrationDeadline: '', maxParticipants: 100, prize: ''
  });
  const { t } = useTranslation();

  const fetchTournaments = async () => {
    try {
      const res = await axiosInstance.get('/tournaments');
      setTournaments(res.data);
    } catch (err) {
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchStats();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/tournaments/${editingId}`, form);
        toast.success('Tournament updated');
      } else {
        await axiosInstance.post('/tournaments', form);
        toast.success('Tournament created');
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ title: '', description: '', game: 'Free Fire', date: '', registrationDeadline: '', maxParticipants: 100, prize: '' });
      fetchTournaments();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Operation failed');
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      title: t.title,
      description: t.description || '',
      game: t.game,
      date: t.date?.slice(0, 16) || '',
      registrationDeadline: t.registrationDeadline?.slice(0, 16) || '',
      maxParticipants: t.maxParticipants,
      prize: t.prize || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await axiosInstance.delete(`/tournaments/${id}`);
        toast.success('Tournament deleted');
        fetchTournaments();
        fetchStats();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* হেডার */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage tournaments, users, and more</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '', game: 'Free Fire', date: '', registrationDeadline: '', maxParticipants: 100, prize: '' }); }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-full font-semibold transition transform hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'Create Tournament'}
          </button>
        </div>

        {/* স্ট্যাটস কার্ড */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="glass-card p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <UserCheck size={40} className="text-cyan-400 opacity-80" />
          </div>
          <div className="glass-card p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tournaments</p>
              <p className="text-3xl font-bold text-white">{stats.totalTournaments}</p>
            </div>
            <Trophy size={40} className="text-yellow-400 opacity-80" />
          </div>
          <div className="glass-card p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Deposits</p>
              <p className="text-3xl font-bold text-green-400">৳{stats.totalDeposits}</p>
            </div>
            <DollarSign size={40} className="text-green-400 opacity-80" />
          </div>
        </div>

        {/* চার্ট (যদি ডাটা থাকে) */}
        {stats.monthlyData && stats.monthlyData.length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 size={20} /> Registration Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.monthlyData}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
                <Line type="monotone" dataKey="users" stroke="#00ffff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ফর্ম (আগের মতো) */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6 rounded-2xl mb-10"
            >
              <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                {editingId ? <Edit size={24} /> : <Plus size={24} />}
                {editingId ? 'Edit Tournament' : 'Create New Tournament'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 block mb-1">Tournament Title *</label>
                  <input name="title" placeholder="e.g., Free Fire Summer Clash" value={form.title} onChange={handleChange} required className="input-modern" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Game</label>
                  <input name="game" placeholder="Game name" value={form.game} onChange={handleChange} className="input-modern" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Prize Pool</label>
                  <input name="prize" placeholder="e.g., 10,000 BDT" value={form.prize} onChange={handleChange} className="input-modern" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Tournament Date *</label>
                  <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="input-modern" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Registration Deadline</label>
                  <input type="datetime-local" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} className="input-modern" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Max Participants</label>
                  <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="input-modern" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 block mb-1">Description</label>
                  <textarea name="description" placeholder="Tournament details, rules, etc." value={form.description} onChange={handleChange} rows="3" className="input-modern resize-none" />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-semibold transition flex items-center gap-2">
                    {editingId ? <Check size={18} /> : <Plus size={18} />}
                    {editingId ? 'Update Tournament' : 'Create Tournament'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* টুর্নামেন্ট টেবল (আগের মতোই) */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy size={24} className="text-yellow-500" />
              All Tournaments
            </h2>
            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              Total: {tournaments.length}
            </span>
          </div>

          {tournaments.length === 0 ? (
            <div className="text-center py-12">
              <Trophy size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-lg">No tournaments yet.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 text-cyan-400 hover:underline flex items-center gap-1 mx-auto">
                <Plus size={16} /> Create your first tournament
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Title</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Participants</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {tournaments.map((t, idx) => (
                    <motion.tr
                      key={t._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-3 px-2">
                        <div className="font-semibold text-white">{t.title}</div>
                        <div className="text-xs text-gray-500 md:hidden mt-1">{new Date(t.date).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-2 text-gray-300 hidden md:table-cell">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1 text-gray-300">
                          <Users size={14} className="text-cyan-400" />
                          {t.registeredUsers?.length || 0} / {t.maxParticipants}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(t)} className="p-1.5 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition" title="Delete">
                            <Trash2 size={16} />
                          </button>
                          <Link to={`/tournaments/${t._id}`} className="p-1.5 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition" title="View">
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}