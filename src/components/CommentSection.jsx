import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function CommentSection({ tournamentId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/tournaments/${tournamentId}/comments`)
      .then(r => setComments(r.data))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const postComment = async () => {
    if (!user) return toast.error(t('comment.loginRequired'));
    if (!text.trim()) return;
    try {
      const res = await axios.post(`/tournaments/${tournamentId}/comments`, { text });
      setComments(prev => [res.data, ...prev]);
      setText('');
    } catch (err) {
      toast.error(err.response?.data?.message || t('error.generic'));
    }
  };

  const postReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(`/tournaments/${tournamentId}/comments/${commentId}/reply`, { text: replyText });
      setComments(prev => prev.map(c => c._id === commentId ? res.data : c));
      setReplyTo(null);
      setReplyText('');
    } catch (err) {
      toast.error(t('error.generic'));
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm(t('comment.confirmDelete'))) return;
    try {
      await axios.delete(`/tournaments/${tournamentId}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      toast.error(t('error.generic'));
    }
  };

  const Avatar = ({ u, size = 8 }) => (
    <img loading="lazy" src={u?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || 'U')}&background=7c3aed&color=fff`}
      alt={u?.name} className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`} />
  );

  if (loading) return <div className="text-center py-4">Loading comments...</div>;

  return (
    <div className="mt-6">
      <h3 className="text-white font-semibold mb-4">{t('comment.title')} ({comments.length})</h3>

      {/* Input */}
      <div className="flex gap-3 mb-6">
        {user && <Avatar u={user} />}
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={user ? t('comment.placeholder') : t('comment.loginRequired')}
            disabled={!user}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          {user && (
            <button onClick={postComment} className="mt-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition">
              {t('comment.post')}
            </button>
          )}
        </div>
      </div>

      {/* Comments List */}
      <AnimatePresence>
        {comments.map(c => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4">
            <div className="flex gap-3">
              <Avatar u={c.user} />
              <div className="flex-1">
                <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-semibold">{c.user?.name}</span>
                    <span className="text-gray-500 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{c.text}</p>
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-500 pl-1">
                  {user && <button onClick={() => setReplyTo(replyTo === c._id ? null : c._id)} className="hover:text-purple-400 transition">{t('comment.reply')}</button>}
                  {(user?.id === c.user?._id || user?.role === 'admin') &&
                    <button onClick={() => deleteComment(c._id)} className="hover:text-red-400 transition">{t('comment.delete')}</button>}
                </div>

                {/* Reply input */}
                {replyTo === c._id && (
                  <div className="flex gap-2 mt-2">
                    <input value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder={t('comment.replyPlaceholder')}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                    <button onClick={() => postReply(c._id)} className="bg-purple-600 text-white text-xs px-3 rounded-full">{t('comment.send')}</button>
                  </div>
                )}

                {/* Replies */}
                {c.replies?.map(r => (
                  <div key={r._id} className="flex gap-2 mt-2 ml-4">
                    <Avatar u={r.user} size={6} />
                    <div className="bg-gray-700 rounded-2xl rounded-tl-none p-2 flex-1">
                      <span className="text-white text-xs font-semibold">{r.user?.name} </span>
                      <span className="text-gray-300 text-xs">{r.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}