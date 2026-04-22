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

  const fetchBalance = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/wallet');
      setWalletBalance(data.balance);
    } catch (err) {
      console.error('Failed to load wallet', err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  // ওয়ালেট আপডেট ইভেন্ট লিসেনার
  useEffect(() => {
    const handleWalletUpdate = () => {
      fetchBalance();
    };
    window.addEventListener('wallet-updated', handleWalletUpdate);
    return () => window.removeEventListener('wallet-updated', handleWalletUpdate);
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
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent hover:opacity-80 transition">
            E-Sports Arena
          </Link>

          {/* ডেস্কটপ মেনু */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/tournaments" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-cyan-400 transition">
              {t('navbar.tournaments')}
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                  <img
                    src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`}
                    alt="avatar"
                    loading="lazy"
                    className="w-8 h-8 rounded-full ring-2 ring-purple-500 object-cover"
                  />
                  <span className="text-sm text-gray-800 dark:text-white flex items-center gap-1">
                    {user.name}
                    {user.role === 'admin' && (
                      <span className="ml-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </span>
                </Link>
                <Link to="/wallet" className="flex items-center gap-1 text-sm bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-700 px-3 py-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/70 transition">
                  <Wallet size={14} /> {walletBalance} coins
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 transition">
                    {t('navbar.adminPanel')}
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-cyan-400 transition">
                  {t('navbar.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-cyan-400 transition">
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-full text-white text-sm font-semibold transition hover:scale-105">
                  {t('navbar.register')}
                </Link>
              </>
            )}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 rounded-full text-sm text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition"
            >
              {i18n.language === 'bn' ? 'English' : 'বাংলা'}
            </button>
            <ThemeToggle />
          </div>

          {/* মোবাইল মেনু বাটন */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-800 dark:text-white p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* মোবাইল মেনু ড্রপডাউন */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-white/10 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/tournaments"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-cyan-400 py-2 px-2 rounded-lg transition"
              >
                {t('navbar.tournaments')}
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2 hover:text-purple-600 dark:hover:text-cyan-400 transition rounded-lg"
                  >
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff`}
                      alt="avatar"
                      loading="lazy"
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="flex items-center gap-1 text-sm text-gray-800 dark:text-white">
                      {user.name}
                      {user.role === 'admin' && (
                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">Admin</span>
                      )}
                    </span>
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-2 hover:text-purple-600 dark:hover:text-cyan-400 transition flex items-center gap-1 text-sm text-gray-800 dark:text-white"
                  >
                    <Wallet size={14} /> {walletBalance} coins
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 transition text-sm"
                    >
                      {t('navbar.adminPanel')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left py-2 px-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-cyan-400 transition text-sm"
                  >
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-2 hover:text-purple-600 dark:hover:text-cyan-400 transition text-sm text-gray-800 dark:text-white"
                  >
                    {t('navbar.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-purple-600 text-center py-2 px-2 rounded-full text-white text-sm transition"
                  >
                    {t('navbar.register')}
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 rounded-full text-sm text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition"
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