import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center p-8 dark:text-white">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}