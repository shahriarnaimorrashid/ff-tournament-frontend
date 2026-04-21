// src/components/Logo.jsx
import { Link } from 'react-router-dom';

const LOGO_URL = import.meta.env.VITE_LOGO_URL || '/logo.png'; // fallback to public/logo.png

export default function Logo({ size = 'md' }) {
  const sizes = { sm: 'h-7', md: 'h-9', lg: 'h-12' };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src={LOGO_URL}
        alt="E-Sports Tournament Arena Logo"
        className={`${sizes[size]} w-auto object-contain`}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity`}>
        E-Sports Arena
      </span>
    </Link>
  );
}