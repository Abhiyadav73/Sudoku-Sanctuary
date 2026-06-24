import { useState, useCallback, useRef } from 'react';
import type { Difficulty } from './useSudoku';

export type { Difficulty };

interface PointConfig {
  base: number;
  expectedTime: number; // in seconds
}

const DIFFICULTY_CONFIG: Record<Difficulty, PointConfig> = {
  easy:   { base: 100, expectedTime: 10 * 60 },
  medium: { base: 200, expectedTime: 20 * 60 },
  hard:   { base: 300, expectedTime: 40 * 60 },
  expert: { base: 500, expectedTime: 60 * 60 },
};

export interface FloatingPoint {
  id: string;
  points: number;
  x: number;
  y: number;
}

/**
 * Centralised point system.
 *
 * Points are ONLY awarded when `mistakeLimitEnabled` is true (3-mistake mode).
 * In casual mode (no limit) every method is a no-op so the rest of the app
 * doesn't need to add guard-clauses. 
 */
export const usePointSystem = (difficulty: Difficulty, mistakeLimitEnabled: boolean) => {
  const config = DIFFICULTY_CONFIG[difficulty];

  const [score, setScore] = useState<number>(0);
  const [, setHintsUsed] = useState({ minor: 0, major: 0 });
  const [mistakes, setMistakes] = useState<number>(0);
  const [floatingPoints, setFloatingPoints] = useState<FloatingPoint[]>([]);

  // Track timeouts so we can clear them on reset
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ─── helpers ─────────────────────────────────────────────────────────────

  /** Clear all scheduled floating-label cleanup timeouts (called on reset). */
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(id => clearTimeout(id));
    timeoutRefs.current = [];
  }, []);

  // ─── public API ──────────────────────────────────────────────────────────

  /**
   * Trigger a floating "+N" / "−N" label near a cell.
   * Pass a MouseEvent or a plain {x, y} coordinate pair.
   */
  const triggerCellAnimation = useCallback(
    (points: number, e: React.MouseEvent<HTMLDivElement> | { x: number; y: number }) => {
      if (!mistakeLimitEnabled) return;

      const clientX = 'clientX' in e ? e.clientX : e.x;
      const clientY = 'clientY' in e ? e.clientY : e.y;

      const newId = `${Date.now()}-${Math.random()}`;
      setFloatingPoints(prev => [...prev, { id: newId, points, x: clientX, y: clientY }]);

      const tid = setTimeout(() => {
        setFloatingPoints(prev => prev.filter(item => item.id !== newId));
      }, 1100);
      timeoutRefs.current.push(tid);
    },
    [mistakeLimitEnabled],
  );

  /**
   * Record a game action and update score / floatingPoints accordingly.
   *
   * @param type    - action kind
   * @param event   - optional mouse event / coordinate for the floating label
   */
  const registerAction = useCallback(
    (
      type: 'minor_hint' | 'major_hint' | 'mistake' | 'correct_cell',
      event?: React.MouseEvent<HTMLDivElement> | { x: number; y: number },
    ) => {
      if (!mistakeLimitEnabled) return;

      let delta = 0;

      if (type === 'minor_hint') {
        setHintsUsed(prev => ({ ...prev, minor: prev.minor + 1 }));
        delta = -10;
      } else if (type === 'major_hint') {
        setHintsUsed(prev => ({ ...prev, major: prev.major + 1 }));
        delta = -30;
      } else if (type === 'mistake') {
        setMistakes(prev => prev + 1);
        // no point delta for mistakes — tracked separately in final score
      } else if (type === 'correct_cell') {
        delta = 15;
      }

      if (delta !== 0) {
        setScore(prev => Math.max(0, prev + delta));
        if (event) triggerCellAnimation(delta, event);
      }
    },
    [mistakeLimitEnabled, triggerCellAnimation],
  );

  /**
   * Calculate the final leaderboard-worthy score once the puzzle is solved.
   * Incorporates time bonus, hint penalty, and accuracy bonus on top of the
   * live running score.
   */
  const calculateFinalScore = useCallback(
    (timeElapsedInSeconds: number): number => {
      if (!mistakeLimitEnabled) return 0;

      const base = config.base;

      // Time bonus: up to 2× base for finishing early
      let timeBonus = 0;
      if (timeElapsedInSeconds < config.expectedTime) {
        const efficiency = (config.expectedTime - timeElapsedInSeconds) / config.expectedTime;
        timeBonus = Math.round(base * efficiency * 2);
      }

      // Accuracy bonus
      let accuracyBonus = 0;
      if (mistakes === 0)      accuracyBonus = 50;
      else if (mistakes === 1) accuracyBonus = 25;

      // Live score already includes points for correct cells and hint penalties.
      const total = score + base + timeBonus + accuracyBonus;
      return Math.max(0, total);
    },
    [config, mistakes, mistakeLimitEnabled, score],
  );

  /**
   * Reset all point-system state for a fresh game.
   * Must be called whenever a new board is generated.
   */
  const resetPoints = useCallback(() => {
    clearAllTimeouts();
    setScore(0);
    setHintsUsed({ minor: 0, major: 0 });
    setMistakes(0);
    setFloatingPoints([]);
  }, [clearAllTimeouts]);

  return {
    score,
    floatingPoints,
    registerAction,
    calculateFinalScore,
    triggerCellAnimation,
    resetPoints,
    /** Whether the point system is active (3-mistake mode only) */
    isActive: mistakeLimitEnabled,
  };
};