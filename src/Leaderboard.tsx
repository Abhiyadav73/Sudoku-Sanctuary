import type { LeaderboardEntry } from './useLeaderboard';
import type { Difficulty } from './useSudoku';
import WinnerCard from './Components/WinnerCard';
import { useState } from 'react';

interface Props {
  entries: LeaderboardEntry[];
  onClose: () => void;
  onClear: () => void;
}

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];
const medals = ['🥇', '🥈', '🥉'];

const modeColor: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  expert: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
};

export default function Leaderboard({ entries, onClose, onClear }: Props) {
  const hasPoints = entries.some(e => e.points > 0);
  const [selectedEntryForCard, setSelectedEntryForCard] = useState<LeaderboardEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const handleClear = () => {
    if (confirmDelete) {
      onClear();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };
  const batch = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award-icon lucide-award"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /><circle cx="12" cy="8" r="6" /></svg>
    )
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      style={{ background: 'rgba(25, 28, 30, 0.6)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface-container-low w-full max-w-2xl border-2 border-red-300  rounded-2xl shadow-[0_40px_80px_rgba(25,28,30,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface font-headline tracking-tight truncate flex items-center gap-1">
              <span>Leaderboard</span>
              <span className="font-normal text-violet-400 text-xl opacity-90">{batch()}</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-on-surface-variant font-label mt-0.5 sm:mt-1 uppercase tracking-widest truncate">
              {hasPoints ? 'Top completions by score' : 'Top completions by time'}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 pt-0.5">
            {entries.length > 0 && (
              <button
                onClick={handleClear}
                className={`material-symbols-outlined transition-all duration-300 p-1.5 sm:p-2 rounded-full text-xl sm:text-2xl ${confirmDelete
                  ? 'text-error bg-error/20 animate-pulse'
                  : 'text-on-surface-variant hover:text-error hover:bg-error/10'
                  }`}
                title={confirmDelete ? "Click again to confirm clear" : "Clear leaderboard"}
                aria-label={confirmDelete ? "Confirm clear leaderboard" : "Clear leaderboard"}
              >
                {confirmDelete ? 'check' : 'delete'}
              </button>
            )}
            <button
              onClick={onClose}
              className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest p-1.5 sm:p-2 rounded-full transition-all duration-300 text-xl sm:text-2xl"
              aria-label="Close leaderboard"
            >
              close
            </button>
          </div>
        </div>

        {/* Filter chips by difficulty */}
        {entries.length > 0 && (() => {
          const modeData = DIFFICULTY_ORDER.map(d => ({
            mode: d,
            count: entries.filter(e => e.mode === d).length,
          })).filter(item => item.count > 0);

          const totalEntries = modeData.reduce((acc, item) => acc + item.count, 0);

          const modeDotColor = {
            easy: 'bg-emerald-500',
            medium: 'bg-amber-500',
            hard: 'bg-rose-500',
            expert: 'bg-blue-500',
            default: 'bg-primary'
          };

          return (
            <div className="px-2 sm:px-5 pb-4 space-y-2.5 transition-all duration-500 ease-out">
              {/* 1. Single-Line Chips with Colored Dots */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
                {modeData.map(({ mode, count }) => {
                  const initial = mode.charAt(0).toUpperCase();
                  const dotClass = modeDotColor[mode.toLowerCase()] || modeDotColor.default;

                  return (
                    <div
                      key={mode}
                      className="flex items-center gap-1.5 shrink-0 bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/20"
                    >
                      <span className={`w-2 h-2 rounded-full ${dotClass} animate-pulse`} />
                      <span className="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface">
                        {initial}
                      </span>
                      <span className="text-[11px] font-label text-on-surface-variant/80">
                        ({count})
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 2. Animated Distribution Bar */}
              <div className="w-full h-2 bg-surface-container-highest/60 rounded-full overflow-hidden flex p-0.5 gap-0.5 shadow-inner">
                {modeData.map(({ mode, count }) => {
                  const percentage = (count / totalEntries) * 100;
                  const barClass = modeDotColor[mode.toLowerCase()] || modeDotColor.default;

                  return (
                    <div
                      key={mode}
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${barClass} rounded-sm transition-all duration-700 ease-out first:rounded-l-full last:rounded-r-full hover:brightness-110 hover:scale-110`}
                      title={`${mode.toUpperCase()}: ${count} (${Math.round(percentage)}%)`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Table */}
        <div className="overflow-y-auto flex-1 px-4 pb-6 scrollbar-hide">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              <p className="text-on-surface-variant font-label font-medium text-sm">No completions yet. Solve a puzzle to appear here!</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-on-surface-variant text-[10px] font-label font-bold uppercase tracking-widest border-b border-outline-variant/20">
                  <th className="text-left px-4 py-3 w-8">#</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Mode</th>
                  {hasPoints && (
                    <th className="text-right px-4 py-3">Score</th>
                  )}
                  <th className="text-right px-4 py-3">Time</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Streak</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="text-right px-4 py-3">Card</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors duration-200"
                  >
                    <td className={`px-4 py-3.5 font-headline font-extrabold text-base ${i < 3 ? medalColors[i] : 'text-on-surface-variant'}`}>
                      {i < 3 ? medals[i] : i + 1}
                    </td>
                    <td className="px-4 py-3.5 font-label font-semibold text-on-surface">{entry.name}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`text-[10px] font-label font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${modeColor[entry.mode]}`}>
                        {entry.mode}
                      </span>
                    </td>
                    {hasPoints && (
                      <td className="px-4 py-3.5 text-right">
                        {entry.points > 0 ? (
                          <span className="font-headline font-bold text-primary tabular-nums">
                            {entry.points.toLocaleString()}
                            <span className="text-[10px] font-label text-on-surface-variant ml-0.5">pts</span>
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/40 text-xs font-label">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3.5 text-right font-headline font-bold text-on-surface-variant tabular-nums">{formatTime(entry.time)}</td>
                    <td className="px-4 py-3.5 text-right hidden md:table-cell">
                      <span className="font-label text-xs text-on-surface-variant">🔥 {entry.streak}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-label text-xs text-on-surface-variant hidden md:table-cell">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedEntryForCard(entry); }}
                        className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-md transition-colors"
                        title="Generate Winner Card"
                      >
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedEntryForCard && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEntryForCard(null)}
        >
          <div onClick={e => e.stopPropagation()}>
            <WinnerCard
              name={selectedEntryForCard.name}
              score={selectedEntryForCard.points}
              time={selectedEntryForCard.time}
              mode={selectedEntryForCard.mode}
            />
          </div>
        </div>
      )}
    </div>
  );
}
