// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/tournaments');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post('/auth/google', { idToken });
      localStorage.setItem('token', res.data.token);
      // ইউজার স্টেট আপডেট করতে AuthContext-এর লগইন ফাংশন কল করুন অথবা পেজ রিলোড
      window.location.href = '/tournaments';
    } catch (err) {
      console.error(err);
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <LogIn size={40} className="mx-auto text-cyan-400 mb-3" />
          <h2 className="text-3xl font-bold text-white">{t('auth.loginTitle')}</h2>
          <p className="text-gray-400 mt-2">{t('auth.loginSubtitle')}</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 block mb-2">{t('auth.email')}</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" className="input-modern pl-10" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">{t('auth.password')}</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" className="input-modern pl-10" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-gradient w-full py-3 rounded-full text-white font-semibold transition disabled:opacity-50">
            {loading ? 'Signing in...' : t('auth.loginButton')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-transparent text-gray-400">Or continue with</span></div>
        </div>

        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border border-white/20 rounded-full py-2.5 text-white hover:bg-white/10 transition">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" loading="lazy" className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="text-center text-gray-400 mt-6">
          {t('auth.noAccount')} <Link to="/register" className="text-cyan-400 hover:underline">{t('auth.registerTitle')}</Link>
        </p>
      </motion.div>
    </div>
  );
}