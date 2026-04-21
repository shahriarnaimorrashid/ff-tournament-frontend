// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ParticleBackground from './components/ParticleBackground';
import './i18n';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ParticleBackground />
        <AuthProvider>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <Home />
                </motion.div>
              } />
              <Route path="/login" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <Login />
                </motion.div>
              } />
              <Route path="/register" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <Register />
                </motion.div>
              } />
              <Route path="/tournaments" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <Tournaments />
                </motion.div>
              } />
              <Route path="/tournaments/:id" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <TournamentDetail />
                </motion.div>
              } />
              <Route path="/dashboard" element={<PrivateRoute><motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}><Dashboard /></motion.div></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}><AdminDashboard /></motion.div></AdminRoute>} />
              <Route path="/profile" element={<PrivateRoute><motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}><Profile /></motion.div></PrivateRoute>} />
              <Route path="/wallet" element={<PrivateRoute><motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}><Wallet /></motion.div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;