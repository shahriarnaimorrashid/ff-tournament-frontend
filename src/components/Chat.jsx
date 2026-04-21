// src/components/Chat.jsx
// Live chat using socket.io-client. Falls back gracefully if backend
// is unreachable; messages then stay local-only for this session.
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Chat({ tournamentId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL;
    if (!url || !tournamentId) return;
    const socket = io(url, { transports: ['websocket'], reconnectionAttempts: 3 });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', { roomId: `tournament-${tournamentId}` });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.disconnect();
  }, [tournamentId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = {
      username: user?.name || 'Guest',
      text: text.trim(),
      timestamp: Date.now(),
      roomId: `tournament-${tournamentId}`,
    };
    socketRef.current?.emit('chat-message', msg);
    setMessages((prev) => [...prev, msg]);
    setText('');
  };

  return (
    <div className="mt-6 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Live Chat</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${connected ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
          {connected ? 'Connected' : 'Offline'}
        </span>
      </div>
      <div ref={listRef} className="h-64 overflow-y-auto space-y-2 pr-1 mb-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No messages yet. Say hi!</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="bg-white/5 rounded-xl px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-cyan-300 text-sm font-semibold">{m.username}</span>
                <span className="text-[10px] text-gray-500">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-white text-sm mt-1 break-words">{m.text}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition flex items-center gap-1"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
