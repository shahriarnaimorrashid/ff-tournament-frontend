// src/components/CountdownTimer.jsx
import Countdown from 'react-countdown';
import { motion } from 'framer-motion';

const Cell = ({ value, label }) => (
  <div className="flex flex-col items-center min-w-[64px] px-3 py-2 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20">
    <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] uppercase tracking-wider text-gray-300">{label}</span>
  </div>
);

export default function CountdownTimer({ date }) {
  if (!date) return null;
  return (
    <Countdown
      date={new Date(date)}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-pink-400 font-semibold"
            >
              Tournament started!
            </motion.div>
          );
        }
        return (
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Cell value={days} label="Days" />
            <Cell value={hours} label="Hours" />
            <Cell value={minutes} label="Min" />
            <Cell value={seconds} label="Sec" />
          </div>
        );
      }}
    />
  );
}
