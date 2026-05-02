import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, Calendar, Users, Trophy, X, Check, BarChart3, DollarSign, UserCheck, Settings, Save, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers:0, totalTournaments:0, totalDeposits:0, monthlyData:[] });
  const [tournaments, setTournaments] = useState([]);
  const [pending, setPending] = useState([]);
  const [loadingTur, setLoadingTur] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', game:'Free Fire', date:'', registrationDeadline:'', maxParticipants:100, prize:'', bannerImage:'' });
  const [imageFile, setImageFile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [settingsForm, setSettingsForm] = useState({ heroTitle:'', heroSubtitle:'', siteName:'' });
  const [uploadingField, setUploadingField] = useState(null);

  const fetchStats = async () => { try { const res = await axiosInstance.get('/admin/stats'); setStats(res.data); } catch(_){} };
  const fetchTournaments = async () => { try { const res = await axiosInstance.get('/tournaments'); setTournaments(res.data); } catch(_){} finally { setLoadingTur(false); } };
  const fetchPending = async () => { try { const res = await axiosInstance.get('/admin/tournaments/pending'); setPending(res.data); } catch(_){} };
  const fetchSettings = async () => { try { const res = await axiosInstance.get('/admin/settings'); setSettings(res.data); setSettingsForm({ heroTitle: res.data.heroTitle||'', heroSubtitle: res.data.heroSubtitle||'', siteName: res.data.siteName||'' }); } catch(_){} };

  useEffect(() => { fetchStats(); fetchTournaments(); fetchPending(); fetchSettings(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSettingsChange = e => setSettingsForm({ ...settingsForm, [e.target.name]: e.target.value });

  const uploadBanner = async () => {
    if (!imageFile) return form.bannerImage;
    const fd = new FormData(); fd.append('photo', imageFile);
    const res = await axiosInstance.post('/user/profile/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.profilePic;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const banner = await uploadBanner();
      const payload = { ...form, bannerImage: banner };
      if (editingId) await axiosInstance.put(`/tournaments/${editingId}`, payload);
      else await axiosInstance.post('/tournaments', payload);
      toast.success(editingId ? 'Updated' : 'Created');
      setShowForm(false); setEditingId(null); setForm({ title:'', description:'', game:'Free Fire', date:'', registrationDeadline:'', maxParticipants:100, prize:'', bannerImage:'' }); setImageFile(null);
      fetchTournaments(); fetchPending(); fetchStats();
    } catch(err) { toast.error(err.response?.data?.msg || 'Failed'); }
  };

  const handleEdit = t => { setEditingId(t._id); setForm({ title:t.title, description:t.description||'', game:t.game, date:t.date?.slice(0,16)||'', registrationDeadline:t.registrationDeadline?.slice(0,16)||'', maxParticipants:t.maxParticipants, prize:t.prize||'', bannerImage:t.bannerImage||'' }); setImageFile(null); setShowForm(true); };
  const handleDelete = async id => { if (window.confirm('Delete?')) { await axiosInstance.delete(`/tournaments/${id}`); toast.success('Deleted'); fetchTournaments(); fetchStats(); } };
  const approve = async id => { await axiosInstance.put(`/admin/tournaments/${id}/approve`); toast.success('Approved'); fetchPending(); fetchTournaments(); };
  const reject = async id => { await axiosInstance.put(`/admin/tournaments/${id}/reject`); toast.success('Rejected'); fetchPending(); };

  const saveSettings = async () => { await axiosInstance.put('/admin/settings', settingsForm); toast.success('Settings saved'); };

  const handleSiteUpload = async (e, field) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('image', file); fd.append('field', field);
    setUploadingField(field);
    try { const res = await axiosInstance.post('/admin/settings/upload', fd); setSettings(prev => ({ ...prev, [field]: res.data[field] })); toast.success('Uploaded'); } catch(_) { toast.error('Upload failed'); } finally { setUploadingField(null); }
  };

  if (loadingTur || !settings) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">Admin Dashboard</h1>
        <div className="flex gap-2 mb-8 border-b border-white/10">
          {[{ id:'dashboard', label:'Stats', icon:<BarChart3 size={16}/> }, { id:'tournaments', label:'Tournaments', icon:<Trophy size={16}/> }, { id:'settings', label:'Site Settings', icon:<Settings size={16}/> }].map(tab => (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2 text-sm font-medium border-b-2 -mb-px transition ${activeTab===tab.id?'border-cyan-500 text-cyan-400':'border-transparent text-gray-400 hover:text-white'}`}>{tab.icon}{tab.label}</button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="glass-card p-5 flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Users</p><p className="text-3xl font-bold text-white">{stats.totalUsers}</p></div><UserCheck size={40} className="text-cyan-400 opacity-80" /></div>
              <div className="glass-card p-5 flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Tournaments</p><p className="text-3xl font-bold text-white">{stats.totalTournaments}</p></div><Trophy size={40} className="text-yellow-400 opacity-80" /></div>
              <div className="glass-card p-5 flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Deposits</p><p className="text-3xl font-bold text-green-400">৳{stats.totalDeposits}</p></div><DollarSign size={40} className="text-green-400 opacity-80" /></div>
            </div>
            {stats.monthlyData?.length>0 && (
              <div className="glass-card p-6"><h3 className="text-xl font-semibold text-white mb-4"><BarChart3 size={20} /> Registration Trends</h3>
                <ResponsiveContainer width="100%" height={250}><LineChart data={stats.monthlyData}><XAxis dataKey="month" stroke="#888" /><YAxis stroke="#888" /><Tooltip contentStyle={{ backgroundColor:'#1a1a1a', border:'none' }} /><Line type="monotone" dataKey="users" stroke="#00ffff" strokeWidth={2} /></LineChart></ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div>
            {pending.length>0 && (
              <div className="glass-card p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Pending Approvals</h2>
                {pending.map(t => (
                  <div key={t._id} className="flex justify-between items-center p-3 bg-white/5 rounded mb-2"><div><p className="text-white font-semibold">{t.title}</p><p className="text-gray-400 text-xs">{t.game} • by {t.createdBy?.name||'User'}</p></div><div className="flex gap-2"><button onClick={()=>approve(t._id)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button><button onClick={()=>reject(t._id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button></div></div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">All Tournaments ({tournaments.length})</h2><button onClick={()=>{setShowForm(true);setEditingId(null);setForm({ title:'', description:'', game:'Free Fire', date:'', registrationDeadline:'', maxParticipants:100, prize:'', bannerImage:'' });setImageFile(null);}} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full"><Plus size={20} /> Create</button></div>
            <AnimatePresence>{showForm && (
              <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} className="glass-card p-6 rounded-2xl mb-10">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2"><input name="title" value={form.title} onChange={handleChange} required placeholder="Title *" className="input-modern" /></div>
                  <div><input name="game" value={form.game} onChange={handleChange} placeholder="Game" className="input-modern" /></div>
                  <div><input name="prize" value={form.prize} onChange={handleChange} placeholder="Prize" className="input-modern" /></div>
                  <div><input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="input-modern" /></div>
                  <div><input type="datetime-local" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} className="input-modern" /></div>
                  <div><input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="input-modern" /></div>
                  <div><input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])} className="input-modern" /></div>
                  <div className="md:col-span-2"><textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Description" className="input-modern resize-none" /></div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button type="button" onClick={()=>setShowForm(false)} className="bg-gray-500 text-white px-6 py-2 rounded-full">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2">{editingId?<Check size={18}/>:<Plus size={18}/>}{editingId?'Update':'Create'}</button>
                  </div>
                </form>
              </motion.div>
            )}</AnimatePresence>
            <div className="glass-card p-6 rounded-2xl">
              {tournaments.length===0?<div className="text-center py-12"><Trophy size={48} className="mx-auto text-gray-600 mb-3" /><p className="text-gray-400">No tournaments yet.</p></div>
              :<div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10"><th className="text-left py-3 px-2 text-gray-400">Title</th><th className="text-left py-3 px-2 text-gray-400 hidden md:table-cell">Date</th><th className="text-left py-3 px-2 text-gray-400">Participants</th><th className="text-left py-3 px-2 text-gray-400">Actions</th></tr></thead><tbody>
                {tournaments.map(t=>(<tr key={t._id} className="border-b border-white/5 hover:bg-white/5 transition"><td className="py-3 px-2"><div className="font-semibold text-white">{t.title}</div></td><td className="py-3 px-2 text-gray-300 hidden md:table-cell">{new Date(t.date).toLocaleDateString()}</td><td className="py-3 px-2"><Users size={14} className="text-cyan-400 inline" /> {t.registeredUsers?.length||0}/{t.maxParticipants}</td><td className="py-3 px-2"><div className="flex gap-2"><button onClick={()=>handleEdit(t)} className="p-1.5 rounded-full bg-blue-500/20 text-blue-400"><Edit size={16}/></button><button onClick={()=>handleDelete(t._id)} className="p-1.5 rounded-full bg-red-500/20 text-red-400"><Trash2 size={16}/></button><Link to={`/tournaments/${t._id}`} className="p-1.5 rounded-full bg-green-500/20 text-green-400"><Eye size={16}/></Link></div></td></tr>))}
              </tbody></table></div>}
            </div>
          </div>
        )}

        {activeTab === 'settings' && settings && (
          <div className="glass-card p-8 rounded-2xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Text Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><input name="heroTitle" value={settingsForm.heroTitle} onChange={handleSettingsChange} placeholder="Hero Title" className="input-modern" /></div>
                <div><input name="heroSubtitle" value={settingsForm.heroSubtitle} onChange={handleSettingsChange} placeholder="Hero Subtitle" className="input-modern" /></div>
                <div><input name="siteName" value={settingsForm.siteName} onChange={handleSettingsChange} placeholder="Site Name" className="input-modern" /></div>
              </div>
              <button onClick={saveSettings} className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-full flex items-center gap-2"><Save size={16} /> Save Text</button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Image Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['heroImage','feature1Image','feature2Image','feature3Image','feature4Image','logoUrl'].map(field=>(
                  <div key={field} className="bg-white/5 p-4 rounded-xl">
                    <p className="text-sm text-gray-300 capitalize mb-2">{field}</p>
                    {settings[field] ? <img src={settings[field]} alt={field} className="w-full h-32 object-cover rounded-lg mb-2" /> : <div className="w-full h-32 bg-gray-800 rounded-lg mb-2 flex items-center justify-center text-gray-600">No image</div>}
                    <input type="file" accept="image/*" onChange={e=>handleSiteUpload(e,field)} disabled={uploadingField===field} />
                    {uploadingField===field && <p className="text-xs text-cyan-400 mt-1">Uploading...</p>}
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
