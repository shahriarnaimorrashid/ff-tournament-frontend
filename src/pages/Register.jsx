// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/tournaments');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post('/auth/google', { idToken });
      localStorage.setItem('token', res.data.token);
      toast.success('Successfully signed up with Google!');
      navigate('/tournaments');
    } catch (err) {
      console.error(err);
      toast.error('Google sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md mx-4 sm:mx-auto p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <UserPlus size={36} className="mx-auto text-cyan-400 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('auth.registerTitle')}</h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">{t('auth.registerSubtitle')}</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center mb-5">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">{t('auth.name')}</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" className="input-modern pl-10 py-2.5 text-sm" placeholder="Enter your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">{t('auth.email')}</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" className="input-modern pl-10 py-2.5 text-sm" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" className="input-modern pl-10 py-2.5 text-sm" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-gradient w-full py-2.5 rounded-full text-white font-semibold transition disabled:opacity-50 text-sm sm:text-base">
            {loading ? 'Creating account...' : t('auth.registerButton')}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-transparent text-gray-400">Or sign up with</span></div>
        </div>

        <button onClick={handleGoogleSignUp} className="w-full flex items-center justify-center gap-3 border border-white/20 rounded-full py-2.5 text-white hover:bg-white/10 transition text-sm sm:text-base">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" loading="lazy" className="w-5 h-5" />
          Sign up with Google
        </button>

        <p className="text-center text-gray-400 text-sm sm:text-base mt-6">
          {t('auth.haveAccount')} <Link to="/login" className="text-cyan-400 hover:underline">{t('auth.loginTitle')}</Link>
        </p>
      </motion.div>
    </div>
  );
}