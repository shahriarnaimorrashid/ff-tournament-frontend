// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, Users, Shield, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

export default function Home() {
  const { t } = useTranslation();
  const [aboutText, setAboutText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/public-settings')
      .then(res => {
        setAboutText(res.data.aboutUsText || '');
      })
      .catch(err => console.error('Failed to load site settings', err))
      .finally(() => setLoading(false));
  }, []);

  const features = [
    { icon: <Trophy className="w-6 h-6 text-cyan-400" />, titleKey: 'Pro Tournaments', descKey: 'Join competitive tournaments with real prizes' },
    { icon: <Users className="w-6 h-6 text-purple-400" />, titleKey: '10K+ Players', descKey: 'Join a growing community of gamers' },
    { icon: <Shield className="w-6 h-6 text-green-400" />, titleKey: 'Secure Escrow', descKey: 'Safe transactions with escrow protection' },
    { icon: <Sparkles className="w-6 h-6 text-pink-400" />, titleKey: 'Daily Rewards', descKey: 'Earn coins and exclusive rewards' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-black">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 text-center z-10 animate-fade-up">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
              <span className="text-gradient-primary">{t('home.title')}</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-6">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/tournaments">
                <button className="btn-gradient px-8 py-3 rounded-full text-white font-semibold flex items-center gap-2">
                  <Trophy size={20} /> {t('home.viewTournaments')}
                </button>
              </Link>
              <Link to="/register">
                <button className="border border-white/20 hover:border-cyan-500 px-6 py-2 rounded-full text-white font-semibold transition text-sm">
                  {t('navbar.register')}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-gradient-primary">E-Sports Arena</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 text-center"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.titleKey}</h3>
              <p className="text-gray-400 text-sm">{feature.descKey}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl md:text-4xl font-bold text-cyan-400">50+</div><div className="text-gray-500 text-sm mt-1">Tournaments</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-purple-400">10K+</div><div className="text-gray-500 text-sm mt-1">Active Players</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-pink-400">৳500K</div><div className="text-gray-500 text-sm mt-1">Prize Distributed</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-green-400">99%</div><div className="text-gray-500 text-sm mt-1">Satisfaction</div></div>
          </div>
        </div>
      </section>

      {/* About Us Footer */}
      {aboutText && (
        <footer className="border-t border-white/10 pt-16 pb-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className="text-white font-bold text-lg mb-3">E-Sports Arena</h3>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {aboutText}
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/tournaments" className="hover:text-cyan-400 transition">Tournaments</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
                <li><Link to="/profile" className="hover:text-cyan-400 transition">Profile</Link></li>
                <li><Link to="/wallet" className="hover:text-cyan-400 transition">Wallet</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-3 text-gray-400">
                <a href="#" className="hover:text-cyan-400 transition"><i className="fab fa-discord text-xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition"><i className="fab fa-youtube text-xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition"><i className="fab fa-twitter text-xl"></i></a>
              </div>
              <p className="text-gray-500 text-xs mt-4">© 2026 E-Sports Arena. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
