// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuPuzzle {
  id: string;
  difficulty: Difficulty;
  puzzle: string;   
  solution: string;
}

interface PersistedProgress {
  puzzleId: string;
  puzzle: string;
  solution: string;
  difficulty: Difficulty;
  boardSnapshot: SerializedCell[] | null;
  timeElapsed: number;
  mistakeCount: number;
  history: { board: SerializedCell[] }[];
  savedAt: number;
}

export interface SerializedCell {
  value: number | null;
  fixed: boolean;
  notes: number[];
  error: boolean;
  isHint?: boolean;
  isCorrect?: boolean;
}

// ─── JSON datasets (fallback only) ───────────────────────────────────────────

import easyData   from '../easy.json';
import mediumData from '../medium.json';
import hardData   from '../hard.json';
import expertData from '../expert.json';
import { dbService } from './dbService';

const JSON_DATASETS: Record<
  Difficulty,
  { mode: string; puzzles: { id: string; board: string; solution: string }[] }
> = {
  easy:   easyData,
  medium: mediumData,
  hard:   hardData,
  expert: expertData,
};

// ─── localStorage keys ────────────────────────────────────────────────────────

const PROGRESS_KEY = (diff: Difficulty) => `sudoku-progress-${diff}`;
const DAILY_KEY = 'sudoku-daily-challenge';

// ─── Validator ────────────────────────────────────────────────────────────────
 
function validatePuzzle(board: string, solution: string): boolean {
  if (board.length !== 81 || solution.length !== 81) return false;
  if (!/^[0-9]{81}$/.test(board))    return false;
  if (!/^[1-9]{81}$/.test(solution)) return false;

  for (let i = 0; i < 9; i++) {
    const row = new Set<string>();
    const col = new Set<string>();
    const box = new Set<string>();
    for (let j = 0; j < 9; j++) {
      const r = solution[i * 9 + j];
      const c = solution[j * 9 + i];
      const br = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      const bc = (i % 3) * 3 + (j % 3);
      const b  = solution[br * 9 + bc];
      if (row.has(r) || col.has(c) || box.has(b)) return false;
      row.add(r); col.add(c); box.add(b);
    }
  }

  for (let i = 0; i < 81; i++) {
    if (board[i] !== '0' && board[i] !== solution[i]) return false;
  }
  return true;
}

// ─── PRIMARY: Dynamic puzzle generator ───────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleSeeded<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isSafe(grid: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (grid[r][c] === num) return false;
  return true;
}

/** Generate a complete valid Sudoku grid via backtracking (randomised) */
function generateFullGrid(rng?: () => number): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function fill(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== 0) continue;
        const choices = rng ? shuffleSeeded([...nums], rng) : shuffle([...nums]);
        for (const n of choices) {
          if (isSafe(grid, r, c, n)) {
            grid[r][c] = n;
            if (fill()) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
    return true;
  }

  fill();
  return grid;
}

function countSolutions(grid: number[][], limit = 2): number {
  let count = 0;
  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== 0) continue;
        for (let n = 1; n <= 9; n++) {
          if (isSafe(grid, r, c, n)) {
            grid[r][c] = n;
            solve();
            grid[r][c] = 0;
            if (count >= limit) return;
          }
        }
        return;
      }
    }
    count++;
  }
  solve();
  return count;
}

function removeNumbers(
  grid: number[][],
  difficulty: Difficulty,
  rng?: () => number,
): number[][] {
  const attemptsMap: Record<Difficulty, number> = {
    easy:   5,
    medium: 30,  
    hard:   40,
    expert: 50,
  };
  let attempts = attemptsMap[difficulty];
  const puzzle = grid.map(row => [...row]);

  while (attempts > 0) {
    const r = rng ? Math.floor(rng() * 9) : Math.floor(Math.random() * 9);
    const c = rng ? Math.floor(rng() * 9) : Math.floor(Math.random() * 9);
    if (puzzle[r][c] === 0) continue;

    const backup   = puzzle[r][c];
    puzzle[r][c]   = 0;
    const copy     = puzzle.map(row => [...row]);

    if (countSolutions(copy, 2) !== 1) {
      puzzle[r][c] = backup;
      attempts--;
    }
  }
  return puzzle;
}

function generateDynamicPuzzle(
  difficulty: Difficulty,
  idPrefix = 'dyn',
  rng?: () => number,
): SudokuPuzzle | null {
  const fullGrid   = generateFullGrid(rng);
  const solution   = fullGrid.flat().join('');
  const puzzleGrid = removeNumbers(fullGrid, difficulty, rng);
  const puzzle     = puzzleGrid.flat().join('');

  if (!validatePuzzle(puzzle, solution)) return null; // should never happen

  return {
    id:         `${idPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    difficulty,
    puzzle,
    solution,
  };
}

// ─── FALLBACK: JSON dataset loader ───────────────────────────────────────────

function pickJsonPuzzle(difficulty: Difficulty, excludeId?: string): SudokuPuzzle | null {
  const pool = JSON_DATASETS[difficulty].puzzles.filter(p => p.id !== excludeId);
  if (pool.length === 0) return null;

  for (const p of shuffle([...pool])) {
    if (validatePuzzle(p.board, p.solution)) {
      return { id: p.id, difficulty, puzzle: p.board, solution: p.solution };
    }
  }
  return null;
}

function getPuzzle(
  difficulty: Difficulty,
  idPrefix = 'dyn',
  excludeId?: string,
  rng?: () => number,
): SudokuPuzzle {
  // ① Try dynamic generation (primary)
  const dynamic = generateDynamicPuzzle(difficulty, idPrefix, rng);
  if (dynamic) return dynamic;

  // ② Fall back to JSON dataset
  const fromJson = pickJsonPuzzle(difficulty, excludeId);
  if (fromJson) return fromJson;

  // ③ Last resort — generate without a seeded RNG (ignores prior failure)
  return generateDynamicPuzzle(difficulty, 'fallback') ??
    // Should be unreachable, but TS needs a return value
    { id: 'err', difficulty, puzzle: '0'.repeat(81), solution: '123456789'.repeat(9) };
}

// ─── Seeded PRNG (daily challenge) ───────────────────────────────────────────

/** Mulberry32 — deterministic, fast, good distribution */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s  = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function todaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function todayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Persistence helpers ──────────────────────────────────────────────────────

function loadProgress(difficulty: Difficulty): PersistedProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY(difficulty));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedProgress;
  } catch { return null; }
}

function saveProgress(p: PersistedProgress): void {
  try { localStorage.setItem(PROGRESS_KEY(p.difficulty), JSON.stringify(p)); }
  catch { /* quota / private mode — silently ignore */ }
}

function clearProgress(difficulty: Difficulty): void {
  try { localStorage.removeItem(PROGRESS_KEY(difficulty)); } catch { /* noop */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function startNewGame(difficulty: Difficulty): SudokuPuzzle {
  const old    = loadProgress(difficulty);
  const puzzle = getPuzzle(difficulty, 'dyn', old?.puzzleId);

  saveProgress({
    puzzleId:      puzzle.id,
    puzzle:        puzzle.puzzle,
    solution:      puzzle.solution,
    difficulty,
    boardSnapshot: null,
    timeElapsed:   0,
    mistakeCount:  0,
    history:       [],
    savedAt:       Date.now(),
  });

  return puzzle;
}

export function resumeOrStartGame(
  difficulty: Difficulty,
): { puzzle: SudokuPuzzle; progress: PersistedProgress | null } {
  const saved = loadProgress(difficulty);

  if (saved && validatePuzzle(saved.puzzle, saved.solution)) {
    return {
      puzzle: {
        id:         saved.puzzleId,
        difficulty,
        puzzle:     saved.puzzle,
        solution:   saved.solution,
      },
      progress: saved,
    };
  }

  const puzzle = getPuzzle(difficulty, 'dyn', saved?.puzzleId);
  saveProgress({
    puzzleId:      puzzle.id,
    puzzle:        puzzle.puzzle,
    solution:      puzzle.solution,
    difficulty,
    boardSnapshot: null,
    timeElapsed:   0,
    mistakeCount:  0,
    history:       [],
    savedAt:       Date.now(),
  });

  return { puzzle, progress: null };
}


export function persistProgress(
  difficulty:    Difficulty,
  puzzleId:      string,
  puzzleString:  string,
  solution:      string,
  boardSnapshot: SerializedCell[],
  timeElapsed:   number,
  mistakeCount:  number,
  history:       { board: SerializedCell[] }[],
): void {
  saveProgress({
    puzzleId,
    puzzle:   puzzleString,
    solution,
    difficulty,
    boardSnapshot,
    timeElapsed,
    mistakeCount,
    history,
    savedAt: Date.now(),
  });
}

export function clearGameProgress(difficulty: Difficulty): void {
  clearProgress(difficulty);
}

// ─── Daily Challenge ──────────────────────────────────────────────────────────

interface DailyEntry {
  date:       string;
  puzzleId:   string;
  puzzle:     string;
  solution:   string;
  difficulty: Difficulty;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export function getDailyChallenge(): SudokuPuzzle {
  const today = todayDateString();

  // Return cached entry if it's still today's
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (raw) {
      const entry: DailyEntry = JSON.parse(raw);
      if (entry.date === today && validatePuzzle(entry.puzzle, entry.solution)) {
        return {
          id:         entry.puzzleId,
          difficulty: entry.difficulty,
          puzzle:     entry.puzzle,
          solution:   entry.solution,
        };
      }
    }
  } catch { /* ignore */ }

  // Generate a fresh daily puzzle with a seeded RNG (deterministic for this date)
  const rng        = seededRandom(todaySeed());
  const diffIndex  = Math.floor(rng() * DIFFICULTIES.length);
  const difficulty = DIFFICULTIES[diffIndex];

  // Use the seeded RNG so the same puzzle is produced for this date everywhere
  const chosen = getPuzzle(difficulty, 'daily', undefined, rng);

  try {
    const entry: DailyEntry = {
      date:       today,
      puzzleId:   chosen.id,
      puzzle:     chosen.puzzle,
      solution:   chosen.solution,
      difficulty: chosen.difficulty,
    };
    localStorage.setItem(DAILY_KEY, JSON.stringify(entry));
  } catch { /* noop */ }

  return chosen;
}

// ─── Daily Challenge Completion Tracking ──────────────────────────────────────

const DAILY_COMPLETED_KEY = 'sudoku-daily-completed';

/**
 * Returns true if today's daily challenge has already been completed.
 */
export function isDailyChallengeCompleted(): boolean {
  try {
    const raw = localStorage.getItem(DAILY_COMPLETED_KEY);
    if (!raw) return false;
    const { date } = JSON.parse(raw) as { date: string };
    return date === todayDateString();
  } catch {
    return false;
  }
}

export async function markDailyChallengeCompleted(): Promise<void> {
  const today = todayDateString();
  try {
    localStorage.setItem(
      DAILY_COMPLETED_KEY,
      JSON.stringify({ date: today }),
    );
  } catch { /* quota / private mode */ }

  try {
    const existing = await dbService.get(today);
    const updated = existing
      ? { ...existing, challengeCompleted: true }
      : { dateStr: today, challengeCompleted: true };
    await dbService.put(updated);
  } catch (err) {
    console.error('Failed to update calendar database with challenge completion', err);
  }
}

// ─── Legacy export (QA / internal testing fallback) ──────────────────────────

/**
 * @deprecated Use startNewGame / resumeOrStartGame instead.
 * Kept as a thin shim for QA tooling that may import this directly.
 */
export function useDynamicPuzzle(difficulty: Difficulty = 'easy'): SudokuPuzzle {
  return getPuzzle(difficulty, 'qa');
}