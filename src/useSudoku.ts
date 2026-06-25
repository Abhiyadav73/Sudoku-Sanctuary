import { useState, useEffect, useCallback, useRef } from 'react';
import easyData from '../easy.json';
import mediumData from '../medium.json';
import hardData from '../hard.json';
import expertData from '../expert.json';
import {
  persistProgress,
  type SerializedCell,
} from './useDynamicPuzzle';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CellData {
  value: number | null;
  fixed: boolean;
  notes: number[];
  error: boolean;
  isHint?: boolean;
  isCorrect?: boolean;
}


export interface GameState {
  board: CellData[];
  selectedCell: number | null;
  notesMode: boolean;
  difficulty: Difficulty;
  history: { board: CellData[] }[];
  timeElapsed: number;
  isPlaying: boolean;
  isPaused: boolean;
  solution: string;
  mistakeCount: number;
}

const difficultyData = {
  easy: easyData,
  medium: mediumData,
  hard: hardData,
  expert: expertData
};

// ─── Peer helpers ────────────────────────────────────────────────────────────

function rowPeers(index: number): number[] {
  const row = Math.floor(index / 9);
  return Array.from({ length: 9 }, (_, c) => row * 9 + c).filter(i => i !== index);
}

function colPeers(index: number): number[] {
  const col = index % 9;
  return Array.from({ length: 9 }, (_, r) => r * 9 + col).filter(i => i !== index);
}

function boxPeers(index: number): number[] {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  const peers: number[] = [];
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      const i = r * 9 + c;
      if (i !== index) peers.push(i);
    }
  }
  return peers;
}

function allPeers(index: number): Set<number> {
  return new Set([...rowPeers(index), ...colPeers(index), ...boxPeers(index)]);
}

function recomputeErrors(board: CellData[]): CellData[] {
  return board.map((cell, index) => {
    if (cell.value === null) {
      return { ...cell, error: false };
    }
    const hasDuplicate = [...allPeers(index)].some(
      peerIdx => board[peerIdx].value === cell.value
    );
    return { ...cell, error: hasDuplicate };
  });
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSudoku() {
  const [state, setState] = useState<GameState>({
    board: Array(81).fill(null).map(() => ({ value: null, fixed: false, notes: [], error: false })),
    selectedCell: null,
    notesMode: false,
    difficulty: 'easy',
    history: [],
    timeElapsed: 0,
    isPlaying: false,
    isPaused: false,
    solution: '',
    mistakeCount: 0
  });

  // Track the currently active puzzle ID so we can persist progress
  const currentPuzzleIdRef = useRef<string>('');
  // Track the original board string (for persistence)
  const currentPuzzleStringRef = useRef<string>('');

  // ── Internal: convert CellData[] → SerializedCell[] for persistence ──────
  const serialize = (board: CellData[]): SerializedCell[] =>
    board.map(c => ({
      value: c.value,
      fixed: c.fixed,
      notes: c.notes,
      error: c.error,
      isHint: c.isHint,
      isCorrect: c.isCorrect,
    }));

  // ── Auto-persist whenever board / time / mistakes change ─────────────────

  const persistRef = useRef<(() => void) | null>(null);
  persistRef.current = () => {
    if (!state.isPlaying || !currentPuzzleIdRef.current) return;
    persistProgress(
      state.difficulty,
      currentPuzzleIdRef.current,
      currentPuzzleStringRef.current,
      state.solution,
      serialize(state.board),
      state.timeElapsed,
      state.mistakeCount,
      state.history.map(h => ({ board: serialize(h.board) })),
    );
  };

  useEffect(() => {
    persistRef.current?.();
  }, [state.board, state.timeElapsed, state.mistakeCount]);

  // ── generateBoard: internal fallback (uses random JSON puzzle) ─────────────
  const generateBoard = useCallback((difficulty: Difficulty) => {
    const puzzles = difficultyData[difficulty].puzzles;
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    const rawBoard: CellData[] = randomPuzzle.board.split('').map((char: string) => {
      const val = parseInt(char, 10);
      return {
        value: val === 0 ? null : val,
        fixed: val !== 0,
        notes: [],
        error: false,
        isHint: false
      };
    });

    const newBoard = recomputeErrors(rawBoard);
    currentPuzzleIdRef.current = randomPuzzle.id;
    currentPuzzleStringRef.current = randomPuzzle.board;

    setState(prev => ({
      ...prev,
      board: newBoard,
      selectedCell: null,
      notesMode: false,
      difficulty,
      history: [],
      timeElapsed: 0,
      isPlaying: true,
      isPaused: false,
      solution: randomPuzzle.solution,
      mistakeCount: 0
    }));
  }, []);

  /**
   * loadPuzzle — primary entry point used by useDynamicPuzzle integration.
   *
   * @param puzzleString  81-char board string (0 = empty)
   * @param solution      81-char solution string
   * @param difficulty    Game difficulty label
   * @param puzzleId      Stable ID for persistence
   * @param snapshot      Optional saved CellData snapshot (for resume)
   * @param savedTime     Previously elapsed seconds (for resume)
   * @param savedMistakes Previously counted mistakes (for resume)
   * @param savedHistory  Previously accumulated undo history (for resume)
   */
  const loadPuzzle = useCallback((
    puzzleString: string,
    solution: string,
    difficulty: Difficulty,
    puzzleId: string,
    snapshot?: SerializedCell[] | null,
    savedTime = 0,
    savedMistakes = 0,
    savedHistory: { board: SerializedCell[] }[] = [],
  ) => {
    currentPuzzleIdRef.current = puzzleId;
    currentPuzzleStringRef.current = puzzleString;

    let board: CellData[];

    if (snapshot && snapshot.length === 81) {
      board = recomputeErrors(
        snapshot.map(c => ({
          value: c.value,
          fixed: c.fixed,
          notes: c.notes,
          error: false,
          isHint: c.isHint ?? false,
          isCorrect: (c as CellData).isCorrect ?? false,
        }))
      );
    } else {
      board = recomputeErrors(
        puzzleString.split('').map(char => {
          const val = parseInt(char, 10);
          return { value: val === 0 ? null : val, fixed: val !== 0, notes: [], error: false, isHint: false, isCorrect: false };
        })
      );
    }
    
    const history: { board: CellData[] }[] = savedHistory.map(h => ({
      board: h.board.map(c => ({
        value: c.value,
        fixed: c.fixed,
        notes: c.notes,
        error: c.error,
        isHint: c.isHint ?? false,
        isCorrect: (c as CellData).isCorrect ?? false,
      }))
    }));

    setState(prev => ({
      ...prev,
      board,
      selectedCell: null,
      notesMode: false,
      difficulty,
      history,
      timeElapsed: savedTime,
      isPlaying: true,
      isPaused: false,
      solution,
      mistakeCount: savedMistakes,
    }));
  }, []);

  useEffect(() => {
    // On first mount, don't auto-generate — App will call loadPuzzle via
    // useDynamicPuzzle.  generateBoard is kept as a safe internal fallback.
    // We do nothing here to avoid double-loading.
  }, []);

  useEffect(() => {
    if (!state.isPlaying || state.isPaused) return;
    const timer = window.setInterval(() => {
      setState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.isPlaying, state.isPaused]);

  const stopGame = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
  }, []);

  const selectCell = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedCell: index }));
  }, []);

  const toggleNotesMode = useCallback(() => {
    setState(prev => ({ ...prev, notesMode: !prev.notesMode }));
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused, selectedCell: null }));
  }, []);

  const inputNumber = useCallback((num: number) => {
    setState(prev => {
      if (prev.selectedCell === null || prev.isPaused) return prev;
      const cell = prev.board[prev.selectedCell];
      if (cell.fixed || cell.isHint || cell.isCorrect) return prev;

      const newBoard = prev.board.map(c => ({ ...c }));

      if (prev.notesMode) {
        // ── Notes mode ──────────────────────────────────────────────────────
        const target = newBoard[prev.selectedCell];
        if (target.notes.includes(num)) {
          target.notes = target.notes.filter(n => n !== num);
        } else {
          target.notes = [...target.notes, num].sort((a, b) => a - b);
        }
        target.value = null;
        target.error = false;
        return {
          ...prev,
          board: newBoard,
          history: [...prev.history, { board: prev.board }]
        };
      }

      // ── Normal mode ────────────────────────────────────────────────────────
      const target = newBoard[prev.selectedCell];
      const prevValue = target.value;

      if (target.value === num) {
        target.value = null;
        target.notes = [];
        target.error = false;
      } else {
        target.value = num;
        target.notes = [];
        [...allPeers(prev.selectedCell)].forEach(peerIdx => {
          newBoard[peerIdx] = {
            ...newBoard[peerIdx],
            notes: newBoard[peerIdx].notes.filter(n => n !== num)
          };
        });
      }

      const finalBoard = recomputeErrors(newBoard);

      const correctValue = prev.solution ? parseInt(prev.solution[prev.selectedCell], 10) : null;
      if (correctValue !== null && target.value === correctValue) {
        finalBoard[prev.selectedCell] = {
          ...finalBoard[prev.selectedCell],
          isCorrect: true,
        };
      }

      const isNewMistake =
        correctValue !== null &&
        target.value !== null &&
        target.value !== correctValue &&
        prevValue !== num;

      return {
        ...prev,
        board: finalBoard,
        history: [...prev.history, { board: prev.board }],
        mistakeCount: isNewMistake ? prev.mistakeCount + 1 : prev.mistakeCount
      };
    });
  }, []);

  const erase = useCallback(() => {
    setState(prev => {
      if (prev.selectedCell === null || prev.isPaused) return prev;
      const cell = prev.board[prev.selectedCell];
      if (cell.fixed || cell.isHint || cell.isCorrect) return prev;

      const newBoard = prev.board.map(c => ({ ...c }));
      newBoard[prev.selectedCell] = {
        ...newBoard[prev.selectedCell],
        value: null,
        notes: [],
        error: false
      };

      const finalBoard = recomputeErrors(newBoard);
      return {
        ...prev,
        board: finalBoard,
        history: [...prev.history, { board: prev.board }]
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0 || prev.isPaused) return prev;
      const previousBoard = prev.history[prev.history.length - 1].board;
      return {
        ...prev,
        board: previousBoard,
        history: prev.history.slice(0, -1)
      };
    });
  }, []);

  const hint = useCallback(() => {
    setState(prev => {
      if (prev.selectedCell === null || prev.isPaused) return prev;
      const cell = prev.board[prev.selectedCell];
      if (cell.fixed || cell.isHint || cell.isCorrect) return prev;

      const correctValue = parseInt(prev.solution[prev.selectedCell], 10);
      if (isNaN(correctValue)) return prev;

      const newBoard = prev.board.map(c => ({ ...c }));

      
      newBoard[prev.selectedCell] = {
        ...newBoard[prev.selectedCell],
        value: correctValue,
        notes: [],
        error: false,
        isHint: true
      };

      [...allPeers(prev.selectedCell)].forEach(peerIdx => {
        const peer = newBoard[peerIdx];
        if (!peer.fixed && !peer.isHint && peer.value === correctValue) {
          newBoard[peerIdx] = { ...peer, value: null, notes: [], error: false };
        } else {
          newBoard[peerIdx] = {
            ...newBoard[peerIdx],
            notes: newBoard[peerIdx].notes.filter(n => n !== correctValue)
          };
        }
      });

      const finalBoard = recomputeErrors(newBoard);
      return {
        ...prev,
        board: finalBoard,
        history: [...prev.history, { board: prev.board }]
      };
    });
  }, []);

  const changeDifficulty = useCallback((diff: Difficulty) => {
    generateBoard(diff);
  }, [generateBoard]);

  const restartPuzzle = useCallback(() => {
    setState(prev => {
      if (!prev.isPlaying) return prev;
      const newBoard = prev.board.map(c => ({
        ...c,
        value: c.fixed ? c.value : null,
        notes: [],
        error: false,
        isHint: false,
        isCorrect: false
      }));

      return {
        ...prev,
        board: newBoard,
        selectedCell: null,
        history: [],
        timeElapsed: 0,
        mistakeCount: 0,
        isPaused: false
      };
    });
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isComplete =
    state.isPlaying &&
    state.board.every(cell => cell.value !== null) &&
    state.board.every(cell => !cell.error);

  const peerIndices: Set<number> =
    state.selectedCell !== null ? allPeers(state.selectedCell) : new Set();

  return {
    state,
    isComplete,
    peerIndices,
    selectCell,
    inputNumber,
    erase,
    undo,
    hint,
    toggleNotesMode,
    togglePause,
    changeDifficulty,
    formatTime,
    generateBoard,
    loadPuzzle,
    stopGame,
    restartPuzzle
  };
}
