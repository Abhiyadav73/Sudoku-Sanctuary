/**
 * useDynamicPuzzle.ts
 *
 * Responsibilities:
 *  1. PRIMARY — Generate a completely fresh, unique puzzle every time via a
 *     backtracking solver + uniqueness-guaranteed cell removal algorithm.
 *  2. Validate every generated puzzle before returning it (unique solution,
 *     correct board format, clue-solution agreement).
 *  3. FALLBACK — If dynamic generation fails validation (should be extremely
 *     rare), load a puzzle from the pre-defined JSON datasets instead.
 *  4. Persist per-difficulty game progress in localStorage so the user can
 *     resume where they left off without generating a new puzzle on every load.
 *  5. Only generate a new puzzle when a "new game" is explicitly requested —
 *     otherwise resume the saved in-progress game.
 *  6. Provide a deterministic Daily Challenge that stays fixed until the next
 *     day (seeded by calendar date, always dynamically generated once per day).
 *
 * NOTE: This module is self-contained and does NOT modify any gameplay logic
 * in useSudoku.ts or the App UI.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuPuzzle {
  id: string;
  difficulty: Difficulty;
  puzzle: string;   
  solution: string;
}

/** Shape persisted in localStorage for a given difficulty */
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

/** Minimal cell fields we need to restore the board */
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

/**
 * Validates a (board, solution) pair:
 *  - Both must be exactly 81 chars of digits
 *  - Solution digits 1–9 must satisfy row / col / box uniqueness
 *  - Every non-zero board cell must match the corresponding solution cell
 */ 
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

/**
 * Count the number of solutions for a partially-filled grid (capped at `limit`).
 * Used to guarantee the puzzle has exactly one solution.
 */
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
        return; // no valid number → dead end
      }
    }
    count++; // reached end → valid solution found
  }
  solve();
  return count;
}

/**
 * Remove numbers from a full grid to create a puzzle with a unique solution.
 * The number of removal attempts scales with difficulty.
 */
function removeNumbers(
  grid: number[][],
  difficulty: Difficulty,
  rng?: () => number,
): number[][] {
  const attemptsMap: Record<Difficulty, number> = {
    easy:   5,
    medium: 45,  
    hard:   55,
    expert: 60,
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
      puzzle[r][c] = backup; // restore — removing this cell breaks uniqueness
      attempts--;
    }
  }
  return puzzle;
}

/**
 * PRIMARY entry point — generates a completely fresh, dynamically created puzzle.
 * Optionally accepts a seeded RNG for deterministic output (daily challenge).
 * Returns null if the generated puzzle fails internal validation (extremely rare).
 */
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

/*
 * FALLBACK — picks a validated puzzle from the JSON datasets.
 * Used only when dynamic generation fails.
 * Avoids repeating the `excludeId` puzzle if possible.
 */
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

/**
 * Get a valid puzzle — tries dynamic generation first, falls back to JSON.
 * This is the single source of truth for "give me a new puzzle".
 */
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

/**
 * Start a brand-new game for the given difficulty.
 * Always generates a fresh dynamic puzzle.
 * Clears any previous saved progress for that difficulty.
 */
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

/**
 * Resume the saved game for a difficulty, or start a new one if none exists.
 */
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

  // No valid saved progress — generate a new puzzle
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

/**
 * Persist the current in-game board state so it can be resumed later.
 * Call this whenever the board, timer, or mistake count changes.
 */
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

/**
 * Clear saved progress for a difficulty (call after game-over or completion).
 */
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

/**
 * Returns today's Daily Challenge puzzle.
 * - Same puzzle is returned for the entire calendar day.
 * - Difficulty is chosen deterministically from today's date seed.
 * - The puzzle itself is dynamically generated using the same seed (always fresh,
 *   never taken from the JSON datasets unless generation fails).
 * - Result is cached in localStorage so re-renders don't re-generate it.
 */
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

// ─── Legacy export (QA / internal testing fallback) ──────────────────────────

/**
 * @deprecated Use startNewGame / resumeOrStartGame instead.
 * Kept as a thin shim for QA tooling that may import this directly.
 */
export function useDynamicPuzzle(difficulty: Difficulty = 'easy'): SudokuPuzzle {
  return getPuzzle(difficulty, 'qa');
}