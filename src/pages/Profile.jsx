// src/pages/Profile.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Camera, User, Lock, Trophy, MapPin, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserLevel from '../components/UserLevel';

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const fileRef = useRef();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const pwForm = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/user/profile');
      setProfile(res.data);
      reset(res.data);
    } catch (err) {
      toast.error(t('profile.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const onSaveProfile = async (data) => {
    try {
      const res = await axios.put('/user/profile', {
        name: data.name,
        bio: data.bio,
        location: data.location,
        social: {
          facebook: data['social.facebook'],
          instagram: data['social.instagram'],
          whatsapp: data['social.whatsapp']
        }
      });
      setProfile(res.data);
      updateUser({ name: res.data.name, profilePic: res.data.profilePic });
      toast.success(t('profile.saved'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('error.generic'));
    }
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error(t('profile.passwordMismatch'));
    }
    try {
      await axios.put('/user/profile/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success(t('profile.passwordChanged'));
      pwForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || t('error.generic'));
    }
  };

  const onPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.photoTooLarge'));
      return;
    }
    const formData = new FormData();
    formData.append('photo', file);
    setUploading(true);
    try {
      const res = await axios.post('/user/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profilePic: res.data.profilePic }));
      updateUser({ profilePic: res.data.profilePic });
      toast.success(t('profile.photoUpdated'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('error.generic'));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: t('profile.tab.info'), icon: <User size={16} /> },
    { id: 'password', label: t('profile.tab.password'), icon: <Lock size={16} /> },
    { id: 'tournaments', label: t('profile.tab.tournaments'), icon: <Trophy size={16} /> }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* প্রোফাইল হেডার */}
        <div className="glass-card p-8 mb-8 text-center">
          <div className="relative inline-block">
            <img
              src={profile?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=0ea5e9&color=fff&size=128`}
              alt="Profile"
              loading="lazy"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-cyan-500 mx-auto"
            />
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              className="absolute bottom-2 right-2 bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-full transition"
            >
              <Camera size={16} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">{profile?.name}</h1>
          <p className="text-gray-400">{profile?.email}</p>

          {/* ব্যাজ সেকশন (নতুন) */}
          {profile?.badges && profile.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {profile.badges.map(badge => (
                <span key={badge} className="bg-yellow-600/80 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  🏆 {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* User Level & XP */}
        <UserLevel
          level={profile?.level ?? 1}
          exp={profile?.exp ?? 0}
          badges={profile?.badges ?? []}
        />

        {/* ট্যাব */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ট্যাব: ইনফো */}
        {activeTab === 'info' && (
          <form onSubmit={handleSubmit(onSaveProfile)} className="glass-card p-8 space-y-5">
            <div>
              <label className="text-sm text-gray-300 block mb-2">{t('profile.name')}</label>
              <input {...register('name', { required: 'Name is required' })} className="input-modern" placeholder={t('profile.name')} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-2">{t('profile.bio')}</label>
              <textarea {...register('bio')} rows={3} className="input-modern resize-none" placeholder={t('profile.bio')} />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-2">{t('profile.location')}</label>
              <input {...register('location')} className="input-modern" placeholder={t('profile.location')} />
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm font-semibold text-gray-300 mb-4">{t('profile.socialLinks')}</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{t('profile.facebook')}</label>
                  <input {...register('social.facebook')} className="input-modern" placeholder="https://facebook.com/username" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{t('profile.instagram')}</label>
                  <input {...register('social.instagram')} className="input-modern" placeholder="https://instagram.com/username" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{t('profile.whatsapp')}</label>
                  <input {...register('social.whatsapp')} className="input-modern" placeholder="https://wa.me/1234567890" />
                </div>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-gradient w-full py-3 rounded-full font-semibold">
              {isSubmitting ? t('common.saving') : t('profile.save')}
            </button>
          </form>
        )}

        {/* ট্যাব: পাসওয়ার্ড */}
        {activeTab === 'password' && (
          <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="glass-card p-8 space-y-5">
            <div>
              <label className="text-sm text-gray-300 block mb-2">{t('profile.currentPassword')}</label>
              <input type="password" {...pwForm.register('currentPassword', { required: true })} className="input-modern" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-2">{t('profile.newPassword')}</label>
              <input type="password" {...pwForm.register('newPassword', { required: true })} className="input-modern" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-2">{t('profile.confirmPassword')}</label>
              <input type="password" {...pwForm.register('confirmPassword', { required: true })} className="input-modern" />
            </div>
            <button type="submit" className="btn-gradient w-full py-3 rounded-full font-semibold">
              {t('profile.updatePassword')}
            </button>
          </form>
        )}

        {/* ট্যাব: টুর্নামেন্ট */}
        {activeTab === 'tournaments' && (
          <div className="glass-card p-8">
            {profile?.registeredTournaments?.length === 0 ? (
              <div className="text-center py-8">
                <Trophy size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">{t('profile.noTournaments')}</p>
                <Link to="/tournaments" className="text-cyan-400 hover:underline text-sm mt-2 inline-block">
                  {t('dashboard.browseTournaments')}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profile?.registeredTournaments?.map(tournament => (
                  <div key={tournament._id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition">
                    <div>
                      <p className="font-semibold text-white">{tournament.title}</p>
                      <p className="text-xs text-gray-400">{tournament.game} • {new Date(tournament.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tournament.status === 'completed' ? 'bg-green-900 text-green-400' :
                      tournament.status === 'ongoing' ? 'bg-yellow-900 text-yellow-400' :
                      'bg-cyan-900 text-cyan-400'
                    }`}>
                      {tournament.status || 'Upcoming'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}