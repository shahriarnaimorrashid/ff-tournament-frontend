// src/pages/Home.jsx – সর্বশেষ ভার্সন (Professional Footer + উন্নত অ্যানিমেশন)
import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Trophy, Users, Shield, Sparkles, ArrowRight, Gamepad2, Flame, Star, Clock, Award,
  Play, Pause, Crown, ChevronLeft, ChevronRight, Calendar, Phone, Mail, MapPin, Smartphone
} from 'lucide-react';
import axiosInstance from '../utils/axios';

// ---------------------  Background & Particles  ---------------------
const AdvancedThunderBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-40 bg-gradient-to-b from-transparent via-cyan-300 to-transparent"
        style={{ left: `${15 + i * 12}%`, top: `${10 + i * 8}%`, rotate: `${-30 + i * 12}deg` }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 2 + i * 0.6 }}
      />
    ))}
  </div>
);

const ParticleSystem = () => (
  <div className="absolute inset-0 z-10 pointer-events-none">
    {[...Array(28)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{ y: [0, -700], opacity: [0, 0.7, 0], scale: [0.6, 1.4, 0.4] }}
        transition={{ duration: 12 + Math.random() * 18, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

// -----------------  UI Components  -----------------
const ScrollIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2 }}
    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-30"
  >
    <span className="text-[10px] tracking-[3px] text-gray-500 mb-3">SCROLL TO BEGIN</span>
    <div className="w-5 h-9 border-2 border-cyan-400/60 rounded-full flex justify-center p-1">
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-2 bg-cyan-400 rounded-full" />
    </div>
  </motion.div>
);

const LiveStatsBar = ({ livePlayers }) => (
  <div className="sticky top-0 z-50 bg-black/90 border-b border-cyan-400/20 py-4">
    <div className="max-w-7xl mx-auto px-6 flex justify-between text-sm font-mono">
      <div className="flex items-center gap-8">
        <span className="text-emerald-400">● LIVE</span>
        <span>{livePlayers.toLocaleString()} GAMERS ONLINE</span>
      </div>
      <div className="text-cyan-400">TOTAL PRIZE PAID: ৳21.4 CRORE+</div>
    </div>
  </div>
);

// ---------------  Counter  ---------------
const Counter = ({ end, label, Icon, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let current = 0;
      const increment = Math.ceil(end / 45);
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) { setCount(end); clearInterval(timer); }
        else setCount(current);
      }, 40);
      observer.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} className="text-center">
      <div className="text-6xl font-black tabular-nums text-white drop-shadow-glow">{count}{suffix}</div>
      <Icon className="mx-auto my-4 text-cyan-400" size={32} />
      <p className="uppercase tracking-widest text-sm text-gray-400">{label}</p>
    </motion.div>
  );
};

// ==================== MAIN HOME COMPONENT ====================
const Home = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const [livePlayers, setLivePlayers] = useState(14280);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // States for various sections
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const testimonials = useMemo(() => [
    { name: "RizGodBD", game: "BGMI", comment: "Thunder Arena is the best! Won 35k last month. Instant payout!" },
    { name: "SadiaReaper", game: "Valorant", comment: "The anti-cheat system actually works. Finally a fair platform." },
    { name: "TahmidX", game: "Free Fire", comment: "Community is awesome. I've made so many friends here!" }
  ], []);

  useEffect(() => { setIsMobile(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)); }, []);
  useEffect(() => {
    const onMouseMove = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePlayers(prev => prev + Math.floor(Math.random() * 12) + 6);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axiosInstance.get('/admin/public-settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 90 : 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroSpringY = useSpring(heroY, { stiffness: 60, damping: 20 });

  const heroTitle = settings?.heroTitle || "THUNDER ARENA";
  const heroSubtitle = settings?.heroSubtitle || "Where Legends Are Born • Bangladesh's Premier Esports Platform";

  const features = useMemo(() => [
    { icon: <Trophy className="w-12 h-12" />, title: "Pro Tournaments", desc: "Weekly & Monthly events with huge prize pools", color: "yellow" },
    { icon: <Users className="w-12 h-12" />, title: "15K+ Community", desc: "Join the fastest growing gaming community", color: "purple" },
    { icon: <Shield className="w-12 h-12" />, title: "Secure & Fair", desc: "Bank-grade security & anti-cheat system", color: "emerald" },
    { icon: <Sparkles className="w-12 h-12" />, title: "Daily Rewards", desc: "Free coins, skins & battle pass rewards", color: "pink" },
  ], []);

  const hotDrops = useMemo(() => [
    { title: "FRIDAY NIGHT BRAWL", prize: "৳95,000", players: "64", game: "BGMI", status: "LIVE" },
    { title: "VALORANT MASTERS", prize: "৳1,45,000", players: "32", game: "Valorant", status: "2H LEFT" },
    { title: "FREE FIRE ROYALE", prize: "৳75,000", players: "50", game: "Free Fire", status: "LIVE" }
  ], []);

  const leaderboard = useMemo(() => [
    { rank: 1, name: "RizGodBD", game: "BGMI", points: "12480", change: "+420" },
    { rank: 2, name: "SadiaReaper", game: "Valorant", points: "11890", change: "+380" },
    { rank: 3, name: "TahmidX", game: "Free Fire", points: "10920", change: "+290" },
    { rank: 4, name: "ProKazi", game: "BGMI", points: "9870", change: "+210" },
    { rank: 5, name: "NinjaBD", game: "Valorant", points: "9340", change: "+180" },
  ], []);

  const faqs = useMemo(() => [
    { q: "How do I participate in tournaments?", a: "Create an account, go to Tournaments section, and click 'Join' on any open event." },
    { q: "When do I receive my prize money?", a: "All prizes are disbursed within 24-72 hours via bKash, Nagad, or Bank Transfer." },
    { q: "Is the platform safe and fair?", a: "Yes. We use advanced anti-cheat systems and have a dedicated moderation team." },
    { q: "Can I play from mobile?", a: "Absolutely. Our platform is fully optimized for both mobile and PC." }
  ], []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#02040b] text-white overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <motion.section
        ref={heroRef}
        style={{ y: heroSpringY, opacity: heroOpacity }}
        className="relative min-h-[100dvh] flex items-center justify-center isolate overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0b1f] to-black z-0" />
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.25), transparent 70%)`
          }}
        />
        <AdvancedThunderBackground />
        <ParticleSystem />

        <div className="relative z-30 max-w-7xl mx-auto px-6 text-center">
          {/* 🔥 TITLE – উন্নত গ্রেডিয়েন্ট গ্লো */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black uppercase tracking-[-2px] leading-[0.92] mb-5 md:mb-6"
          >
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 blur-2xl opacity-60"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 animate-colorShift bg-[length:200%_200%] drop-shadow-[0_0_25px_rgba(0,255,255,0.5)]">
                {heroTitle}
              </span>
            </span>
          </motion.h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-12 font-light">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/tournaments">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center gap-3 shadow-2xl shadow-cyan-500/50"
              >
                ENTER THE ARENA <Trophy className="w-6 h-6" />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-12 py-6 text-xl font-semibold border-2 border-white/40 hover:border-cyan-400 rounded-2xl backdrop-blur-md"
              >
                JOIN FREE
              </motion.button>
            </Link>
          </div>
        </div>
        <ScrollIndicator />
      </motion.section>

      <LiveStatsBar livePlayers={livePlayers} />

      {/* ==================== FEATURES ==================== */}
      <section className="py-28 max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 text-cyan-400 mb-6">
            <Flame className="w-6 h-6" />
            <span className="uppercase tracking-[4px] text-sm font-mono">NEXT LEVEL GAMING</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">WHY CHAMPIONS CHOOSE US</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="glass-card p-10 rounded-3xl border border-white/10 hover:border-cyan-400/40 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative z-10">
                <div className="mb-8 w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-400 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                <p className="text-gray-400 leading-relaxed text-[17px]">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== LIVE STATS COUNTERS ==================== */}
      <section className="py-20 border-t border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <Counter end={87} label="ACTIVE TOURNAMENTS" suffix="" Icon={Trophy} />
            <Counter end={livePlayers} label="PLAYERS ONLINE" suffix="+" Icon={Users} />
            <Counter end={1240} label="PRIZE POOL (K)" suffix="K" Icon={Award} />
            <Counter end={99} label="SATISFACTION" suffix="%" Icon={Star} />
          </div>
        </div>
      </section>

      {/* ==================== HOT DROPS ==================== */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black tracking-tight">HOT DROPS RIGHT NOW</h2>
            <p className="text-gray-400 mt-2">Massive prizes • Join instantly</p>
          </div>
          <Link to="/tournaments" className="text-cyan-400 hover:text-white flex items-center gap-2">
            View All <ArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {hotDrops.map((drop, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/50 group"
            >
              <div className="h-60 bg-gradient-to-br from-red-900/70 to-purple-900/60 relative flex items-center justify-center">
                <div className="absolute top-6 left-6 px-5 py-1 bg-red-600 text-xs font-bold rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" /> {drop.status}
                </div>
                <Trophy size={80} className="text-yellow-400/80 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-8">
                <div className="text-sm text-cyan-400 font-mono mb-1">{drop.game}</div>
                <h3 className="text-2xl font-bold mb-3">{drop.title}</h3>
                <div className="text-emerald-400 text-3xl font-bold mb-6">{drop.prize}</div>
                <Link to="/tournaments" className="block w-full py-4 text-center bg-white/5 hover:bg-cyan-500 hover:text-black font-bold rounded-2xl transition-all">
                  JOIN NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-28 bg-gradient-to-b from-black/60 to-transparent relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 tracking-tight">WHAT OUR LEGENDS SAY</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-12 md:p-16 rounded-3xl text-center max-w-3xl mx-auto"
            >
              <div className="text-7xl mb-8">“</div>
              <p className="text-2xl md:text-3xl leading-relaxed text-gray-200 italic mb-10">
                "{testimonials[currentTestimonial].comment}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">👑</div>
                <div>
                  <div className="font-bold text-xl">{testimonials[currentTestimonial].name}</div>
                  <div className="text-cyan-400 text-sm">{testimonials[currentTestimonial].game} Player</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== LEADERBOARD ==================== */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-5xl font-black tracking-tighter">THIS WEEK'S TOP WARRIORS</h2>
          <Link to="/leaderboard" className="text-cyan-400 hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest">
            FULL LEADERBOARD <ArrowRight size={18} />
          </Link>
        </div>
        <div className="space-y-4">
          {leaderboard.map((player, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card flex items-center justify-between px-8 py-6 rounded-2xl border border-white/5 hover:border-cyan-400/30 group"
            >
              <div className="flex items-center gap-8">
                <div className="text-4xl font-black text-cyan-400 w-12">#{player.rank}</div>
                <div>
                  <div className="font-bold text-xl group-hover:text-cyan-400 transition">{player.name}</div>
                  <div className="text-sm text-gray-400">{player.game}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl">{player.points}</div>
                <div className="text-emerald-400 text-sm">+{player.change} PTS</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== VIDEO SHOWCASE ==================== */}
      <section className="py-28 bg-black/70 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black">THUNDER ARENA CINEMATIC</h2>
            <p className="text-gray-400 mt-3">Feel the adrenaline</p>
          </div>
          <div className="aspect-video bg-zinc-950 rounded-3xl overflow-hidden relative border border-cyan-400/20 shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="w-24 h-24 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-full flex items-center justify-center text-5xl hover:bg-white/20 transition"
              >
                {isVideoPlaying ? <Pause size={42} /> : <Play size={42} className="ml-1" />}
              </motion.button>
            </div>
            <div className="absolute bottom-8 left-8 z-30 bg-black/60 px-5 py-2 rounded-full text-sm flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              OFFICIAL TRAILER
            </div>
          </div>
        </div>
      </section>

      {/* ==================== UPCOMING EVENTS ==================== */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-black text-center mb-16">UPCOMING EVENTS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Monthly Grand Finals", date: "May 10, 2026", prize: "৳3,00,000", game: "BGMI" },
            { title: "Valorant Champions Cup", date: "May 15, 2026", prize: "৳2,50,000", game: "Valorant" },
            { title: "Free Fire Elite League", date: "May 22, 2026", prize: "৳1,80,000", game: "Free Fire" }
          ].map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="glass-card p-8 rounded-3xl border border-white/10 hover:border-cyan-400/40"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-cyan-400 text-sm font-mono">{event.game}</div>
                  <h3 className="text-2xl font-bold mt-2">{event.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold">{event.prize}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400 mb-8">
                <Calendar size={20} />
                <span>{event.date}</span>
              </div>
              <button className="w-full py-4 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-2xl font-semibold transition-all">
                SET REMINDER
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== SPONSORS ==================== */}
      <section className="py-20 bg-black/60 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 uppercase tracking-widest text-sm mb-10">POWERED BY</p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {["Red Bull", "AMD", "Logitech", "PUBG MOBILE", "Razer", "bKash"].map((sponsor, i) => (
              <div key={i} className="text-3xl font-bold tracking-wider hover:text-cyan-400 transition">{sponsor}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-28 max-w-4xl mx-auto px-6">
        <h2 className="text-5xl font-black text-center mb-16">FREQUENTLY ASKED QUESTIONS</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                className="w-full text-left px-8 py-6 flex justify-between items-center hover:bg-white/5 transition"
              >
                <span className="font-medium text-lg">{faq.q}</span>
                <span className="text-2xl text-cyan-400">{activeFAQ === index ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {activeFAQ === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-gray-400 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-32 bg-gradient-to-b from-transparent via-cyan-950/30 to-transparent text-center">
        <div className="max-w-2xl mx-auto px-6">
          <Crown className="w-20 h-20 mx-auto mb-8 text-yellow-400" />
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-8">READY TO BECOME A LEGEND?</h2>
          <p className="text-xl text-gray-300 mb-12">Join thousands of players competing for glory and massive rewards.</p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-8 text-2xl font-bold bg-white text-black rounded-3xl shadow-2xl shadow-cyan-500/30"
            >
              CREATE ACCOUNT — IT'S FREE
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ==================== PROFESSIONAL FOOTER ==================== */}
      <footer className="bg-black/90 border-t border-white/10 pt-20 pb-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Gamepad2 className="w-10 h-10 text-cyan-400" />
                <h3 className="text-3xl font-black tracking-tighter">{settings?.siteName || "THUNDER ARENA"}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {settings?.aboutUsText?.slice(0, 120) || "Bangladesh's most premium esports platform. Compete, win, and dominate the arena."}
              </p>
              <div className="flex gap-4 text-2xl text-gray-400">
                <a href="#" className="hover:text-cyan-400 transition">𝕏</a>
                <a href="#" className="hover:text-cyan-400 transition">📘</a>
                <a href="#" className="hover:text-cyan-400 transition">📸</a>
                <a href="#" className="hover:text-cyan-400 transition">𝔻</a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">কোম্পানী</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-cyan-400 transition">আমাদের সম্পর্কে</Link></li>
                <li><Link to="/refund-policy" className="hover:text-cyan-400 transition">রিফান্ড পলিসি</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-cyan-400 transition">প্রাইভেসি পলিসি</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400 transition">টার্মস এবং কন্ডিশন</Link></li>
                <li><Link to="/faq" className="hover:text-cyan-400 transition">এফ এ কিউ</Link></li>
                <li><Link to="/notice" className="hover:text-cyan-400 transition">নোটিশ বোর্ড</Link></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">যোগাযোগ</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-cyan-400 flex-shrink-0" />
                  <span className="hover:text-white transition cursor-pointer">+8801646664222</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-cyan-400 flex-shrink-0" />
                  <a href="mailto:contact@thunderarena.com" className="hover:text-white transition">contact@thunderarena.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-cyan-400 flex-shrink-0 mt-1" />
                  <span className="hover:text-white transition leading-relaxed">
                    House#32, Road#01, Metropolitan Co-operative Housing Society, Babar Rd, Dhaka 1207
                  </span>
                </li>
              </ul>
            </div>

            {/* Download App */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">ডাউনলোড করুন</h4>
              <p className="text-gray-400 text-sm mb-5">আমাদের অ্যাপ ডাউনলোড করে যেকোনো জায়গা থেকে টুর্নামেন্ট খেলুন</p>
              <a href="#" className="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-2xl transition">
                <Smartphone size={22} />
                <span className="text-sm">Get on Android</span>
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-gray-500">
            © 2026 {settings?.siteName || "Thunder Arena"} • সর্বস্বত্ব সংরক্ষিত • Built with ❤️ for Bangladeshi Gamers
          </div>
        </div>
      </footer>

      {/* ==================== SCROLL TO TOP ==================== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-cyan-500 hover:bg-cyan-400 text-black p-4 rounded-full shadow-2xl z-50 transition"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
