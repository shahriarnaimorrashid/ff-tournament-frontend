// src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axios';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, Calendar, Users, Trophy, X, Check, BarChart3, DollarSign, UserCheck, Settings, Image, Upload, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');

  // ---------- স্ট্যাটস স্টেট ----------
  const [stats, setStats] = useState({ totalUsers: 0, totalTournaments: 0, totalDeposits: 0, monthlyData: [] });

  // ---------- টুর্নামেন্ট স্টেট ----------
  const [tournaments, setTournaments] = useState([]);
  const [pending, setPending] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', game: 'Free Fire', date: '', registrationDeadline: '', maxParticipants: 100, prize: '', bannerImage: ''
  });
  const [imageFile, setImageFile] = useState(null);   // টুর্নামেন্ট ব্যানারের জন্য
  const fileRef = useRef();

  // ---------- সাইট সেটিংস স্টেট ----------
  const [siteSettings, setSiteSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsForm, setSettingsForm] = useState({});
  const [uploadingField, setUploadingField] = useState(null);

  // ----- ফেচ ফাংশন -----
  const fetchStats = async () => {
    try { const res = await axiosInstance.get('/admin/stats'); setStats(res.data); } catch (err) { console.error(err); }
  };
  const fetchTournaments = async () => {
    try { const res = await axiosInstance.get('/tournaments'); setTournaments(res.data); } catch (err) { toast.error('Failed to load tournaments'); }
  };
  const fetchPending = async () => {
    try { const res = await axiosInstance.get('/admin/tournaments/pending'); setPending(res.data); } catch (_) {}
  };
  const fetchSettings = async () => {
    try { const res = await axiosInstance.get('/admin/settings'); setSiteSettings(res.data); setSettingsForm({ heroTitle: res.data.heroTitle || '', heroSubtitle: res.data.heroSubtitle || '', siteName: res.data.siteName || '' }); } catch (_) {} finally { setSettingsLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    fetchTournaments().finally(() => setLoadingTournaments(false));
    fetchPending();
    fetchSettings();
  }, []);

  // ----- টুর্নামেন্ট ফর্ম হ্যান্ডলিং -----
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const uploadBannerImage = async () => {
    if (!imageFile) return form.bannerImage; // আগে থেকে URL থাকলে সেটাই
    const formData = new FormData();
    formData.append('photo', imageFile);
    const res = await axiosInstance.post('/user/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.profilePic;  // তুমি চাইলে আলাদা টুর্নামেন্ট ইমেজ রুট করো, কিন্তু আপাতত recycle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let bannerUrl = form.bannerImage;
      if (imageFile) bannerUrl = await uploadBannerImage();
      const payload = { ...form, bannerImage: bannerUrl };
      if (editingId) {
        await axiosInstance.put(`/tournaments/${editingId}`, payload);
        toast.success('Tournament updated');
      } else {
        await axiosInstance.post('/tournaments', payload);
        toast.success('Tournament created');
      }
      resetForm();
      fetchTournaments();
      fetchPending();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Operation failed');
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      title: t.title, description: t.description || '', game: t.game,
      date: t.date?.slice(0, 16) || '', registrationDeadline: t.registrationDeadline?.slice(0, 16) || '',
      maxParticipants: t.maxParticipants, prize: t.prize || '', bannerImage: t.bannerImage || ''
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tournament?')) return;
    try { await axiosInstance.delete(`/tournaments/${id}`); toast.success('Deleted'); fetchTournaments(); fetchStats(); } catch (err) { toast.error('Failed'); }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', description: '', game: 'Free Fire', date: '', registrationDeadline: '', maxParticipants: 100, prize: '', bannerImage: '' });
    setImageFile(null);
  };

  // ----- এপ্রুভাল হ্যান্ডলার -----
  const approve = async (id) => {
    try { await axiosInstance.put(`/admin/tournaments/${id}/approve`); toast.success('Approved'); fetchPending(); fetchTournaments(); } catch (err) { toast.error('Failed'); }
  };
  const reject = async (id) => {
    try { await axiosInstance.put(`/admin/tournaments/${id}/reject`); toast.success('Rejected'); fetchPending(); } catch (err) { toast.error('Failed'); }
  };

  // ----- সাইট সেটিংস হ্যান্ডলার -----
  const handleSettingsChange = (e) => setSettingsForm({ ...settingsForm, [e.target.name]: e.target.value });

  const saveSettings = async () => {
    try {
      await axiosInstance.put('/admin/settings', settingsForm);
      toast.success('Settings updated');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const handleSiteImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('field', field);
    setUploadingField(field);
    try {
      const res = await axiosInstance.post('/admin/settings/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSiteSettings(prev => ({ ...prev, [field]: res.data[field] }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingField(null);
    }
  };

  // ----- UI -----
  if (loadingTournaments || settingsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* হেডার */}
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">Admin Dashboard</h1>

        {/* ট্যাব নেভ */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          {[{ id: 'dashboard', label: 'Stats', icon: <BarChart3 size={16} /> },
            { id: 'tournaments', label: 'Tournaments', icon: <Trophy size={16} /> },
            { id: 'settings', label: 'Site Settings', icon: <Settings size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ================== STATS TAB ================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="glass-card p-5 flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Users</p><p className="text-3xl font-bold text-white">{stats.totalUsers}</p></div><UserCheck size={40} className="text-cyan-400 opacity-80" /></div>
              <div className="glass-card p-5 flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Tournaments</p><p className="text-3xl font-bold text-white">{stats.totalTournaments}</p></div><Trophy size={40} className="text-yellow-400 opacity-80" /></div>
              <div className="glass-card p-5 flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Deposits</p><p className="text-3xl font-bold text-green-400">৳{stats.totalDeposits}</p></div><DollarSign size={40} className="text-green-400 opacity-80" /></div>
            </div>
            {stats.monthlyData?.length > 0 && (
              <div className="glass-card p-6 mb-8"><h3 className="text-xl font-semibold text-white mb-4"><BarChart3 size={20} /> Registration Trends</h3>
                <ResponsiveContainer width="100%" height={250}><LineChart data={stats.monthlyData}><XAxis dataKey="month" stroke="#888" /><YAxis stroke="#888" /><Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} /><Line type="monotone" dataKey="users" stroke="#00ffff" strokeWidth={2} /></LineChart></ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* ================== TOURNAMENTS TAB ================== */}
        {activeTab === 'tournaments' && (
          <div>
            {/* Pending Approvals */}
            {pending.length > 0 && (
              <div className="glass-card p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Pending Approvals</h2>
                {pending.map(t => (
                  <div key={t._id} className="flex justify-between items-center p-3 bg-white/5 rounded mb-2">
                    <div><p className="text-white font-semibold">{t.title}</p><p className="text-gray-400 text-xs">{t.game} • by {t.createdBy?.name || 'User'}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => approve(t._id)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                      <button onClick={() => reject(t._id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">All Tournaments ({tournaments.length})</h2>
              <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold"><Plus size={20} /> Create Tournament</button>
            </div>

            {/* ফর্ম */}
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-6 rounded-2xl mb-10">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2"><label className="text-sm text-gray-300">Title *</label><input name="title" value={form.title} onChange={handleChange} required className="input-modern" /></div>
                    <div><label className="text-sm text-gray-300">Game</label><input name="game" value={form.game} onChange={handleChange} className="input-modern" /></div>
                    <div><label className="text-sm text-gray-300">Prize Pool</label><input name="prize" value={form.prize} onChange={handleChange} className="input-modern" /></div>
                    <div><label className="text-sm text-gray-300">Date *</label><input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="input-modern" /></div>
                    <div><label className="text-sm text-gray-300">Reg. Deadline</label><input type="datetime-local" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} className="input-modern" /></div>
                    <div><label className="text-sm text-gray-300">Max Participants</label><input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="input-modern" /></div>
                    {/* ইমেজ ইনপুট */}
                    <div><label className="text-sm text-gray-300">Banner Image</label><input type="file" accept="image/*" onChange={handleImageSelect} className="input-modern" />
                      {imageFile && <p className="text-xs text-green-400 mt-1">{imageFile.name}</p>}
                      {form.bannerImage && !imageFile && <p className="text-xs text-blue-400 mt-1">Current: {form.bannerImage.substring(0,30)}…</p>}
                    </div>
                    <div className="md:col-span-2"><label className="text-sm text-gray-300">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-modern resize-none" /></div>
                    <div className="md:col-span-2 flex justify-end gap-3">
                      <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded-full">Cancel</button>
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2">{editingId ? <Check size={18} /> : <Plus size={18} />} {editingId ? 'Update' : 'Create'}</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* টুর্নামেন্ট টেবিল */}
            <div className="glass-card p-6 rounded-2xl">
              {tournaments.length === 0 ? (
                <div className="text-center py-12"><Trophy size={48} className="mx-auto text-gray-600 mb-3" /><p className="text-gray-400">No tournaments yet.</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-white/10"><th className="text-left py-3 px-2 text-gray-400">Title</th><th className="text-left py-3 px-2 text-gray-400 hidden md:table-cell">Date</th><th className="text-left py-3 px-2 text-gray-400">Participants</th><th className="text-left py-3 px-2 text-gray-400">Actions</th></tr></thead>
                    <tbody>
                      {tournaments.map(t => (
                        <tr key={t._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-3 px-2"><div className="font-semibold text-white">{t.title}</div><div className="text-xs text-gray-500 md:hidden mt-1">{new Date(t.date).toLocaleDateString()}</div></td>
                          <td className="py-3 px-2 text-gray-300 hidden md:table-cell">{new Date(t.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2"><div className="flex items-center gap-1 text-gray-300"><Users size={14} className="text-cyan-400" />{t.registeredUsers?.length || 0}/{t.maxParticipants}</div></td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(t)} className="p-1.5 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"><Edit size={16} /></button>
                              <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 size={16} /></button>
                              <Link to={`/tournaments/${t._id}`} className="p-1.5 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30"><Eye size={16} /></Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================== SITE SETTINGS TAB ================== */}
        {activeTab === 'settings' && siteSettings && (
          <div className="glass-card p-8 rounded-2xl space-y-8">
            {/* টেক্সট */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Text Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-300">Hero Title</label><input name="heroTitle" value={settingsForm.heroTitle} onChange={handleSettingsChange} className="input-modern" /></div>
                <div><label className="text-sm text-gray-300">Hero Subtitle</label><input name="heroSubtitle" value={settingsForm.heroSubtitle} onChange={handleSettingsChange} className="input-modern" /></div>
                <div><label className="text-sm text-gray-300">Site Name</label><input name="siteName" value={settingsForm.siteName} onChange={handleSettingsChange} className="input-modern" /></div>
              </div>
              <button onClick={saveSettings} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full flex items-center gap-2"><Save size={16} /> Save Text</button>
            </div>

            {/* ইমেজ আপলোড */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Image Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['heroImage', 'feature1Image', 'feature2Image', 'feature3Image', 'feature4Image', 'logoUrl'].map(field => (
                  <div key={field} className="bg-white/5 p-4 rounded-xl">
                    <p className="text-sm text-gray-300 capitalize mb-2">{field}</p>
                    {siteSettings[field] ? (
                      <img src={siteSettings[field]} alt={field} className="w-full h-32 object-cover rounded-lg mb-2" />
                    ) : (
                      <div className="w-full h-32 bg-gray-800 rounded-lg mb-2 flex items-center justify-center text-gray-600">No image</div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleSiteImageUpload(e, field)} disabled={uploadingField === field} />
                    {uploadingField === field && <p className="text-xs text-cyan-400 mt-1">Uploading...</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
