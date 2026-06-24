import { useState, useCallback } from 'react';
import type { Difficulty } from './useSudoku';

export type DifficultyStats = {
  played: number;
  wins: number;
  losses: number;
};

export type StatsData = Record<Difficulty, DifficultyStats>;

const STATS_KEY = 'sudoku-stats';

const defaultDiff = (): DifficultyStats => ({ played: 0, wins: 0, losses: 0 });

function readStats(): StatsData {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { easy: defaultDiff(), medium: defaultDiff(), hard: defaultDiff(), expert: defaultDiff() };
    const parsed = JSON.parse(raw) as Partial<StatsData>;
    return {
      easy:   { ...defaultDiff(), ...parsed.easy },
      medium: { ...defaultDiff(), ...parsed.medium },
      hard:   { ...defaultDiff(), ...parsed.hard },
      expert: { ...defaultDiff(), ...parsed.expert },
    };
  } catch {
    return { easy: defaultDiff(), medium: defaultDiff(), hard: defaultDiff(), expert: defaultDiff() };
  }
}

function writeStats(data: StatsData) {
  localStorage.setItem(STATS_KEY, JSON.stringify(data));
}

export function useStats() {
  const [stats, setStats] = useState<StatsData>(readStats);

  const recordWin = useCallback((mode: Difficulty) => {
    setStats(prev => {
      const next: StatsData = {
        ...prev,
        [mode]: {
          played: prev[mode].played + 1,
          wins:   prev[mode].wins + 1,
          losses: prev[mode].losses,
        },
      };
      writeStats(next);
      return next;
    });
  }, []);

  const recordLoss = useCallback((mode: Difficulty) => {
    setStats(prev => {
      const next: StatsData = {
        ...prev,
        [mode]: {
          played: prev[mode].played + 1,
          wins:   prev[mode].wins,
          losses: prev[mode].losses + 1,
        },
      };
      writeStats(next);
      return next;
    });
  }, []);

  const totalPlayed = Object.values(stats).reduce((s, d) => s + d.played, 0);
  const totalWins   = Object.values(stats).reduce((s, d) => s + d.wins,   0);
  const totalLosses = Object.values(stats).reduce((s, d) => s + d.losses, 0);

  return { stats, recordWin, recordLoss, totalPlayed, totalWins, totalLosses };
}
