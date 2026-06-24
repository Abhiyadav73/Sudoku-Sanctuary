import { useState, useCallback } from 'react';
import type { Difficulty } from './useSudoku';

export interface LeaderboardEntry {
  id: string;
  name: string;
  type: string;
  mode: Difficulty;
  time: number;    // seconds
  points: number;  // score (0 if casual / no limit mode)
  streak: number;  // days
  date: string;    // ISO
}

const STORAGE_KEY = 'sudoku-leaderboard';
const STREAK_KEY  = 'sudoku-streak';

function readStreak(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 1;
    const { lastDate, streak } = JSON.parse(raw) as { lastDate: string; streak: number };
    const today     = new Date().toDateString();
    const lastDay   = new Date(lastDate).toDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    if (lastDay === today)      return streak;
    if (lastDay === yesterday)  return streak + 1;
    return 1;
  } catch {
    return 1;
  }
}

function writeStreak(streak: number) {
  localStorage.setItem(STREAK_KEY, JSON.stringify({
    lastDate: new Date().toISOString(),
    streak,
  }));
}

function readEntries(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(readEntries);
  const currentStreak = readStreak();

  const addEntry = useCallback(
    (name: string, mode: Difficulty, time: number, points = 0): LeaderboardEntry => {
      const streak = readStreak();
      writeStreak(streak);

      const entry: LeaderboardEntry = {
        id:     Date.now().toString(),
        name:   name.trim() || 'Anonymous',
        type:   'Classic Sudoku',
        mode,
        time,
        points,
        streak,
        date:   new Date().toISOString(),
      };

      setEntries(prev => {
        const updated = [entry, ...prev]
          // Primary sort: highest points first; secondary: fastest time
          .sort((a, b) => b.points - a.points || a.time - b.time)
          .slice(0, 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return entry;
    },
    [],
  );

  const clearLeaderboard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
  }, []);

  return { entries, addEntry, clearLeaderboard, currentStreak };
}
