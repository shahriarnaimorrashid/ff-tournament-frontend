// src/pages/Home.jsx – Ultimate Modern Gaming Homepage
import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Trophy, Users, Shield, Sparkles, ArrowRight, Swords, Gamepad2 } from 'lucide-react';
import axiosInstance from '../utils/axios';

// ⚡ থান্ডার স্ট্রম (optimized)
const ThunderBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
    <div className="absolute top-[10%] left-[20%] w-0.5 h-32 bg-cyan-300 rounded-full shadow-[0_0_30px_10px_rgba(0,255,255,0.8)] rotate-12 opacity-0 animate-lightning1" />
    <div className="absolute top-[5%] right-[30%] w-0.5 h-24 bg-cyan-300 rounded-full shadow-[0_0_25px_8px_rgba(0,255,255,0.7)] -rotate-12 opacity-0 animate-lightning2" />
    <div className="absolute bottom-[15%] left-[60%] w-0.5 h-28 bg-blue-300 rounded-full shadow-[0_0_20px_7px_rgba(0,180,255,0.6)] rotate-6 opacity-0 animate-lightning3" />
    <div className="absolute top-[25%] left-[5%] w-0.5 h-16 bg-purple-300 rounded-full shadow-[0_0_15px_5px_rgba(168,85,247,0.5)] rotate-[30deg] opacity-0 animate-lightning1" />
    <div className="absolute bottom-[20%] right-[10%] w-0.5 h-20 bg-cyan-300 rounded-full shadow-[0_0_20px_6px_rgba(0,255,255,0.6)] rotate-[15deg] opacity-0 animate-lightning2" />
  </div>
);

// 🔢 Optimised Counter
const Counter = ({ end, label, Icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let s = 0, steps = 20, inc = Math.ceil(end / steps);
      const t = setInterval(() => { s += inc; if (s >= end) { setCount(end); clearInterval(t); } else setCount(s); }, 1500 / steps);
      observer.disconnect();
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }}
      className="text-center will-change-transform">
      <div className="text-3xl md:text-4xl font-black text-white mb-1 tabular-nums">{count}<span className="text-cyan-400">+</span></div>
      <Icon className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
      <p className="text-gray-400 uppercase tracking-widest text-[10px] md:text-xs">{label}</p>
    </motion.div>
  );
};

// 🎮 Feature Card
const FeatureCard = ({ icon, title, desc, index }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }}
    transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
    whileHover={{ y: -8, borderColor: 'rgba(0,255,255,0.4)', transition: { duration: 0.2 } }}
    className="glass-card p-5 md:p-6 text-center relative overflow-hidden group will-change-transform">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
    <div className="relative z-10">
      <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-base md:text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// ──────────────────────── MAIN HOME PAGE ────────────────────────
export default function Home() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent));
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 40 : 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const heroSpringY = useSpring(heroY, { stiffness: 70, damping: 22, restDelta: 0.5 });

  useEffect(() => {
    axiosInstance.get('/admin/public-settings').then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const features = useMemo(() => [
    { icon: <Trophy className="w-7 h-7 md:w-8 md:h-8 text-yellow-400 drop-shadow-glow" />, title: 'Pro Tournaments', desc: 'Real prizes, real competition' },
    { icon: <Users className="w-7 h-7 md:w-8 md:h-8 text-purple-400 drop-shadow-glow" />, title: '10K+ Players', desc: 'Massive gaming community' },
    { icon: <Shield className="w-7 h-7 md:w-8 md:h-8 text-green-400 drop-shadow-glow" />, title: 'Secure Escrow', desc: 'Safe & trusted transactions' },
    { icon: <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-pink-400 drop-shadow-glow" />, title: 'Daily Rewards', desc: 'Earn coins & exclusive items' },
  ], []);

  const heroTitle = settings?.heroTitle || t('home.title');
  const heroSubtitle = settings?.heroSubtitle || t('home.subtitle');
  const siteName = settings?.siteName || 'E-Sports Arena';

  return (
    <div className="min-h-screen text-white">
      {/* ── HERO ── */}
      <motion.section ref={heroRef} style={{ y: heroSpringY, opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden isolate will-change-transform">

        <ThunderBackground />
        <div className="absolute inset-0 bg-[#03040a] z-0" />
        <div className="absolute inset-0 z-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />

        {/* ⚪ Floating dust */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{ left: `${10 + i * 25}%`, top: `${30 + i * 10}%` }}
              animate={{ y: [0, -50, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, delay: i * 1.5 }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center z-20">
          {/* 🎮 Gamepad icon */}
          <motion.div initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 140, damping: 10 }}
            className="mb-6 inline-flex p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
            <Gamepad2 className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
          </motion.div>

          {/* 🔠 SINGLE TITLE — no more duplicate */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6">
              {/* "E‑SPORTS" part (color shifting) */}
              {'E-SPORTS'.split('').map((char, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 30, rotateX: -70 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + i * 0.04, type: 'spring', stiffness: 120, damping: 10 }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-[length:200%_200%] bg-left"
                  style={{ backgroundSize: '200% 200%', animation: 'colorShift 3s infinite alternate' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <br />
              {/* Subtitle / full name */}
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-600 blur-lg opacity-50 animate-pulse" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  {heroTitle}
                </span>
              </span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="text-base md:text-xl max-w-2xl mx-auto mt-6 text-gray-300 font-light flex items-center justify-center gap-2">
              <Swords className="w-5 h-5 text-cyan-400" />
              {heroSubtitle}
              <Swords className="w-5 h-5 text-purple-400" />
            </motion.p>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-10">
            <Link to="/tournaments">
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(0,255,255,0.5)' }} whileTap={{ scale: 0.96 }}
                className="btn-gradient px-8 py-3.5 rounded-full text-white font-bold text-base md:text-lg flex items-center gap-2 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2"><Trophy size={20} />{t('home.viewTournaments')}<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.04, borderColor: 'rgba(0,255,255,0.6)' }} whileTap={{ scale: 0.96 }}
                className="border-2 border-white/20 hover:border-cyan-500 px-8 py-3.5 rounded-full text-white font-semibold transition backdrop-blur-md bg-white/5 text-base md:text-lg">
                {t('navbar.register')}
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-600 flex justify-center p-1">
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-1 h-2 bg-cyan-400 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* FEATURES / STATS / HOT DROPS / FOOTER — unchanged from last working version */}
      {/* ── FEATURES ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 relative">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          className="text-3xl md:text-5xl font-black text-center mb-14 uppercase tracking-tight">
          <span className="text-white">WHY </span><span className="text-gradient-primary">ARENA</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feat, idx) => <FeatureCard key={idx} index={idx} {...feat} />)}
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] via-purple-500/[0.03] to-pink-500/[0.03]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            <Counter end={80} label="Tournaments" Icon={Trophy} />
            <Counter end={12500} label="Players" Icon={Users} />
            <Counter end={500} label="Prize Pool (K)" Icon={Shield} />
            <Counter end={99} label="Satisfaction %" Icon={Sparkles} />
          </div>
        </div>
      </section>

      {/* ── HOT DROPS ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          className="text-3xl md:text-5xl font-black text-center mb-12 uppercase tracking-tight">
          <span className="text-gradient-primary">HOT DROPS</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map((_, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.1 }} whileHover={{ y: -8 }}
              className="glass-card overflow-hidden group border border-white/5 hover:border-cyan-500/40 transition-colors duration-300">
              <div className="h-44 bg-gradient-to-br from-cyan-900/40 to-purple-900/40 relative flex items-center justify-center">
                <Trophy size={40} className="text-yellow-500/80 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold animate-pulse">LIVE</span>
                  <span className="text-gray-400">24 Players</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-1">Weekend Clash #{idx+1}</h3>
                <p className="text-gray-400 text-sm mb-5">Prize Pool: ৳{10000 + idx*5000}</p>
                <Link to="/tournaments" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition">
                  Join Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      {settings?.aboutUsText && (
        <footer className="border-t border-white/10 pt-16 pb-8 mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-4"><Gamepad2 className="w-7 h-7 text-cyan-400" /><h3 className="text-white font-black text-lg">{siteName}</h3></div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{settings.aboutUsText}</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/tournaments" className="hover:text-cyan-400 transition">Tournaments</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
                <li><Link to="/profile" className="hover:text-cyan-400 transition">Profile</Link></li>
                <li><Link to="/wallet" className="hover:text-cyan-400 transition">Wallet</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Connect</h3>
              <div className="flex gap-4 text-gray-400 mb-6">
                <a href="#" className="hover:text-cyan-400 transition p-2 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/30"><i className="fab fa-discord text-xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition p-2 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/30"><i className="fab fa-youtube text-xl"></i></a>
                <a href="#" className="hover:text-cyan-400 transition p-2 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/30"><i className="fab fa-twitter text-xl"></i></a>
              </div>
              <p className="text-gray-600 text-xs">© 2026 {siteName}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
