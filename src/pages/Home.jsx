// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, Users, Shield, Sparkles } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { icon: <Trophy className="w-6 h-6 text-cyan-400" />, titleKey: 'Pro Tournaments', descKey: 'Join competitive tournaments with real prizes' },
    { icon: <Users className="w-6 h-6 text-purple-400" />, titleKey: '10K+ Players', descKey: 'Join a growing community of gamers' },
    { icon: <Shield className="w-6 h-6 text-green-400" />, titleKey: 'Secure Escrow', descKey: 'Safe transactions with escrow protection' },
    { icon: <Sparkles className="w-6 h-6 text-pink-400" />, titleKey: 'Daily Rewards', descKey: 'Earn coins and exclusive rewards' },
  ];

  return (
    <div className="min-h-screen pt-16">
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

      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl md:text-4xl font-bold text-cyan-400">50+</div><div className="text-gray-500 text-sm mt-1">Tournaments</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-purple-400">10K+</div><div className="text-gray-500 text-sm mt-1">Active Players</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-pink-400">Ekhono dewa hoy ni</div><div className="text-gray-500 text-sm mt-1">Prize Distributed</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-green-400">99%</div><div className="text-gray-500 text-sm mt-1">Satisfaction</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}