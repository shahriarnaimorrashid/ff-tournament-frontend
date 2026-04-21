import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMyTournaments = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        setTournaments(res.data.registeredTournaments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTournaments();
  }, []);

  if (loading) return <div className="text-center p-8 dark:text-white">{t('common.loading')}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">{t('dashboard.myTournaments')}</h2>
      {tournaments.length === 0 ? (
        <p className="dark:text-gray-300">{t('dashboard.noTournaments')} <Link to="/tournaments" className="text-orange-600 hover:underline">{t('dashboard.browseTournaments')}</Link></p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {tournaments.map(t => (
            <div key={t._id} className="bg-white dark:bg-gray-800 p-4 shadow rounded">
              <h3 className="text-xl font-semibold dark:text-white">{t.title}</h3>
              <p className="dark:text-gray-300">{t('tournaments.date')}: {new Date(t.date).toLocaleDateString()}</p>
              <Link to={`/tournaments/${t._id}`} className="text-orange-600 hover:underline">{t('tournaments.viewDetails')}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}