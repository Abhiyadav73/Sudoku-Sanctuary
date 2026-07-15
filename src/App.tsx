import { useEffect, useRef, useState } from 'react';
import { useSudoku, type Difficulty } from './useSudoku';
import { useTheme } from './useTheme';
import { useTime } from './useTime';
import { useLeaderboard } from './useLeaderboard';
import { useStats } from './useStats';
import { usePointSystem } from './usePointSystem';
import type { FloatingPoint } from './usePointSystem';
import Leaderboard from './Leaderboard';
import Settings from './Settings';
import Stats from './Stats';
import HowToPlay from './HowToPlay';
import CircularTrail from './Components/Circulartrail';
import LoadingSpinner from './Components/LoadingSpinner';
import AnimatedDivider from './Components/AnimatedDivider';
import WinnerCard from './Components/WinnerCard';
import Indicator from './Components/Indicator';
import WelcomeScreen from './WelcomeScreen';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import DailyChallenges from './DailyChallenges';
import { AnimatePresence } from "framer-motion";
import PageTransition from "./Components/PageTransition";
import tips from '../tips.json';
import { useGameSounds } from './useGameSounds';
import {
  resumeOrStartGame,
  startNewGame,
  getDailyChallenge,
  clearGameProgress,
  isDailyChallengeCompleted,
  markDailyChallengeCompleted,
} from './useDynamicPuzzle';
import React from 'react';


function App() {
  const {
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
    formatTime,
    loadPuzzle,
    stopGame,
    restartPuzzle
  } = useSudoku();

  const { theme, setTheme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [randomTip, _] = useState(tips[Math.floor(Math.random() * tips.length)]);
  //const [resetCount, setResetCount] = useState(0)
  //const [hintUsed, setHintUsed] = useState(0)

  useEffect(() => {
    stopGame();
    const timer = setTimeout(() => {
      const { puzzle, progress } = resumeOrStartGame('easy');
      loadPuzzle(
        puzzle.puzzle,
        puzzle.solution,
        puzzle.difficulty,
        puzzle.id,
        progress?.boardSnapshot,
        progress?.timeElapsed ?? 0,
        progress?.mistakeCount ?? 0,
        progress?.history ?? [],
      );
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mistake limit (persisted) ──────────────────────────────────────────────
  const [mistakeLimitEnabled, setMistakeLimitEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-mistake-limit') !== 'false'; } catch { return true; }
  });
  const handleMistakeLimitChange = (v: boolean) => {
    setMistakeLimitEnabled(v);
    try { localStorage.setItem('sudoku-mistake-limit', String(v)); } catch { }
  };

  // ── Point system (active only in 3-mistake mode) ───────────────────────────
  const {
    score,
    floatingPoints,
    registerAction,
    calculateFinalScore,
    resetPoints,
    isActive: pointsActive,
  } = usePointSystem(state.difficulty, mistakeLimitEnabled);

  const { entries, addEntry, clearLeaderboard, currentStreak } = useLeaderboard();
  const { stats, recordWin, recordLoss, totalPlayed, totalWins, totalLosses, clearStats } = useStats();
  const localUser = useTime();

  const handleRestart = () => {
    restartPuzzle();
    resetPoints();
  };



  // ── Trail / border settings ────────────────────────────────────────────────
  const [trailEnabled, setTrailEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-trail-enabled') !== 'false'; } catch { return true; }
  });
  const handleTrailEnabledChange = (v: boolean) => {
    setTrailEnabled(v);
    try { localStorage.setItem('sudoku-trail-enabled', String(v)); } catch { }
  };

  const [difficultyBorderEnabled, setDifficultyBorderEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-difficulty-border') !== 'false'; } catch { return true; }
  });
  const handleDifficultyBorderChange = (v: boolean) => {
    setDifficultyBorderEnabled(v);
    try { localStorage.setItem('sudoku-difficulty-border', String(v)); } catch { }
  };

  const [boardBgEnabled, setBoardBgEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-board-bg') !== 'false'; } catch { return true; }
  });
  const handleBoardBgChange = (v: boolean) => {
    setBoardBgEnabled(v);
    try { localStorage.setItem('sudoku-board-bg', String(v)); } catch { }
  };

  const [appBgEnabled, setAppBgEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-app-bg') !== 'false'; } catch { return true; }
  });
  const handleAppBgChange = (v: boolean) => {
    setAppBgEnabled(v);
    try { localStorage.setItem('sudoku-app-bg', String(v)); } catch { }
  };

  const [footerBgEnabled, setFooterBgEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-footer-bg') !== 'false'; } catch { return true; }
  });
  const handleFooterBgChange = (v: boolean) => {
    setFooterBgEnabled(v);
    try { localStorage.setItem('sudoku-footer-bg', String(v)); } catch { }
  };

  const [mobileNavEnabled, setMobileNavEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-mobile-nav') === 'true'; } catch { return false; }
  });
  const handleMobileNavEnabledChange = (v: boolean) => {
    setMobileNavEnabled(v);
    try { localStorage.setItem('sudoku-mobile-nav', String(v)); } catch { }
  };

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-sound-enabled') !== 'false'; } catch { return true; }
  });
  const handleSoundEnabledChange = (v: boolean) => {
    setSoundEnabled(v);
    try { localStorage.setItem('sudoku-sound-enabled', String(v)); } catch { }
  };

  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('sudoku-music-enabled') !== 'false'; } catch { return true; }
  });
  const handleMusicEnabledChange = (v: boolean) => {
    setMusicEnabled(v);
    try { localStorage.setItem('sudoku-music-enabled', String(v)); } catch { }
  };

  const {
    cellNumFillSound,
    cellNumWrongSound,
    buttonClick,
    gameLoss,
    gameWin
  } = useGameSounds(soundEnabled, musicEnabled);

  const difficultyBorderStyle: Record<string, { border: string; boxShadow: string }> = {
    easy: { border: '2.5px solid #22c55e', boxShadow: '0 0 0 4px rgba(34,197,94,0.18), 14px -13px 24px 4px rgba(34,197,94,0.13)' },
    medium: { border: '2.5px solid #eab308', boxShadow: '0 0 0 4px rgba(234,179,8,0.18),  14px -13px 24px 4px rgba(234,179,8,0.13)' },
    hard: { border: '2.5px solid #ef4444', boxShadow: '0 0 0 4px rgba(239,68,68,0.18),  14px -13px 24px 4px rgba(239,68,68,0.13)' },
    expert: { border: '2.5px solid #3b82f6', boxShadow: '0 0 0 4px rgba(59,130,246,0.18), 14px -13px 24px 4px rgba(59,130,246,0.13)' },
  };

  const activeBorderStyle = difficultyBorderEnabled
    ? difficultyBorderStyle[state.difficulty] ?? {}
    : {};

  // ── UI state ───────────────────────────────────────────────────────────────
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const gameOverHandled = useRef(false);

  // Completion flow
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const completionHandled = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [showCasualCongrats, setShowCasualCongrats] = useState(false);


  // ── Fullscreen state ───────────────────────────────────────────────────────
  const [, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // ── New-game helper: reset points + load puzzle via useDynamicPuzzle ────────
  const handleGenerateBoard = (diff: Difficulty) => {
    resetPoints();
    setIsLoading(true);
    setTimeout(() => {
      const puzzle = startNewGame(diff);
      loadPuzzle(puzzle.puzzle, puzzle.solution, puzzle.difficulty, puzzle.id);
      setIsLoading(false);
    }, 600);
  };

  // ── Resume game for a difficulty (used when switching difficulty) ──────────
  const handleResumeOrStart = (diff: Difficulty) => {
    resetPoints();
    setIsLoading(true);
    setTimeout(() => {
      const { puzzle, progress } = resumeOrStartGame(diff);
      loadPuzzle(
        puzzle.puzzle,
        puzzle.solution,
        puzzle.difficulty,
        puzzle.id,
        progress?.boardSnapshot,
        progress?.timeElapsed ?? 0,
        progress?.mistakeCount ?? 0,
        progress?.history ?? [],
      );
      setIsLoading(false);
    }, 600);
  };

  // ── Daily Challenge ───────────────────────────────────────────────────────
  const isDailyPlayingRef = React.useRef(false);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState<boolean>(
    () => isDailyChallengeCompleted()
  );

  const handleDailyChallenge = () => {
    resetPoints();
    isDailyPlayingRef.current = true;
    setIsLoading(true);
    setTimeout(() => {
      const puzzle = getDailyChallenge();
      loadPuzzle(puzzle.puzzle, puzzle.solution, puzzle.difficulty, puzzle.id);
      setIsLoading(false);
    }, 600);
  };

  // ── Puzzle completion ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isComplete && !completionHandled.current) {
      completionHandled.current = true;
      stopGame();
      gameWin();
      const fs = calculateFinalScore(state.timeElapsed);
      setFinalScore(fs);

      if (isDailyPlayingRef.current) {
        markDailyChallengeCompleted();
        setDailyChallengeCompleted(true);
        isDailyPlayingRef.current = false;
      }

      if (!mistakeLimitEnabled) {
        recordWin(state.difficulty);
        clearGameProgress(state.difficulty);
        setTimeout(() => {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            setShowCasualCongrats(true);
          }, 800);
        }, 400);
      } else {

        setTimeout(() => {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            setShowCompletionModal(true);
            setTimeout(() => nameInputRef.current?.focus(), 100);
          }, 800);
        }, 400);
      }
    }
    if (!isComplete) {
      completionHandled.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  // ── 3-mistake game-over ────────────────────────────────────────────────────
  useEffect(() => {
    if (
      mistakeLimitEnabled &&
      state.mistakeCount >= 3 &&
      state.isPlaying &&
      !gameOverHandled.current
    ) {
      gameOverHandled.current = true;
      stopGame();
      gameLoss();
      recordLoss(state.difficulty);
      setShowGameOver(true);
    }
    if (!state.isPlaying) {
      gameOverHandled.current = false;
    }
  }, [state.mistakeCount, state.isPlaying, mistakeLimitEnabled, recordLoss, state.difficulty, stopGame]);

  // ── Submit completion score ────────────────────────────────────────────────
  const handleSubmitScore = () => {
    const diff = state.difficulty;
    addEntry(playerName, diff, state.timeElapsed, pointsActive ? finalScore : 0);
    recordWin(diff);
    
    clearGameProgress(diff);
    setShowCompletionModal(false);
    setPlayerName('');
    setShowLeaderboard(true);
    handleGenerateBoard(diff);
  };

  // ── Helper for Point Animation ─────────────────────────────────────────────
  const getCellCenter = (index: number | null) => {
    if (index === null) return undefined;
    const el = document.getElementById(`sudoku-cell-${index}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return undefined;
  };

  // ── Hint wrapper ──────────────────────────────────────────────────────────
  const handleHint = () => {
    registerAction('major_hint', getCellCenter(state.selectedCell));
    hint();
  };

  // ── Keyboard support ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCompletionModal || showLeaderboard || showSettings || showHowToPlay || state.isPaused) return;
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10);
        const numCount = state.board.filter(cell => cell.value === num).length;
        if (numCount >= 9) return;
        if (state.selectedCell !== null && state.solution && !state.notesMode) {
          const correctVal = parseInt(state.solution[state.selectedCell], 10);
          const currentVal = state.board[state.selectedCell].value;
          if (num !== currentVal) {
            if (num === correctVal) {
              registerAction('correct_cell', getCellCenter(state.selectedCell));
              cellNumFillSound();
            } else {
              registerAction('mistake');
              cellNumWrongSound();
            }
          }
        }
        inputNumber(num);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        erase();
      } else if (e.key === 'n' || e.key === 'N') {
        toggleNotesMode();
      } else if (e.key === 'ArrowUp') {
        if (state.selectedCell !== null && state.selectedCell >= 9)
          selectCell(state.selectedCell - 9);
      } else if (e.key === 'ArrowDown') {
        if (state.selectedCell !== null && state.selectedCell <= 71)
          selectCell(state.selectedCell + 9);
      } else if (e.key === 'ArrowLeft') {
        if (state.selectedCell !== null && state.selectedCell % 9 !== 0)
          selectCell(state.selectedCell - 1);
      } else if (e.key === 'ArrowRight') {
        if (state.selectedCell !== null && state.selectedCell % 9 !== 8)
          selectCell(state.selectedCell + 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    state.selectedCell, state.solution, state.notesMode, state.board, state.isPaused,
    inputNumber, erase, toggleNotesMode, selectCell, registerAction,
    showCompletionModal, showLeaderboard, showSettings, showHowToPlay,
  ]);

  const handleDifficultyChange = (diff: Difficulty) => {
    handleResumeOrStart(diff);
    setIsDifficultyDropdownOpen(false);
  };

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const boardbg = ["sudBod2.png", "SudokuBoard.jpeg", "sudboard3.png"]

  const [bgImage] = useState(
    () => boardbg[Math.floor(Math.random() * boardbg.length)]
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {trailEnabled && <CircularTrail />}

      {/* ── Global floating point labels (portal-style, fixed position) ── */}
      {floatingPoints.map((fp: FloatingPoint) => (
        <span
          key={fp.id}
          className={`floating-point-label ${fp.points >= 0 ? 'positive' : 'negative'}`}
          style={{ left: fp.x, top: fp.y }}
        >
          {fp.points >= 0 ? `+${fp.points}` : fp.points}
        </span>
      ))}

      {/*Routes*/}


      {/* ── Modals ── */}
      <AnimatePresence>
        {showHowToPlay && (
          <PageTransition key="howToPlay" className="fixed inset-0 z-100">
            <HowToPlay
              onClose={() => setShowHowToPlay(false)}
              onShowLeaderboard={() => setShowLeaderboard(true)}
              onShowStats={() => setShowStats(true)}
              onShowSettings={() => setShowSettings(true)}
              onShowPrivacy={() => { setShowHowToPlay(false); setShowPrivacy(true); }}
              onShowTerms={() => { setShowHowToPlay(false); setShowTerms(true); }}
              footerBgEnabled={footerBgEnabled}
              isDark={isDark}
            />
          </PageTransition>
        )}
        {showPrivacy && (
          <PageTransition key="privacy" className="fixed inset-0 z-100">
            <PrivacyPolicy
              onClose={() => setShowPrivacy(false)}
              onShowHowToPlay={() => { setShowPrivacy(false); setShowHowToPlay(true); }}
              onShowStats={() => setShowStats(true)}
              onShowSettings={() => setShowSettings(true)}
              onShowTerms={() => { setShowPrivacy(false); setShowTerms(true); }}
              onShowPrivacy={() => { setShowPrivacy(false); setShowPrivacy(true); }}
              footerBgEnabled={footerBgEnabled}
              isDark={isDark}
            />
          </PageTransition>
        )}

        {showDaily && (
          <PageTransition key="daily" className="fixed inset-0 z-100">
            <DailyChallenges
              onClose={() => setShowDaily(false)}
              onShowHowToPlay={() => { setShowDaily(false); setShowHowToPlay(true); }}
              onShowStats={() => setShowStats(true)}
              onShowSettings={() => setShowSettings(true)}
              onShowPrivacy={() => { setShowDaily(false); setShowPrivacy(true); }}
              onShowTerms={() => { setShowDaily(false); setShowTerms(true); }}
              footerBgEnabled={footerBgEnabled}
              appBgEnabled={appBgEnabled}
              isDark={isDark}
              currentStreak={currentStreak}
              dailyChallengeCompleted={dailyChallengeCompleted}
              onShowDailyChallenge={() => {
                setShowDaily(false);
                handleDailyChallenge();
              }}
            />
          </PageTransition> 
        )}
        {showTerms && (
          <PageTransition key="terms" className="fixed inset-0 z-100">
            <TermsOfService
              onClose={() => setShowTerms(false)}
              onShowHowToPlay={() => { setShowTerms(false); setShowHowToPlay(true); }}
              onShowStats={() => setShowStats(true)}
              onShowSettings={() => setShowSettings(true)}
              onShowTerms={() => { setShowTerms(false); setShowTerms(true); }}
              onShowPrivacy={() => { setShowTerms(false); setShowPrivacy(true); }}
              footerBgEnabled={footerBgEnabled}
              isDark={isDark}
            />
          </PageTransition>
        )}
      </AnimatePresence>

      {/* ── Overlays (can overlap with main pages) ── */}
      <AnimatePresence>
        {showLeaderboard && (
          <PageTransition key="leaderboard" className="fixed inset-0 z-100">
            <Leaderboard
              entries={entries}
              onClose={() => setShowLeaderboard(false)}
              onClear={clearLeaderboard}
            />
          </PageTransition>
        )}
        {showSettings && (
          <PageTransition key="settings" className="fixed inset-0 z-100">
            <Settings
              theme={theme}
              onThemeChange={setTheme}
              mistakeLimitEnabled={mistakeLimitEnabled}
              onMistakeLimitChange={handleMistakeLimitChange}
              trailEnabled={trailEnabled}
              onTrailEnabledChange={handleTrailEnabledChange}
              difficultyBorderEnabled={difficultyBorderEnabled}
              onDifficultyBorderChange={handleDifficultyBorderChange}
              boardBgEnabled={boardBgEnabled}
              onBoardBgChange={handleBoardBgChange}
              appBgEnabled={appBgEnabled}
              onAppBgChange={handleAppBgChange}
              footerBgEnabled={footerBgEnabled}
              onFooterBgChange={handleFooterBgChange}
              mobileNavEnabled={mobileNavEnabled}
              onMobileNavEnabledChange={handleMobileNavEnabledChange}
              soundEnabled={soundEnabled}
              onSoundEnabledChange={handleSoundEnabledChange}
              musicEnabled={musicEnabled}
              onMusicEnabledChange={handleMusicEnabledChange}
              onClose={() => setShowSettings(false)}
            />
          </PageTransition>
        )}
      </AnimatePresence>
      {showStats && (
        <Stats
          stats={stats}
          totalPlayed={totalPlayed}
          totalWins={totalWins}
          totalLosses={totalLosses}
          onClose={() => setShowStats(false)}
          onClear={clearStats}
        />
      )}

      {/* ── Game Over modal ── */}
      {showGameOver && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          style={{ background: 'rgba(25,28,30,0.85)', backdropFilter: 'blur(10px)' }}
        >
          <div className="bg-surface-container-low w-full max-w-md rounded-4xl shadow-[0_40px_80px_rgba(25,28,30,0.3)] overflow-hidden">
            {/* Red header */}
            <div className="bg-linear-to-br from-red-700 to-red-400 px-8 pt-10 pb-8 text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-white/25 text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-extrabold text-white font-headline">Game Over!</h2>
              <p className="text-white/70 font-label text-sm mt-1">
                {state.difficulty.toUpperCase()} · {formatTime(state.timeElapsed)}
              </p>
            </div>
            {/* Body */}
            <div className="px-8 py-8 flex flex-col gap-3">
              <p className="text-center text-sm font-label text-on-surface-variant mb-2">
                You made <span className="font-bold text-red-500">3 mistakes</span> — better luck next time!
              </p>
              <button
                onClick={() => {
                  setShowGameOver(false);
                  gameOverHandled.current = false;
                  clearGameProgress(state.difficulty);
                  handleGenerateBoard(state.difficulty);
                }}
                className="w-full py-3.5 rounded-xl font-label font-bold text-sm bg-linear-to-r from-primary to-primary-container text-on-primary shadow-[0_8px_16px_rgba(53,37,205,0.25)] hover:shadow-[0_12px_24px_rgba(53,37,205,0.35)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Try Again
              </button>
              {/*<button
                onClick={() => { setShowGameOver(false); gameOverHandled.current = false; setShowStats(true); }}
                className="w-full py-3 rounded-xl font-label font-bold text-sm text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-highest transition-all duration-300"
              >
                View Stats
              </button>*/}
            </div>
          </div>
        </div>
      )}

      {/* ── Completion modal ── */}
      {showCompletionModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          style={{ background: 'rgba(25,28,30,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div className="bg-surface-container-low w-full max-w-md rounded-4xl shadow-[0_40px_80px_rgba(25,28,30,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Celebration header / Winner Card */}
            <div className="overflow-y-auto scrollbar-hide flex-1 flex flex-col items-center pt-8 pb-2 bg-linear-to-br from-surface-container-low to-surface-container-lowest">
              <h2 className="text-2xl font-extrabold text-on-surface font-headline mb-2">Puzzle Solved! 🎉</h2>
              <div className="w-full">
                <WinnerCard
                  name={playerName || "Your Name"}
                  score={pointsActive ? finalScore : 0}
                  time={state.timeElapsed}
                  mode={state.difficulty}
                />
              </div>
            </div>
            {/* Name entry */}
            <div className="px-8 pb-8 pt-4">
              <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                Enter your name for the leaderboard
              </p>
              <input
                ref={nameInputRef}
                type="text"
                maxLength={24}
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmitScore()}
                placeholder="Your name..."
                className="w-full bg-surface-container-highest text-on-surface font-label font-medium px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-on-surface-variant/50 transition-all duration-300"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    recordWin(state.difficulty);
                    clearGameProgress(state.difficulty);
                    setShowCompletionModal(false);
                    setPlayerName('');
                    handleGenerateBoard(state.difficulty);
                  }}
                  className="flex-1 py-3 rounded-xl font-label font-bold text-sm text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-highest transition-all duration-300"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmitScore}
                  className="flex-1 py-3 rounded-xl font-label font-bold text-sm bg-linear-to-r from-primary to-primary-container text-on-primary shadow-[0_8px_16px_rgba(53,37,205,0.25)] hover:shadow-[0_12px_24px_rgba(53,37,205,0.35)] active:scale-95 transition-all duration-300"
                >
                  Save Score
                </button>
              </div>
              <button
                onClick={() => { recordWin(state.difficulty); clearGameProgress(state.difficulty); setShowCompletionModal(false); setPlayerName(''); handleGenerateBoard(state.difficulty); }}
                className="w-full mt-3 py-3 rounded-xl font-label font-bold text-sm text-primary hover:bg-primary/5 transition-all duration-300"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Casual Congrats modal (no-mistake mode) ── */}
      {showCasualCongrats && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          style={{ background: 'rgba(25,28,30,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div className="bg-surface-container-low w-full max-w-sm rounded-4xl shadow-[0_40px_80px_rgba(25,28,30,0.25)] overflow-hidden text-center">
            <div className="bg-linear-to-br from-emerald-600 to-emerald-400 px-8 pt-10 pb-8">
              <span className="text-6xl mb-3 block">🎉</span>
              <h2 className="text-2xl font-extrabold text-white font-headline">Congratulations!</h2>
              <p className="text-white/80 font-label text-sm mt-2">
                {state.difficulty.toUpperCase()} · {formatTime(state.timeElapsed)}
              </p>
            </div>
            <div className="px-8 py-8 flex flex-col gap-3">
              <p className="text-sm font-label text-on-surface-variant mb-2">
                You solved it flawlessly! No mistakes at all.
              </p>
              <button
                onClick={() => {
                  setShowCasualCongrats(false);
                  handleGenerateBoard(state.difficulty);
                }}
                className="w-full py-3.5 rounded-xl font-label font-bold text-sm bg-linear-to-r from-primary to-primary-container text-on-primary shadow-[0_8px_16px_rgba(53,37,205,0.25)] hover:shadow-[0_12px_24px_rgba(53,37,205,0.35)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}


      {!hasStarted ? (
        <WelcomeScreen
          onStart={() => {
            handleGenerateBoard(state.difficulty);
            setHasStarted(true);
          }}
          onSettings={() => setShowSettings(true)}
          onHowToPlay={() => setShowHowToPlay(true)}
          onPrivacy={() => setShowPrivacy(true)}
          onTerms={() => setShowTerms(true)}
          onStats={() => setShowStats(true)}
          footerBgEnabled={footerBgEnabled}
          isDark={isDark}
        />
      ) : (
        <div className={`font-body text-on-surface min-h-screen flex flex-col overflow-x-hidden relative ${appBgEnabled ? 'bg-transparent' : 'bg-surface'}`}>
          {appBgEnabled && (
            <>
              {/* Solid base behind image */}
              <div className="fixed inset-0 bg-surface z-[-2]" />
              {/* Background image */}
              <div
                className="fixed inset-0 pointer-events-none z-[-1]"
                style={{
                  backgroundImage: "url('/bg.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: isDark ? 0.15 : 0.25,
                  mixBlendMode: isDark ? 'screen' : 'multiply',
                }}
              />
            </>
          )}
          {/* ── Top Navigation Bar ── */}
          <Indicator />
          <header className="bg-surface/80 backdrop-blur-lg top-0 z-51 fixed w-full ">
            <div className="flex justify-between items-center w-full px-4 sm:px-10 py-4 sm:py-6 max-w-[1440px] mx-auto">
              <div className="flex items-center gap-4 sm:gap-12">
                <div className="flex item-stretch gap-2 font-headline">
                  {/* The vertical bar */}
                  <div className=" hidden w-1.5 bg-[#ff0099] rounded-full shrink-0" />

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1.5 text-xl sm:text-2xl font-extrabold tracking-tight">
                    <span className="bigbesty"><span className='text-2xl'>S</span>udoku</span>
                    <span className="text-[#ff0099]  sm:text-2xl bigbesty">
                      Sanctuary
                    </span>
                  </div>
                </div>
                <nav className="hidden lg:flex gap-8">
                  {/* <a className="text-primary font-bold font-label text-sm tracking-[0.05em] uppercase" href="#">Play</a> */}
                  <button
                    onClick={() => setShowStats(true)}
                    className="nav-link-underline text-on-surface-variant font-label text-sm tracking-wider hover:text-primary transition-colors duration-300 cursor-pointer"
                  >
                    <span className='titillium-web-regular text-lg font-semibold'>Stats</span>
                  </button>

                  <button
                    onClick={() => setShowHowToPlay(true)}
                    className="nav-link-underline text-on-surface-variant font-label text-sm tracking-wider hover:text-primary transition-colors duration-300 cursor-pointer"
                  >
                    <span className='titillium-web-regular text-lg font-semibold'>How to Play <big>?</big></span>
                  </button>


                </nav>
              </div>
              <div className="flex items-center gap-2 sm:gap-6">
                <button
                  onClick={() => { buttonClick(); setShowLeaderboard(true); }}
                  className="hidden sm:block material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-highest p-1.5 sm:p-2.5 rounded-full transition-all duration-300 scale-95 active:scale-90 cursor-pointer hover:animate-shakeTrophy"
                >
                  emoji_events
                </button>
                <button
                  onClick={() => { buttonClick(); setShowSettings(true); }}
                  className="hidden sm:block material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-highest p-1.5 sm:p-2.5 rounded-full transition-all duration-300 scale-95 hover:rotate-90 active:scale-90 cursor-pointer"
                  title="Settings"
                >
                  settings
                </button>
                <div className=" hidden  flex-col items-center">
                  <span className="text-lg font-bold text-primary">
                    🔥 {currentStreak}
                  </span>
                </div>

                {/*<button
                  onClick={toggleFullScreen}
                  className=" hidden sm:block material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-highest p-1.5 sm:p-2.5 rounded-full transition-all duration-300 scale-95 active:scale-90 cursor-pointer"
                  title={isFullscreen ? 'Exit Full Screen (f)' : 'Full Screen (f)'}
                >
                  {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                </button>*/}

                {/*<button
                  onClick={() => handleGenerateBoard(state.difficulty)}
                  className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-label text-sm font-bold tracking-[0.05em] uppercase px-8 py-3 rounded-full shadow-[0_8px_16px_rgba(53,37,205,0.2)] hover:shadow-[0_12px_24px_rgba(53,37,205,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"  
                >
                  New Game
                </button>*/}
                <button
                  onClick={() => {
                    buttonClick();
                    handleGenerateBoard(state.difficulty);
                  }}
                  className="outline-none appearance-none inline-flex border-2 border-transparent hover:border-white transition-all duration-400 items-center justify-between min-w-[120px] sm:min-w-[200px] rounded-[6px] bg-linear-to-r from-[#3525cd] to-[#dad7ff] px-3 sm:px-5 py-2 sm:py-4 text-white text-[12px] sm:text-[14px] font-semibold uppercase tracking-[1.2px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden hover:opacity-95 hover:from-green-500 hover:to-green-200"
                >
                  <span className="inline-block animate-ripple" />
                  <span>New Game</span>
                  <span className="size-0" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 md:mt-10 gap-6 sm:gap-10 mt-6">

            {/* ── Left: Game Controls ── */}
            <aside className="hidden lg:flex flex-col gap-6 p-8 bg-surface-container-low w-72 shrink-0 h-fit rounded-4xl relative">
              <div>
                <h2 className="text-lg font-bold text-primary font-headline">Game Controls</h2>
                <p className="text-xs text-on-surface-variant font-medium tracking-tight">The Sanctuary</p>
              </div>

              <div className="flex flex-col gap-2 relative">
                {/* Difficulty dropdown */}
                <button
                  onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
                  className="bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 flex items-center justify-between font-label font-medium transition-all duration-300 hover:bg-surface-dim"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">equalizer</span>
                    <span className="capitalize">{state.difficulty}</span>
                  </div>
                  <span className="material-symbols-outlined">{isDifficultyDropdownOpen ? 'expand_less' : 'expand_more'}</span>
                </button>

                {isDifficultyDropdownOpen && (
                  <div className="absolute top-14 left-0 w-full bg-surface-container-highest rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] z-50 overflow-hidden backdrop-blur-md">
                    {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(diff => (
                      <button
                        key={diff}
                        onClick={() => handleDifficultyChange(diff)}
                        className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors capitalize text-on-surface font-label font-medium"
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                )}

                <button onClick={undo} className="text-on-surface-variant font-label px-4 py-3 flex items-center gap-3 font-medium hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all duration-300">
                  <span className="material-symbols-outlined">undo</span>
                  Undo
                </button>
                <button onClick={erase} className="text-on-surface-variant font-label px-4 py-3 flex items-center gap-3 font-medium hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all duration-300">
                  <span className="material-symbols-outlined">backspace</span>
                  Erase
                </button>
                <button
                  onClick={toggleNotesMode}
                  className={`${state.notesMode ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'} font-label px-4 py-3 flex items-center gap-3 font-medium rounded-xl transition-all duration-300`}
                >
                  <span className="material-symbols-outlined">edit</span>
                  Notes {state.notesMode && '(On)'}
                </button>
                <button
                  onClick={handleRestart}
                  className="text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface font-label px-4 py-3 flex items-center gap-3 font-medium rounded-xl transition-all duration-300"
                >
                  <span className="material-symbols-outlined">refresh</span>
                  Reset
                </button>
              </div>

              <button onClick={handleHint} className="mt-4 bg-linear-to-r from-primary to-primary-container text-on-primary py-4 rounded-full font-label font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(53,37,205,0.2)] hover:shadow-[0_12px_24px_rgba(53,37,205,0.3)] active:scale-95 transition-all duration-300">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                Hint
              </button>
            </aside>

            {/* ── Centre: Grid ── */}
            <section className="flex-1 flex flex-col items-center w-full">
              {/* Game Stats Header */}
              <div className="w-full max-w-[600px] flex justify-between items-start mb-4 sm:mb-8 px-1 sm:px-2">
                <div className="flex flex-col relative z-50">
                  <span className="text-on-surface-variant text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0 sm:mb-1">Current Level</span>

                  <button
                    onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity lg:cursor-default outline-none"
                  >
                    <h3 className="text-lg sm:text-2xl font-extrabold text-on-surface font-headline tracking-tight capitalize text-left">
                      {state.difficulty}
                    </h3>
                    <span className="material-symbols-outlined text-on-surface lg:hidden">
                      {isDifficultyDropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* Mobile Difficulty Dropdown */}
                  {isDifficultyDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-surface-container-highest rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] overflow-hidden backdrop-blur-md lg:hidden border border-outline-variant/10">
                      {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(diff => (
                        <button
                          key={diff}
                          onClick={() => handleDifficultyChange(diff)}
                          className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors capitalize text-on-surface font-label font-medium"
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Mistake hearts */}
                  {mistakeLimitEnabled && (
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3].map(i => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-lg transition-all duration-300 ${i <= state.mistakeCount
                            ? 'text-red-500 scale-110'
                            : 'text-on-surface-variant/30'
                            }`}
                          style={{ fontVariationSettings: i <= state.mistakeCount ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          favorite
                        </span>
                      ))}
                      <span className="text-xs font-label text-on-surface-variant/60 ml-1">
                        {3 - state.mistakeCount > 0 ? `${3 - state.mistakeCount} left` : 'Game over'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Timer + Score */}
                <div className="flex flex-col items-end">
                  <span className="text-on-surface-variant text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0 sm:mb-1">Time Elapsed</span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-primary font-headline tabular-nums tracking-tighter">{formatTime(state.timeElapsed)}</h3>
                    <button
                      onClick={togglePause}
                      className="material-symbols-outlined text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-all duration-300"
                      title={state.isPaused ? 'Resume Game' : 'Pause Game'}
                    >
                      {state.isPaused ? 'play_arrow' : 'pause'}
                    </button>
                  </div>
                  {/* Live score — only in 3-mistake mode */}
                  {pointsActive && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <span
                        className="material-symbols-outlined text-sm text-amber-500"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-headline font-extrabold text-lg tabular-nums text-on-surface tracking-tight">
                        {score.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">pts</span>
                    </div>
                  )}
                </div>
              </div>

              {/* The Grid */}
              <div
                className="w-full max-w-[600px] bg-surface-container-lowest p-1 sm:p-6 rounded-xl sm:rounded-4xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] relative transition-all duration-500 overflow-hidden"
                style={activeBorderStyle}
              >
                {/* Background Image Layer */}
                {boardBgEnabled && (
                  <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: isDark ? 0.15 : 0.25,
                      mixBlendMode: isDark ? 'screen' : 'multiply',
                    }}
                  />
                )}

                {isDifficultyDropdownOpen && <div className="absolute inset-0 bg-surface/30 backdrop-blur-sm rounded-4xl z-40 pointer-events-none" />}
                {state.isPaused && (
                  <div className="absolute inset-0 bg-surface-container-lowest/70 backdrop-blur-md rounded-4xl z-40 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>pause_circle</span>
                    <span className="text-2xl font-headline font-bold text-on-surface tracking-tight">Game Paused</span>
                    <button
                      onClick={togglePause}
                      className="mt-6 bg-linear-to-br from-primary to-primary-container text-on-primary font-label text-sm font-bold tracking-wider uppercase px-8 py-3 rounded-full shadow-[0_8px_16px_rgba(53,37,205,0.2)] hover:shadow-[0_12px_24px_rgba(53,37,205,0.3)] transition-all duration-300 active:scale-95"
                    >
                      Resume
                    </button>
                  </div>
                )}

                <div className={`sudoku-grid border-2 border-primary/20 relative z-10 ${boardBgEnabled ? 'bg-transparent' : 'bg-surface-container-lowest'}`}>
                  {state.board.map((cell, index) => {
                    const isSelected = state.selectedCell === index;
                    const selectedValue = state.selectedCell !== null ? state.board[state.selectedCell].value : null;
                    const isSameValue = cell.value !== null && selectedValue !== null && cell.value === selectedValue && !isSelected;
                    const isPeer = !isSelected && peerIndices.has(index);

                    let cellClasses = 'sudoku-cell font-headline transition-colors cursor-pointer ';
                    if (boardBgEnabled) cellClasses += 'backdrop-blur-[2px] ';
                    if (isSelected) cellClasses += boardBgEnabled ? 'bg-primary-fixed/80 ' : 'bg-primary-fixed ';
                    else if (isSameValue) cellClasses += boardBgEnabled ? 'bg-primary-fixed/40 ' : 'bg-primary-fixed/50 ';
                    else if (isPeer) cellClasses += boardBgEnabled ? 'bg-surface-container-low/60 ' : 'bg-surface-container-low/70 ';
                    else cellClasses += boardBgEnabled ? 'bg-surface-container-lowest/40 hover:bg-surface-container-low/60 ' : 'bg-surface-container-lowest hover:bg-surface-container-low/50 ';

                    if (cell.fixed) cellClasses += 'font-bold text-on-surface ';
                    else if (cell.error) cellClasses += 'font-medium text-error ';
                    else if (cell.isHint) cellClasses += 'font-medium text-secondary ';
                    else if (cell.isCorrect) cellClasses += 'font-medium text-emerald-500 ';
                    else cellClasses += 'font-medium text-primary ';

                    return (
                      <div id={`sudoku-cell-${index}`} key={index} className={cellClasses} onClick={() => selectCell(index)}>
                        {cell.value ? (
                          cell.value
                        ) : cell.notes.length > 0 ? (
                          <div className="flex flex-wrap p-1 content-start w-full h-full">
                            {cell.notes.map(n => (
                              <span key={n} className="text-[10px] leading-none text-primary basis-1/3 text-center">{n}</span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Utility Action Buttons (Mobile only) */}
              <div className="grid lg:hidden w-full max-w-[600px] grid-cols-5 gap-2 sm:gap-4 mt-6">
                <button onClick={undo} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant group-active:scale-95 transition-all">
                    <span className="material-symbols-outlined">undo</span>
                  </div>
                  <span className="font-label text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-outline">Undo</span>
                </button>
                <button onClick={erase} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant group-active:scale-95 transition-all">
                    <span className="material-symbols-outlined">ink_eraser</span>
                  </div>
                  <span className="font-label text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-outline">Erase</span>
                </button>
                <button onClick={toggleNotesMode} className="flex flex-col items-center gap-1 group">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-surface-container-high ${state.notesMode ? 'text-primary' : 'text-on-surface-variant'} group-active:scale-95 transition-all relative`}>
                    <span className="material-symbols-outlined">edit</span>
                    {state.notesMode && <span className="absolute top-0 sm:top-1 right-1 sm:right-2 text-[8px] font-bold text-primary">ON</span>}
                  </div>
                  <span className={`font-label text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold ${state.notesMode ? 'text-primary' : 'text-outline'}`}>Notes</span>
                </button>
                <button onClick={handleHint} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant group-active:scale-95 transition-all">
                    <span className="material-symbols-outlined">lightbulb</span>
                  </div>
                  <span className="font-label text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-outline">Hint</span>
                </button>
                <button onClick={handleRestart} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant group-active:scale-95 transition-all">
                    <span className="material-symbols-outlined">refresh</span>
                  </div>
                  <span className="font-label text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-outline">Reset</span>
                </button>
              </div>

              {/* Number Input */}
              <div className="w-full max-w-[600px] grid grid-cols-9 gap-1 sm:gap-3 mt-6 sm:mt-10 ">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                  // Count how many times this number appears on the board
                  const count = state.board.filter(cell => cell.value === num).length;
                  const isFullyPlaced = count >= 9;

                  return (
                    <button
                      key={num}
                      disabled={isFullyPlaced}
                      onClick={e => {
                        if (isFullyPlaced) return;
                        // Register point action BEFORE dispatching to useSudoku so we
                        // can read the pre-change board state accurately.
                        if (state.selectedCell !== null && state.solution && !state.notesMode) {
                          const correctVal = parseInt(state.solution[state.selectedCell], 10);
                          const currentVal = state.board[state.selectedCell].value;
                          // Only act when placing a new value (toggling same value off = no action)
                          if (num !== currentVal) {
                            if (num === correctVal) {
                              // registerAction updates score +15 AND shows the floating label
                              registerAction('correct_cell', getCellCenter(state.selectedCell) || { x: e.clientX, y: e.clientY });
                              cellNumFillSound();

                            } else {
                              // Wrong placement — no animation, score unchanged, but mistake tracked
                              registerAction('mistake');
                              cellNumWrongSound();
                            }
                          }
                        }
                        inputNumber(num);
                      }}
                      className={`aspect-square sm:h-14 flex items-center justify-center font-headline text-lg sm:text-xl font-medium rounded-lg sm:rounded-xl transition-all duration-300 border-[0.5px] sm:border-2 ${isFullyPlaced
                        ? 'bg-surface-container-highest/50 text-on-surface-variant/30 border-transparent cursor-default'
                        : 'bg-surface-container-high text-on-surface-variant border-primary/20 hover:bg-surface-container-highest active:scale-90'
                        }`}
                    >
                      {isFullyPlaced ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                          <path d="m10 20-1.25-2.5L6 18" />
                          <path d="M10 4 8.75 6.5 6 6" />
                          <path d="m14 20 1.25-2.5L18 18" />
                          <path d="m14 4 1.25 2.5L18 6" />
                          <path d="m17 21-3-6h-4" />
                          <path d="m17 3-3 6 1.5 3" />
                          <path d="M2 12h6.5L10 9" />
                          <path d="m20 10-1.5 2 1.5 2" />
                          <path d="M22 12h-6.5L14 15" />
                          <path d="m4 10 1.5 2L4 14" />
                          <path d="m7 21 3-6-1.5-3" />
                          <path d="m7 3 3 6h4" />
                        </svg>
                      ) : (
                        num
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Architectural Tip (Responsive View) */}
              <div className="xl:hidden w-full max-w-[600px] mt-8 bg-secondary-fixed p-6 rounded-4xl">
                <h4 className="text-on-secondary-fixed-variant text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">Architectural Tip <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg> </h4>
                <p className="text-on-secondary-fixed-variant font-body text-sm font-medium leading-relaxed">
                  {/**Fallback tips */}
                  {randomTip?.tip || 'Look for "Naked Pairs" in the central sub-grid to unlock the hidden five.'}
                </p>
              </div>
            </section>

            {/* ── Right: Progress & Tips ── */}
            <aside className="hidden xl:flex flex-col gap-6 w-72 h-fit">
              <div className="bg-(--color-surface-container-low) p-6 rounded-4xl border border-(--color-outline-variant)/10 shadow-sm">
                {/* Daily Challenge Button */}
                <button
                  onClick={handleDailyChallenge}
                  className="w-full py-3 bg-(--color-surface-container-lowest) text-(--color-primary) border border-(--color-outline-variant)/30 rounded-xl font-label font-bold text-sm tracking-wider uppercase transition-all duration-300 ease-out hover:bg-(--color-surface-container-highest) hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50"
                  style={{ backgroundColor: dailyChallengeCompleted ? '#4caf50' : 'var(--color-surface-container-lowest)',color: dailyChallengeCompleted ? '#fff' : 'var(--color-primary)' }}
                >
                  {dailyChallengeCompleted ? <div className='flex items-center justify-center gap-2'><span className='material-symbols-outlined text-sm'>check_circle</span> Completed</div> : 'Start Daily Challenge'}
                </button>
                
                {/* Streak Counter Card */}
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-4 mt-4 bg-(--color-surface-container) group border border-(--color-outline-variant)/20"> 
                  <img
                    alt="Math abstract"
                    className="object-cover w-full h-full opacity-40 transition-transform duration-700 ease-out group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA--yB78zZ3fFPtPpyL9IQXW0AaNIe6w0FbUJFPMyh1Icl8050-T5ylQpilOuQKloJypTBVDseK5MfhQIBStAaUXBRW0EGfhm1SxBhyYdoSf388laai8ltZBqQBHb953_JKQr1osxYPzC6gXPYSJis_8EBSvxiiANJGdj3zSoKbgm06JAKYSUUkYHTQ0kwlIn9qoQKL8vOZsItz-liYQQ5leYY3r1r_GnAUXi-6g2YTZoKh1PrtS4xLFms-fQoEGLXg4DBLoTBWz3gW"
                  />

                  {/* Gradient Overlay for enhanced readability */}
                  <div className="absolute inset-0 bg-linear-to-b from-(--color-surface-container-lowest)/10 via-transparent to-(--color-surface-container-lowest)/20" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-(--color-primary) font-bold text-lg mb-1 tracking-wide drop-shadow-sm">
                      Sudoku Streak
                    </span>
                    <span className="text-4xl font-extrabold text-(--color-on-surface) font-headline transition-transform duration-300 group-hover:scale-105">
                      {currentStreak}
                    </span>
                    <span className="text-xs text-(--color-on-surface-variant) font-medium mt-1 tracking-wider uppercase opacity-80">
                      Consecutive Days
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="w-full py-3 bg-(--color-surface-container-lowest) text-(--color-primary) border border-(--color-outline-variant)/30 rounded-xl font-label font-bold text-sm tracking-wider uppercase transition-all duration-300 ease-out hover:bg-(--color-surface-container-highest) hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50"
                >
                  View Leaderboard
                </button>
              </div>

              <div className="bg-secondary-fixed p-6 rounded-2xl">
                <h4 className="text-on-secondary-fixed-variant text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">Architectural Tip <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg> </h4>
                <p className="text-on-secondary-fixed-variant font-body text-sm font-medium leading-relaxed">
                  {/**Fallback tips */}
                  {randomTip?.tip || 'Look for "Naked Pairs" in the central sub-grid to unlock the hidden five.'}

                </p>
              </div>
            </aside>
          </main>

          {/* ── Main and Footer divider ── */}
          <AnimatedDivider marginClass="mt-8" />

          {/* ── Footer ── */}
          {mobileNavEnabled ? <div className='mb-[68px]'></div> : (<footer className=" w-full flex flex-col">
            {/* Layers 1 and 2 container */}
            <div
              className={`w-full relative ${footerBgEnabled ? '' : 'bg-surface-container-low'}`}
              style={footerBgEnabled ? {
                backgroundImage: `url('${isDark ? '/footer-dark.gif' : '/footer-lite.jpg'}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : undefined}
            >
              {footerBgEnabled && (
                <div className="absolute inset-0 z-0" style={{
                  background: isDark ? 'linear-gradient(to bottom, rgba(25,28,30,0.8), rgba(25,28,30,0.95))' : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95))'
                }} />
              )}

              <div className="relative z-10 flex flex-col w-full px-10 pt-12 pb-8 max-w-[1440px] mx-auto gap-8">
                {/* Layer 1 */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 pb-6"> {/*border-b border-outline-variant/10 */}
                  <span className="text-2xl font-extrabold text-on-surface tracking-tight font-headline"><span className='bigbesty'>Sudoku </span>
                    <span className="text-[#ff0099] bigbesty">
                      Sanctuary
                    </span></span>
                  <div className="flex flex-wrap justify-center gap-10">
                    <button onClick={() => setShowPrivacy(true)} className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer">Privacy Policy</button>
                    <button onClick={() => setShowTerms(true)} className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer">Terms of service</button>
                    <button
                      onClick={() => setShowLeaderboard(true)}
                      className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer"
                    >
                      Leaderboard
                    </button>
                  </div>
                </div>

                {/* Layer 2 */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">

                  {/* Time - left on desktop */}
                  <div className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer text-center md:text-left">
                    {/*12:50 AM IST +5:30GMT*/}
                    {localUser.loading ? (
                      <p className="text-xs text-on-surface-variant">Detecting your IP location...</p>
                    ) : (
                      <p>
                        <small>{localUser.country} </small> {localUser.formattedTime}
                      </p>
                    )}

                  </div>

                  {/* Social Icons - right on desktop */}
                  <div className="flex justify-center md:justify-end items-center gap-4 md:gap-6">

                    <a
                      href="https://github.com/Abhiyadav73"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary/10 group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                    >
                      <img src="/github.png" alt="GitHub" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary/10 group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                    >
                      <img src="/linkedin.png" alt="LinkedIn" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary/10 group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                    >
                      <img src="/insta-512.png" alt="Instagram" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </a>

                  </div>
                </div>
              </div>
            </div>

            {/* Layer 3 - always dark mode */}
            <div className="w-full bg-[#191c1e] text-white py-2 border-t border-white/10">
              <div className="flex justify-center w-full px-10 max-w-[1440px] mx-auto">
                <span className="text-xs font-medium text-white/80 font-headline text-center">© {new Date().getFullYear()} Mindgames Sanctuary. All Rights Reserved.</span>
              </div>
            </div>
          </footer>)}

          {/* ── Mobile Navigation ── */}
          {mobileNavEnabled && (
            <nav className="md  fixed bottom-0 left-0 right-0 bg-surface-container-highest/90 backdrop-blur-md px-3 py-3 flex justify-around items-center z-50 rounded-t-[5px] shadow-[0_-20px_40px_rgba(25,28,30,0.06)]">

              <button onClick={() => setShowDaily(true)} className="flex flex-col items-center gap-1 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-wider">Streak</span>
              </button>
              <button
                onClick={() => setShowHowToPlay(true)}
                className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">help</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-wider">How To</span>
              </button>

              <button
                onClick={handleDailyChallenge}
                className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">bolt</span>
                <span className="text-[10px] font-bold uppercase">Daily</span>
              </button>

              <button
                onClick={() => setShowStats(true)}
                className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">insights</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-wider">Stats</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-wider">Settings</span>
              </button>
            </nav>
          )}
        </div>
      )}
    </>
  );
}

export default App;
