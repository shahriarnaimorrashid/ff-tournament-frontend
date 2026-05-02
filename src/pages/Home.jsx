// src/pages/Home.jsx – ULTIMATE REFINED & OPTIMIZED GAMING HOMEPAGE
import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Trophy, Users, Shield, Sparkles, ArrowRight, Gamepad2, Flame, Star } from 'lucide-react';
import axiosInstance from '../utils/axios';

// ⚡ হাই-পারফরমেন্স থান্ডার স্ট্রম (মোবাইলের জন্য স্বয়ংক্রিয়ভাবে হালকা)
const ThunderBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(at_50%_30%,rgba(0,255,255,0.08),transparent_50%)]" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 bg-gradient-to-b from-transparent via-cyan-300 to-transparent rounded-full shadow-[0_0_30px_8px_rgba(0,255,255,0.7)]"
        style={{
          height: `${60 + Math.random() * 80}px`,
          left: `${10 + Math.random() * 80}%`,
          top: `${5 + Math.random() * 70}%`,
          rotate: `${-25 + Math.random() * 50}deg`,
        }}
        initial={{ opacity: 0, scaleY: 0.2 }}
        animate={{
          opacity: [0, 0.85, 0],
          scaleY: [0.3, 1, 0.3],
          x: [0, Math.random() * 20 - 10, 0],
        }}
        transition={{
          duration: 0.12 + Math.random() * 0.15,
          repeat: Infinity,
          repeatDelay: 2 + Math.random() * 5,
          delay: i * 0.25,
        }}
      />
    ))}
    <div className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}
    />
  </div>
);

// মোবাইলে কম পার্টিকেল, সবার জন্য স্মুথ
const FloatingParticles = ({ isMobile }) => (
  <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
    {[...Array(isMobile ? 6 : 10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-cyan-400/70 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -120, 0],
          x: [0, Math.random() * 30 - 15],
          opacity: [0, 0.6, 0],
          scale: [0.7, 1.1, 0.7],
        }}
        transition={{
          duration: 8 + Math.random() * 10,
          repeat: Infinity,
          delay: i * 0.35,
        }}
      />
    ))}
  </div>
);

// RAF-চালিত কাউন্টার (জ্যাঙ্ক-মুক্ত)
const Counter = ({ end, label, Icon, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 1800;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(progress * end);
            setCount(currentValue);
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(updateCounter);
          observer.unobserve(node);
        }
      },
      { threshold: 0.25 }
    );
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center will-change-transform"
    >
      <div className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 tabular-nums drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
        {count.toLocaleString()}{suffix}
      </div>
      <Icon className="w-6 h-6 md:w-7 md:h-7 mx-auto mb-1 text-cyan-400" />
      <p className="text-gray-400 uppercase tracking-[2px] text-xs md:text-sm font-medium">{label}</p>
    </motion.div>
  );
};

// ফিচার কার্ড (মিনিমাল রি-রেন্ডার)
const FeatureCard = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
    className="glass-card p-6 md:p-8 relative overflow-hidden group h-full border border-white/10 hover:border-cyan-400/30 rounded-3xl will-change-transform"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-6 w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/40 transition-all">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed flex-1">{desc}</p>
      <div className="mt-6 pt-5 border-t border-white/10 text-cyan-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
        <span>Learn more</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.div>
);

// ────────────────────────────────────────
// MAIN HOME COMPONENT
// ────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent));
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 30 : 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const springY = useSpring(heroY, { stiffness: 45, damping: 18 });
  const springOpacity = useSpring(heroOpacity, { stiffness: 70, damping: 22 });

  useEffect(() => {
    axiosInstance.get('/admin/public-settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  const features = useMemo(() => [
    { icon: <Trophy className="w-7 h-7 md:w-8 md:h-8 text-yellow-400" />, title: "Elite Tournaments", desc: "Compete in high-stakes events with massive prize pools and global recognition." },
    { icon: <Users className="w-7 h-7 md:w-8 md:h-8 text-purple-400" />, title: "Thriving Community", desc: "Join 12,000+ elite gamers from around the world in the ultimate battle arena." },
    { icon: <Shield className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" />, title: "Bulletproof Security", desc: "Instant payouts via secure escrow. Your funds and data are always protected." },
    { icon: <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-pink-400" />, title: "Daily Rewards", desc: "Earn coins, skins, and exclusive NFTs just by playing and winning." },
  ], []);

  const heroTitle = settings?.heroTitle || t('home.title') || "E-SPORTS ARENA";
  const heroSubtitle = settings?.heroSubtitle || t('home.subtitle') || "Where Legends Are Forged";
  const siteName = settings?.siteName || "Thunder Arena";

  return (
    <div className="min-h-screen bg-[#0a0b12] text-white overflow-x-hidden">
      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ y: springY, opacity: springOpacity, scale: heroScale }}
        className="relative min-h-[100dvh] flex items-center justify-center isolate will-change-transform"
      >
        <ThunderBackground />
        <FloatingParticles isMobile={isMobile} />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] md:w-[620px] h-[500px] md:h-[620px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-7xl mx-auto px-5 text-center relative z-20 pt-16 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-cyan-400/30 backdrop-blur-xl"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="uppercase text-[10px] md:text-xs tracking-[2px] font-mono text-cyan-400">LIVE SEASON 7</span>
          </motion.div>

          {/* TITLE — একবারই আসবে, ডুপ্লিকেট নেই */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black uppercase tracking-[-2px] leading-[0.92] mb-5 md:mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              {heroTitle}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl text-gray-300 font-light tracking-wide mb-10 md:mb-12"
          >
            {heroSubtitle}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center">
            <Link to="/tournaments">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-8 md:px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-base md:text-lg flex items-center gap-2 md:gap-3 overflow-hidden shadow-2xl shadow-cyan-500/30"
              >
                <span className="relative z-10 flex items-center gap-2 md:gap-3">
                  ENTER THE ARENA <Trophy className="group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 md:px-10 py-4 rounded-2xl border-2 border-white/30 hover:border-white/70 backdrop-blur-xl font-semibold text-base md:text-lg transition-all duration-300"
              >
                JOIN FREE
              </motion.button>
            </Link>
          </div>
        </div>

        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
        >
          <span className="text-[10px] uppercase tracking-[3px] text-gray-500">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ── FEATURES ── */}
      <section className="py-24 md:py-28 relative max-w-7xl mx-auto px-5 md:px-6">
        <div className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 text-cyan-400 mb-4">
            <Flame className="w-4 h-4 md:w-5 md:h-5" />
            <span className="uppercase tracking-[3px] text-xs md:text-sm font-mono">NEXT LEVEL EXPERIENCE</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">WHY CHAMPIONS CHOOSE ARENA</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feat, idx) => (
            <FeatureCard key={idx} index={idx} {...feat} />
          ))}
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className="py-20 md:py-24 border-t border-b border-white/5 bg-black/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <Counter end={87} label="ACTIVE TOURNAMENTS" Icon={Trophy} />
            <Counter end={14200} label="PLAYERS ONLINE" Icon={Users} suffix="+" />
            <Counter end={1240} label="PRIZE POOL THIS WEEK" Icon={Star} suffix="K" />
            <Counter end={99.4} label="PLAYER SATISFACTION" Icon={Shield} suffix="%" />
          </div>
        </div>
      </section>

      {/* ── HOT DROPS ── */}
      <section className="py-24 md:py-28 max-w-7xl mx-auto px-5 md:px-6">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">HOT DROPS RIGHT NOW</h2>
            <p className="text-gray-400 mt-2 text-sm md:text-base">Massive prizes • Join instantly</p>
          </div>
          <Link to="/tournaments" className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-white transition">
            VIEW ALL <ArrowRight />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400/50 group"
            >
              <div className="h-52 md:h-60 bg-gradient-to-br from-purple-900/60 via-cyan-900/40 to-black relative">
                <div className="absolute top-5 left-5 px-3 py-1 bg-red-500/90 text-xs font-bold rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> LIVE
                </div>
                <div className="absolute bottom-5 right-5 text-right">
                  <div className="text-3xl md:text-4xl font-black text-white/90">৳{(25000 + i * 15000).toLocaleString()}</div>
                  <div className="text-[10px] md:text-xs text-gray-400">PRIZE POOL</div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="font-bold text-xl md:text-2xl mb-1">LEGENDARY CLASH #{i}</div>
                <div className="text-emerald-400 text-xs md:text-sm mb-5 md:mb-6">24 Players • Solo • BO3</div>
                <Link to="/tournaments" className="block w-full py-3.5 text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400 rounded-2xl font-semibold text-sm md:text-base transition-all">
                  JOIN MATCH NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 md:py-28 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto px-5 md:px-6"
        >
          <Star className="mx-auto mb-5 text-yellow-400 w-10 h-10 md:w-12 md:h-12" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5 md:mb-6">Ready to become a Legend?</h2>
          <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10">Join thousands of players competing for glory and massive rewards.</p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.06 }}
              className="px-12 md:px-14 py-5 md:py-6 text-lg md:text-xl font-bold rounded-3xl bg-white text-black hover:bg-cyan-400 transition-all shadow-2xl"
            >
              CREATE ACCOUNT — IT'S FREE
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      {settings?.aboutUsText && (
        <footer className="border-t border-white/10 pt-16 md:pt-20 pb-10 md:pb-12 bg-black/70">
          <div className="max-w-7xl mx-auto px-5 md:px-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 md:gap-3 mb-5">
                <Gamepad2 className="w-8 h-8 md:w-9 md:h-9 text-cyan-400" />
                <span className="font-black text-2xl md:text-3xl tracking-tighter">{siteName}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{settings.aboutUsText}</p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-5 text-white/80">Platform</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/tournaments" className="hover:text-cyan-400 transition">Tournaments</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
                <li><Link to="/profile" className="hover:text-cyan-400 transition">Profile</Link></li>
                <li><Link to="/wallet" className="hover:text-cyan-400 transition">Wallet</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-5 text-white/80">Legal</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Responsible Gaming</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-5 text-white/80">Connect</h4>
              <div className="flex gap-3 md:gap-4">
                {['discord', 'twitch', 'youtube', 'twitter'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400 flex items-center justify-center transition-all">
                    <i className={`fab fa-${social} text-lg md:text-xl`}></i>
                  </a>
                ))}
              </div>
              <p className="mt-8 text-xs text-gray-500">© 2026 {siteName}. Crafted for Champions.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
