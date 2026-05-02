// src/pages/Home.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity } from 'framer-motion';
import { Trophy, Users, Shield, Sparkles, ArrowRight, Swords, Gamepad2 } from 'lucide-react';
import axiosInstance from '../utils/axios';

// ===================== 1. Animated Counter =====================
const Counter = ({ end, label, Icon }) => {
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
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
        {count}<span className="text-cyan-400">+</span>
      </div>
      <Icon className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
      <p className="text-gray-400 uppercase tracking-widest text-xs">{label}</p>
    </motion.div>
  );
};

// ===================== 2. Gaming Feature Card =====================
const FeatureCard = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, type: 'spring', stiffness: 120 }}
    whileHover={{ y: -10, scale: 1.03, borderColor: 'rgba(0, 255, 255, 0.5)' }}
    className="glass-card p-6 text-center relative overflow-hidden group cursor-default border border-white/5 hover:border-cyan-500/50 transition-colors duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
    <div className="relative z-10">
      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// ===================== 3. Neon Text Effect =====================
const NeonText = ({ children, className }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="absolute inset-0 blur-sm bg-gradient-to-r from-cyan-400 to-purple-600 opacity-50"></span>
    <span className="relative text-white">{children}</span>
  </span>
);

// ===================== 4. Main Home Component =====================
export default function Home() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);
  const x = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 100, damping: 30 });
  const y = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), { stiffness: 100, damping: 30 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      const xPos = (e.clientX - rect.left) / rect.width;
      const yPos = (e.clientY - rect.top) / rect.height;
      mouseX.set(xPos);
      mouseY.set(yPos);
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    axiosInstance.get('/admin/public-settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  const features = [
    { icon: <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />, title: 'Pro Tournaments', desc: 'Join competitive tournaments with real prizes' },
    { icon: <Users className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />, title: '10K+ Players', desc: 'Join a growing community of gamers' },
    { icon: <Shield className="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />, title: 'Secure Escrow', desc: 'Safe transactions with escrow protection' },
    { icon: <Sparkles className="w-8 h-8 text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]" />, title: 'Daily Rewards', desc: 'Earn coins and exclusive rewards' },
  ];

  return (
    <div className="min-h-screen">
      {/* ==================== Hero Section ==================== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        onMouseMove={handleMouseMove}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden select-none"
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-[#050508] z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-transparent to-black/80" />
          <motion.div
            style={{ x, y }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 blur-3xl rounded-full opacity-50"
          />
        </div>

        {/* Gaming Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Floating Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [1, 2, 1] }}
              transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center z-20">
          {/* Gaming Logo / Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-8 inline-block p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
          >
            <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-6">
              {/* Animated Characters */}
              {'E-SPORTS'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 150 }}
                  className="inline-block text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <br />
              <span className="relative">
                <span className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-600 blur-lg opacity-70"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">
                  {settings?.siteName || 'TOURNAMENT ARENA'}
                </span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-lg md:text-2xl max-w-3xl mx-auto mt-6 text-gray-300 font-light tracking-wide flex items-center justify-center gap-2"
            >
              <Swords className="w-5 h-5 text-cyan-400" />
              {settings?.heroSubtitle || t('home.subtitle')}
              <Swords className="w-5 h-5 text-purple-400" />
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-gradient px-10 py-4 rounded-full text-white font-black text-lg flex items-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-12 group-hover:translate-x-[200%] transition-transform duration-500"></div>
              <Trophy size={24} className="relative z-10" />
              <span className="relative z-10">{t('home.viewTournaments')}</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </motion.button>
            
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, borderColor: 'rgba(0, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/20 hover:border-cyan-500 px-8 py-4 rounded-full text-white font-semibold transition backdrop-blur-md bg-white/5 text-lg"
              >
                {t('navbar.register')}
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center p-1">
            <motion.div className="w-1 h-2 bg-cyan-400 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ==================== Features Section ==================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-center mb-16 uppercase tracking-tight"
        >
          WHY CHOOSE <span className="text-gradient-primary">ARENA</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <FeatureCard key={idx} index={idx} {...feat} title={feat.title} desc={feat.desc} />
          ))}
        </div>
      </section>

      {/* ==================== Live Stats Counter ==================== */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <Counter end={80} label="Tournaments" Icon={Trophy} />
            <Counter end={12500} label="Players" Icon={Users} />
            <Counter end={500} label="Prize Pool (K)" Icon={Shield} />
            <Counter end={99} label="Satisfaction %" Icon={Sparkles} />
          </div>
        </div>
      </section>

      {/* ==================== Hot Tournaments ==================== */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-center mb-12 uppercase tracking-tight"
        >
          <span className="text-gradient-primary">HOT DROPS</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card overflow-hidden group border border-white/5 hover:border-cyan-500/50 transition-colors"
            >
              <div className="h-48 bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
                <Trophy size={48} className="text-yellow-500 opacity-80 group-hover:scale-125 transition-transform drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">LIVE</span>
                  <span>24 Players</span>
                </div>
                <h3 className="font-black text-white text-xl mb-2">Weekend Clash #{idx+1}</h3>
                <p className="text-gray-400 text-sm mb-5">Prize Pool: ৳{10000 + idx*5000}</p>
                <Link to="/tournaments" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition group/link">
                  Join Now <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== About Us Footer ==================== */}
      {settings?.aboutUsText && (
        <footer className="border-t border-white/10 pt-20 pb-10 mt-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 className="w-8 h-8 text-cyan-400" />
                <h3 className="text-white font-black text-xl">{settings?.siteName || 'E-Sports Arena'}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {settings.aboutUsText}
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/tournaments" className="hover:text-cyan-400 transition flex items-center gap-1"><span className="w-1 h-1 bg-cyan-400 rounded-full inline-block" /> Tournaments</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition flex items-center gap-1"><span className="w-1 h-1 bg-cyan-400 rounded-full inline-block" /> Dashboard</Link></li>
                <li><Link to="/profile" className="hover:text-cyan-400 transition flex items-center gap-1"><span className="w-1 h-1 bg-cyan-400 rounded-full inline-block" /> Profile</Link></li>
                <li><Link to="/wallet" className="hover:text-cyan-400 transition flex items-center gap-1"><span className="w-1 h-1 bg-cyan-400 rounded-full inline-block" /> Wallet</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Connect</h3>
              <div className="flex gap-4 text-gray-400 mb-6">
                <a href="#" className="hover:text-cyan-400 transition p-2 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/30"><i className="fab fa-discord text-xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition p-2 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/30"><i className="fab fa-youtube text-xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition p-2 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/30"><i className="fab fa-twitter text-xl"></i></a>
              </div>
              <p className="text-gray-600 text-xs">© 2026 {settings?.siteName || 'E-Sports Arena'}.<br />All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
