import toast from 'react-hot-toast';

export default function ShareButtons({ tournament }) {
  const url = window.location.href;
  const text = `Join "${tournament.title}" on E-Sports Arena! 🎮`;

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: tournament.title, text, url }); }
      catch (_) {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="flex gap-3 flex-wrap mt-4">
      <button onClick={share} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-white transition">
        🔗 Share
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-green-900/40 hover:bg-green-900/60 border border-green-700 rounded-full text-sm text-green-400 transition">
        WhatsApp
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700 rounded-full text-sm text-blue-400 transition">
        Facebook
      </a>
    </div>
  );
}