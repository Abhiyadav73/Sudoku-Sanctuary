import type { StatsData } from './useStats';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  stats: StatsData;
  totalPlayed: number;
  totalWins: number;
  totalLosses: number;
  onClose: () => void;
  onClear: () => void;
}

const DIFFICULTY_CONFIG = [
  { key: 'easy'   as const, label: 'Easy',   color: '#22c55e', bg: 'bg-green-500'  },
  { key: 'medium' as const, label: 'Medium',  color: '#f59e0b', bg: 'bg-amber-400'  },
  { key: 'hard'   as const, label: 'Hard',    color: '#ef4444', bg: 'bg-red-500'    },
  { key: 'expert' as const, label: 'Expert',  color: '#a855f7', bg: 'bg-purple-500' },
];

export default function Stats({ stats, totalPlayed, totalWins, totalLosses, onClose, onClear }: Props) {
  const winRate = totalPlayed > 0 ? Math.round((totalWins / totalPlayed) * 100) : 0;
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div
      className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-4"
      style={{ background: 'rgba(25, 28, 30, 0.6)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface-container-low w-full max-w-lg rounded-4xl shadow-[0_40px_80px_rgba(25,28,30,0.2)] overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">Statistics</h2>
            <p className="text-xs text-on-surface-variant font-label mt-1 uppercase tracking-widest">Your performance</p>
          </div>
          <div className="flex items-center gap-1">
            {/* Clean Stats Button */}
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="material-symbols-outlined text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-all duration-300"
                title="Clear all stats"
              >
                delete_sweep
              </button>
            ) : (
              <button
                onClick={() => { onClear(); setConfirmClear(false); }}
                className="text-xs font-label font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-full transition-all duration-300 animate-pulse"
              >
                Confirm Clear?
              </button>
            )}
            <button
              onClick={onClose}
              className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest p-2 rounded-full transition-all duration-300"
            >
              close
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 pb-4 scrollbar-hide">
          {/* Summary row */}
          <div className="px-8 pb-6">
          <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4">Overview</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Played', value: totalPlayed, color: 'text-on-surface' },
              { label: 'Won',    value: totalWins,   color: 'text-green-500'  },
              { label: 'Lost',   value: totalLosses, color: 'text-red-500'    },
            ].map(item => (
              <div key={item.label} className="bg-surface-container-highest/60 rounded-2xl px-4 py-5 flex flex-col items-center gap-1">
                <span className={`text-3xl font-extrabold font-headline tabular-nums ${item.color}`}>
                  {item.value}
                </span>
                <span className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Win rate bar */}
          <div className="mt-4 bg-surface-container-highest/60 rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">Win Rate</span>
                <span className="text-sm font-bold font-headline text-primary">{winRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-primary to-primary-container"
                  initial={{ width: 0 }}
                  animate={{ width: `${winRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Per-difficulty table */}
        <div className="px-8 pb-4">
          <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">By Difficulty</p>
          <div className="rounded-2xl overflow-hidden border border-outline-variant/10">
            {/* Table header */}
            <div className="grid grid-cols-4 bg-surface-container-highest/60 px-5 py-2.5">
              {['Type', 'Played', 'Won', 'Lost'].map(h => (
                <span key={h} className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant text-center first:text-left">
                  {h}
                </span>
              ))}
            </div>
            {/* Table rows */}
            {DIFFICULTY_CONFIG.map((d, i) => {
              const s = stats[d.key];
              return (
                <div
                  key={d.key}
                  className={`grid grid-cols-4 px-5 py-3.5 items-center transition-colors ${i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-sm font-label font-semibold text-on-surface">{d.label}</span>
                  </div>
                  <span className="text-sm font-headline font-bold text-on-surface text-center tabular-nums">{s.played}</span>
                  <span className="text-sm font-headline font-bold text-green-500 text-center tabular-nums">{s.wins}</span>
                  <span className="text-sm font-headline font-bold text-red-500 text-center tabular-nums">{s.losses}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut-style breakdown */}
        <div className="px-8 pb-8">
          <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4 mt-4">Games Distribution</p>
          <div className="bg-surface-container-highest/60 rounded-2xl px-6 py-5 flex items-center gap-6">

            {/* Donut chart using conic-gradient */}
            <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
              <DonutChart stats={stats} totalPlayed={totalPlayed} />
              {/* Centre label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold font-headline text-on-surface tabular-nums leading-none">{totalPlayed}</span>
                <span className="text-[9px] font-label font-bold uppercase tracking-widest text-on-surface-variant leading-none mt-1">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2.5 flex-1">
              {DIFFICULTY_CONFIG.map((d, i) => {
                const played = stats[d.key].played;
                const pct = totalPlayed > 0 ? Math.round((played / totalPlayed) * 100) : 0;
                return (
                  <div key={d.key} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-xs font-label font-semibold text-on-surface flex-1">{d.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: d.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                      />
                    </div>
                    <span className="text-xs font-label font-bold text-on-surface-variant w-8 text-right tabular-nums">{played}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        </div>

      </div>
    </div>
  );
}

/* ── Donut via SVG ── */
function DonutChart({ stats, totalPlayed }: { stats: StatsData; totalPlayed: number }) {
  const R = 36;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const cx = 48, cy = 48;

  if (totalPlayed === 0) {
    return (
      <svg viewBox="0 0 96 96" className="w-full h-full">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-surface-container-highest)" strokeWidth={12} />
      </svg>
    );
  }

  let offset = 0;
  const segments = DIFFICULTY_CONFIG.map(d => {
    const frac = stats[d.key].played / totalPlayed;
    const dash = frac * CIRCUMFERENCE;
    const gap  = CIRCUMFERENCE - dash;
    const seg  = { color: d.color, dash, gap, offset };
    offset += dash;
    return seg;
  });

  return (
    <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
      {/* track */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-surface-container-highest,#e0e0e0)" strokeWidth={12} />
      {segments.map((seg, i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={seg.color}
          strokeWidth={12}
          initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
          animate={{ strokeDasharray: `${seg.dash} ${seg.gap}` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeDashoffset={-seg.offset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
}
