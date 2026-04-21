import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center p-8 dark:text-white">Loading...</div>;
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
}