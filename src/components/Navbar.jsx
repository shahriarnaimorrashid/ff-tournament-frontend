// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Menu, X, Wallet } from 'lucide-react';
import axios from '../utils/axios';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    if (user) {
      axios.get('/wallet')
        .then(res => setWalletBalance(res.data.balance))
        .catch(err => console.error('Failed to load wallet', err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'bn' ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <nav className="glass-navbar fixed top-0 w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-gradient-primary hover:opacity-80 transition">
            E-Sports Arena
          </Link>

          {/* ডেস্কটপ মেনু */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/tournaments" className="text-gray-300 hover:text-cyan-400 transition">
              {t('navbar.tournaments')}
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                  <img
                    src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`}
                    alt="avatar"
                    loading="lazy"
                    className="w-8 h-8 rounded-full ring-2 ring-cyan-500 object-cover"
                  />
                  <span className="text-sm text-white flex items-center gap-1">
                    {user.name}
                    {user.role === 'admin' && (
                      <span className="ml-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Administor</span>
                    )}
                  </span>
                </Link>
                <Link to="/wallet" className="flex items-center gap-1 text-sm bg-cyan-900/50 border border-cyan-700 px-3 py-1.5 rounded-full text-cyan-300 hover:bg-cyan-900/70 transition">
                  <Wallet size={14} /> {walletBalance} coins
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition">
                    {t('navbar.adminPanel')}
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-300 hover:text-cyan-400 transition">
                  {t('navbar.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-cyan-400 transition">
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="btn-gradient px-4 py-1.5 rounded-full text-white text-sm font-semibold transition hover:scale-105">
                  {t('navbar.register')}
                </Link>
              </>
            )}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-white hover:bg-white/20 transition"
            >
              {i18n.language === 'bn' ? 'English' : 'বাংলা'}
            </button>
            <ThemeToggle />
          </div>

          {/* মোবাইল মেনু বাটন */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* মোবাইল মেনু ড্রপডাউন – মোবাইলের জন্য স্পেসিং ও ডিজাইন ঠিক করা */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/tournaments"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-cyan-400 py-2 px-2 rounded-lg transition"
              >
                {t('navbar.tournaments')}
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2 hover:text-cyan-400 transition rounded-lg"
                  >
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff`}
                      alt="avatar"
                      loading="lazy"
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="flex items-center gap-1 text-sm">
                      {user.name}
                      {user.role === 'admin' && (
                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">Administor</span>
                      )}
                    </span>
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-2 hover:text-cyan-400 transition flex items-center gap-1 text-sm"
                  >
                    <Wallet size={14} /> {walletBalance} coins
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-2 text-yellow-400 hover:text-yellow-300 transition text-sm"
                    >
                      {t('navbar.adminPanel')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left py-2 px-2 text-gray-300 hover:text-cyan-400 transition text-sm"
                  >
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-2 hover:text-cyan-400 transition text-sm"
                  >
                    {t('navbar.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-gradient text-center py-2 px-2 rounded-full text-sm transition"
                  >
                    {t('navbar.register')}
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 bg-white/10 rounded-full text-sm w-fit hover:bg-white/20 transition"
                >
                  {i18n.language === 'bn' ? 'English' : 'বাংলা'}
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}