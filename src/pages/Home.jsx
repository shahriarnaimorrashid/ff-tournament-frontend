// src/pages/Home.jsx
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, Users, Shield, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import axiosInstance from '../utils/axios';

// ===================== Animated Counter =====================
const Counter = ({ end, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = Math.ceil(end / 100);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
          }, duration / (end / increment));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">{count}+</div>
      <Icon className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
      <p className="text-gray-400 uppercase tracking-wider text-xs">{label}</p>
    </motion.div>
  );
};

// ===================== Feature Card =====================
const FeatureCard = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="glass-card p-6 text-center relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  </motion.div>
);

// ===================== Main Home Component =====================
export default function Home() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    axiosInstance.get('/admin/public-settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  const features = [
    { icon: <Trophy className="w-8 h-8 text-cyan-400" />, title: 'Pro Tournaments', desc: 'Join competitive tournaments with real prizes' },
    { icon: <Users className="w-8 h-8 text-purple-400" />, title: '10K+ Players', desc: 'Join a growing community of gamers' },
    { icon: <Shield className="w-8 h-8 text-green-400" />, title: 'Secure Escrow', desc: 'Safe transactions with escrow protection' },
    { icon: <Sparkles className="w-8 h-8 text-pink-400" />, title: 'Daily Rewards', desc: 'Earn coins and exclusive rewards' },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* ==================== Hero Section ==================== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold leading-none tracking-tighter">
              <span className="text-gradient-primary">
                {settings?.heroTitle || t('home.title')}
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mt-8 font-light leading-relaxed"
            >
              {settings?.heroSubtitle || t('home.subtitle')}
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-5 mt-12"
          >
            <Link to="/tournaments">
              <button className="btn-gradient px-10 py-4 rounded-full text-white font-bold text-lg flex items-center gap-3 group">
                <Trophy size={24} />
                {t('home.viewTournaments')}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </Link>
            <Link to="/register">
              <button className="border border-white/30 hover:border-cyan-500 px-8 py-4 rounded-full text-white font-semibold transition text-lg backdrop-blur-md bg-white/5">
                {t('navbar.register')}
              </button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="text-gray-400 animate-bounce w-8 h-8" />
          </motion.div>
        </div>
      </motion.section>

      {/* ==================== Features Section ==================== */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Why Choose <span className="text-gradient-primary">{settings?.siteName || 'E-Sports Arena'}</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <FeatureCard key={idx} index={idx} {...feat} title={feat.title} desc={feat.desc} />
          ))}
        </div>
      </section>

      {/* ==================== Live Stats Counter ==================== */}
      <section className="py-20 border-t border-b border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <Counter end={80} label="Tournaments" icon={Trophy} />
            <Counter end={15000} label="Players" icon={Users} />
            <Counter end={500} label="Prize Pool (K)" icon={Shield} />
            <Counter end={99} label="Satisfaction %" icon={Sparkles} />
          </div>
        </div>
      </section>

      {/* ==================== Hot Tournaments ==================== */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="text-gradient-primary">Hot Tournaments</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="glass-card overflow-hidden group"
            >
              <div className="h-48 bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center">
                <Trophy size={48} className="text-yellow-500 opacity-50 group-hover:scale-125 transition-transform" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white text-lg mb-2">Weekend Clash #{idx+1}</h3>
                <p className="text-gray-400 text-sm mb-4">Prize Pool: ৳{10000 + idx*5000}</p>
                <Link to="/tournaments" className="text-cyan-400 hover:underline text-sm font-semibold">View Details →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== About Us Footer ==================== */}
      {settings?.aboutUsText && (
        <footer className="border-t border-white/10 pt-20 pb-10 mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">{settings?.siteName || 'E-Sports Arena'}</h3>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {settings.aboutUsText}
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/tournaments" className="hover:text-cyan-400 transition">Tournaments</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
                <li><Link to="/profile" className="hover:text-cyan-400 transition">Profile</Link></li>
                <li><Link to="/wallet" className="hover:text-cyan-400 transition">Wallet</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3 text-gray-400">
                <a href="#" className="hover:text-cyan-400 transition"><i className="fab fa-discord text-2xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition"><i className="fab fa-youtube text-2xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition"><i className="fab fa-twitter text-2xl"></i></a>
              </div>
              <p className="text-gray-500 text-xs mt-4">© 2026 {settings?.siteName || 'E-Sports Arena'}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
