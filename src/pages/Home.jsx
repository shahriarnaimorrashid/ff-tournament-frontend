// src/pages/Home.jsx – EXTREME PREMIUM GAMING HOMEPAGE 2026
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Shield, Sparkles, ArrowRight, Swords, Gamepad2, Zap, Flame, Star } from 'lucide-react';
import axiosInstance from '../utils/axios';

const ThunderBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(at_50%_30%,rgba(0,255,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      
      {/* Enhanced Lightning System */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-transparent via-cyan-300 to-transparent rounded-full shadow-[0_0_40px_12px_rgba(0,255,255,0.9)]"
          style={{
            height: `${60 + Math.random() * 80}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${5 + Math.random() * 70}%`,
            rotate: `${-25 + Math.random() * 50}deg`,
          }}
          initial={{ opacity: 0, scaleY: 0.2 }}
          animate={{
            opacity: [0, 0.9, 0],
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.15 + Math.random() * 0.2,
            repeat: Infinity,
            repeatDelay: 1.5 + Math.random() * 4,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.07]" 
           style={{ 
             backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
             backgroundSize: '60px 60px' 
           }} 
      />
    </div>
  );
};

const FloatingParticles = () => (
  <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -180, 0],
          x: [0, Math.random() * 40 - 20],
          opacity: [0, 0.7, 0],
          scale: [0.6, 1.2, 0.6],
        }}
        transition={{
          duration: 6 + Math.random() * 8,
          repeat: Infinity,
          delay: i * 0.4,
        }}
      />
    ))}
  </div>
);

const Counter = ({ end, label, Icon, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      
      let current = 0;
      const increment = Math.ceil(end / 45);
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 38);

      observer.disconnect();
    }, { threshold: 0.4 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="text-center group"
    >
      <div className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-3 tabular-nums drop-shadow-[0_0_25px_rgba(0,255,255,0.6)]">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="flex justify-center mb-2">
        <Icon className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
      </div>
      <p className="text-gray-400 uppercase text-xs tracking-[3px] font-medium">{label}</p>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.07, duration: 0.5 }}
    whileHover={{ 
      y: -12, 
      scale: 1.02,
      transition: { duration: 0.25 }
    }}
    className="glass-card p-8 relative overflow-hidden group h-full border border-white/10 hover:border-cyan-400/30 rounded-3xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-8 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/50 transition-all">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed flex-1">{desc}</p>
      
      <div className="mt-8 pt-6 border-t border-white/10 text-cyan-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
        Learn more <ArrowRight size={18} className="group-hover:translate-x-1" />
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent));
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 60 : 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  
  const springY = useSpring(heroY, { stiffness: 55, damping: 18 });
  const springOpacity = useSpring(heroOpacity, { stiffness: 80, damping: 25 });

  // Fetch settings
  useEffect(() => {
    axiosInstance.get('/admin/public-settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  const features = useMemo(() => [
    { 
      icon: <Trophy className="w-9 h-9 text-yellow-400" />, 
      title: "Elite Tournaments", 
      desc: "Compete in high-stakes events with massive prize pools and global recognition." 
    },
    { 
      icon: <Users className="w-9 h-9 text-purple-400" />, 
      title: "Thriving Community", 
      desc: "Join 12,000+ elite gamers from around the world in the ultimate battle arena." 
    },
    { 
      icon: <Shield className="w-9 h-9 text-emerald-400" />, 
      title: "Bulletproof Security", 
      desc: "Instant payouts via secure escrow. Your funds and data are always protected." 
    },
    { 
      icon: <Sparkles className="w-9 h-9 text-pink-400" />, 
      title: "Daily Rewards", 
      desc: "Earn coins, skins, and exclusive NFTs just by playing and winning." 
    },
  ], []);

  const heroTitle = settings?.heroTitle || t('home.title') || "E-SPORTS ARENA";
  const heroSubtitle = settings?.heroSubtitle || t('home.subtitle') || "Where Legends Are Forged";
  const siteName = settings?.siteName || "Thunder Arena";

  return (
    <div className="min-h-screen bg-[#0a0b12] text-white overflow-hidden">
      {/* HERO - CINEMATIC */}
      <motion.section
        ref={heroRef}
        style={{ y: springY, opacity: springOpacity, scale: heroScale }}
        className="relative min-h-[100dvh] flex items-center justify-center isolate"
      >
        <ThunderBackground />
        <FloatingParticles />

        {/* Dynamic Glow Orb */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.85, 0.6]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-20 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-cyan-400/30 backdrop-blur-2xl"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="uppercase text-xs tracking-[3px] font-mono text-cyan-400">LIVE SEASON 7</span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-[clamp(2.8rem,8vw,7.2rem)] font-black uppercase tracking-[-4px] leading-[0.92] mb-6">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              {heroTitle}
            </span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-300 font-light tracking-wide mb-12"
          >
            {heroSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/tournaments">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-lg flex items-center gap-3 overflow-hidden shadow-2xl shadow-cyan-500/40"
              >
                <span className="relative z-10 flex items-center gap-3">
                  ENTER THE ARENA <Trophy className="group-hover:rotate-12 transition" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-10 py-5 rounded-2xl border-2 border-white/30 hover:border-white/70 backdrop-blur-xl font-semibold text-lg transition-all duration-300"
              >
                JOIN FREE
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Scroll Prompt */}
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500">SCROLL TO BEGIN</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
        </motion.div>
      </motion.section>

      {/* FEATURES */}
      <section className="py-28 relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-cyan-400 mb-4">
            <Flame className="w-5 h-5" /> <span className="uppercase tracking-[4px] text-sm font-mono">NEXT LEVEL EXPERIENCE</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">WHY CHAMPIONS CHOOSE ARENA</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <FeatureCard key={idx} index={idx} {...feat} />
          ))}
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="py-24 border-t border-b border-white/5 bg-black/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center">
            <Counter end={87} label="ACTIVE TOURNAMENTS" Icon={Trophy} />
            <Counter end={14200} label="PLAYERS ONLINE" Icon={Users} suffix="+" />
            <Counter end={1240} label="PRIZE POOL THIS WEEK" Icon={Star} suffix="K" />
            <Counter end={99.4} label="PLAYER SATISFACTION" Icon={Shield} suffix="%" />
          </div>
        </div>
      </section>

      {/* HOT DROPS / LIVE EVENTS */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl font-black tracking-tighter">HOT DROPS RIGHT NOW</h2>
            <p className="text-gray-400 mt-2">Massive prizes • Join instantly</p>
          </div>
          <Link to="/tournaments" className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-white transition">
            VIEW ALL <ArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400/50 group"
            >
              <div className="h-60 bg-gradient-to-br from-purple-900/60 via-cyan-900/40 to-black relative">
                <div className="absolute top-6 left-6 px-4 py-1 bg-red-500/90 text-xs font-bold rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" /> LIVE
                </div>
                <div className="absolute bottom-6 right-6 text-right">
                  <div className="text-4xl font-black text-white/90">৳{(25000 + i * 15000).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">PRIZE POOL</div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="font-bold text-2xl mb-1">LEGENDARY CLASH #{i}</div>
                <div className="text-emerald-400 text-sm mb-6">24 Players • Solo • BO3</div>
                
                <Link to="/tournaments" className="block w-full py-4 text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400 rounded-2xl font-semibold transition-all">
                  JOIN MATCH NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="py-28 bg-gradient-to-b from-transparent via-cyan-950/30 to-transparent text-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto px-6"
        >
          <Star className="mx-auto mb-6 text-yellow-400 w-12 h-12" />
          <h2 className="text-5xl font-black tracking-tight mb-6">Ready to become a Legend?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of players competing for glory and massive rewards.</p>
          
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.08 }}
              className="px-14 py-6 text-xl font-bold rounded-3xl bg-white text-black hover:bg-cyan-400 transition-all shadow-2xl"
            >
              CREATE ACCOUNT — IT'S FREE
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* FOOTER */}
      {settings?.aboutUsText && (
        <footer className="border-t border-white/10 pt-20 pb-12 bg-black/70">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Gamepad2 className="w-9 h-9 text-cyan-400" />
                <span className="font-black text-3xl tracking-tighter">{siteName}</span>
              </div>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">{settings.aboutUsText}</p>
            </div>

            {/* Other footer columns remain similar but with premium styling */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">PLATFORM</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/tournaments" className="hover:text-cyan-400 transition">Tournaments</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition">My Dashboard</Link></li>
                <li><Link to="/wallet" className="hover:text-cyan-400 transition">Wallet</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">LEGAL</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Responsible Gaming</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">CONNECT</h4>
              <div className="flex gap-4">
                {['discord', 'twitch', 'youtube', 'twitter'].map(social => (
                  <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400 flex items-center justify-center transition-all">
                    <i className={`fab fa-${social} text-2xl`}></i>
                  </a>
                ))}
              </div>
              <p className="mt-10 text-xs text-gray-500">© 2026 {siteName}. Crafted for Champions.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
