import type { ThemeMode } from './useTheme';

const GITHUB_REPO_URL = 'https://github.com/Abhiyadav73/Sudoku-Sanctuary';

interface Props {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  mistakeLimitEnabled: boolean;
  onMistakeLimitChange: (v: boolean) => void;
  trailEnabled: boolean;
  onTrailEnabledChange: (v: boolean) => void;
  difficultyBorderEnabled: boolean;
  onDifficultyBorderChange: (v: boolean) => void;
  boardBgEnabled: boolean;
  onBoardBgChange: (v: boolean) => void;
  appBgEnabled: boolean;
  onAppBgChange: (v: boolean) => void;
  footerBgEnabled: boolean;
  onFooterBgChange: (v: boolean) => void;
  mobileNavEnabled: boolean;
  onMobileNavEnabledChange: (v: boolean) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (v: boolean) => void;
  musicEnabled: boolean;
  onMusicEnabledChange: (v: boolean) => void;
  onClose: () => void;
}

const options: { value: ThemeMode; label: string; icon: string; desc: string }[] = [
  { value: 'light', label: 'Light', icon: 'light_mode', desc: 'Always light' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode', desc: 'Always dark' },
  { value: 'system', label: 'System', icon: 'brightness_auto', desc: 'Follow device' },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5 shrink-0">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function Settings({ theme, onThemeChange, mistakeLimitEnabled, onMistakeLimitChange, trailEnabled, onTrailEnabledChange, difficultyBorderEnabled, onDifficultyBorderChange, boardBgEnabled, onBoardBgChange, appBgEnabled, onAppBgChange, footerBgEnabled, onFooterBgChange, mobileNavEnabled, onMobileNavEnabledChange, soundEnabled, onSoundEnabledChange, musicEnabled, onMusicEnabledChange, onClose }: Props) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4"
      style={{ background: 'rgba(25, 28, 30, 0.6)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface-container-low w-full max-w-md rounded-[2rem] shadow-[0_40px_80px_rgba(25,28,30,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 shrink-0">
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-on-surface leading-none translate-y-[1px] hover:rotate-90">settings</span>
            <h2 className="text-xl font-extrabold text-on-surface font-headline tracking-tight leading-none">Settings</h2> 
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest p-2 rounded-full transition-all duration-300"
          >
            close
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide">
          {/* Theme section */}
          <div className="px-8 pb-6">
            <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4">Theme Mode</p>
            <div className="flex flex-col gap-2">
              {options.map(opt => {
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onThemeChange(opt.value)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-left ${isActive
                      ? 'bg-primary/10 border-2 border-primary/30'
                      : 'bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest'
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {opt.icon}
                    </span>
                    <div className="flex-1">
                      <p className={`font-label font-bold text-sm ${isActive ? 'text-primary' : 'text-on-surface'}`}>{opt.label}</p>
                      <p className="font-label text-xs text-on-surface-variant">{opt.desc}</p>
                    </div>
                    {isActive && (
                      <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GitHub Star section */}
          <div className="px-8 pb-6">
            <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4">Open Source</p>
            <div className="flex flex-col gap-2">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-transparent bg-surface-container-highest/60 hover:bg-[#24292f] hover:border-[#24292f] transition-all duration-300"
              >
                <span className="text-on-surface-variant group-hover:text-white transition-colors duration-300">
                  <GitHubIcon />
                </span>
                <div className="flex-1">
                  <p className="font-label font-bold text-sm text-on-surface group-hover:text-white transition-colors duration-300">
                    Star on GitHub
                  </p>
                  <p className="font-label text-xs text-on-surface-variant group-hover:text-white/60 transition-colors duration-300">
                    Support the project ✨
                  </p>
                </div>
                <span
                  className="material-symbols-outlined text-xl text-amber-400 group-hover:text-amber-300 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </a>
              <a
                href={`${GITHUB_REPO_URL}/fork`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-transparent bg-surface-container-highest/60 hover:bg-[#24292f] hover:border-[#24292f] transition-all duration-300"
              >
                <span className="text-on-surface-variant group-hover:text-white transition-colors duration-300">
                  <GitHubIcon />
                </span>
                <div className="flex-1">
                  <p className="font-label font-bold text-sm text-on-surface group-hover:text-white transition-colors duration-300">
                    Fork on GitHub
                  </p>
                  <p className="font-label text-xs text-on-surface-variant group-hover:text-white/60 transition-colors duration-300">
                    Contribute to the codebase 🛠️
                  </p>
                </div>
                <img
                  src={isDark ? '/dark-fork.png' : '/light-fork.png'}
                  alt="Fork"
                  className="w-5 h-5 object-contain group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                />
              </a>
            </div>
          </div>

          {/* Gameplay section */}
          <div className="px-8 pb-8">
            <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4">Gameplay</p>
            <button
              onClick={() => onMistakeLimitChange(!mistakeLimitEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${mistakeLimitEnabled ? 'text-red-500' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: mistakeLimitEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">3-Mistake Limit</p>
                <p className="font-label text-xs text-on-surface-variant">Game restarts after 3 wrong moves</p>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${mistakeLimitEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${mistakeLimitEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>

            <button
              onClick={() => onTrailEnabledChange(!trailEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300 mt-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${trailEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: trailEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                gesture
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">Cursor Trail</p>
                <p className="font-label text-xs text-on-surface-variant">Show colorful trail behind cursor</p>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${trailEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${trailEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>

            {/* Difficulty Border Color toggle */}
            <button
              onClick={() => onDifficultyBorderChange(!difficultyBorderEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300 mt-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${difficultyBorderEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: difficultyBorderEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                border_color
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">Difficulty Border</p>
                <p className="font-label text-xs text-on-surface-variant mb-1.5">Board border reflects difficulty</p>
                { /*<div className="flex gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#16a34a' }}>Easy</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(234,179,8,0.15)',  color: '#ca8a04' }}>Medium</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)',  color: '#dc2626' }}>Hard</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#2563eb' }}>Expert</span>
              </div>*/}
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${difficultyBorderEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${difficultyBorderEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>

            {/* Sound Effects toggle */}
            <button
              onClick={() => onSoundEnabledChange(!soundEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300 mt-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${soundEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: soundEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                volume_up
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">Sound Effects</p>
                <p className="font-label text-xs text-on-surface-variant mb-1.5">Play sounds for actions</p>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${soundEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>

            {/* Music toggle */}
            <button
              onClick={() => onMusicEnabledChange(!musicEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300 mt-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${musicEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: musicEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                music_note
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">Game Music</p>
                <p className="font-label text-xs text-on-surface-variant mb-1.5">Play background music</p>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${musicEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${musicEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>

            {/* Mobile Navigation toggle */}
            <button
              onClick={() => onMobileNavEnabledChange(!mobileNavEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300 mt-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${mobileNavEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: mobileNavEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                call_to_action
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">Mobile Navigation</p>
                <p className="font-label text-xs text-on-surface-variant">Show bottom navigation bar</p>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${mobileNavEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${mobileNavEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>
          </div>

          {/* Game Theme section */}
          <div className="px-8 pb-8">
            <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4">Game Theme</p>

            {/* App Background toggle */}
            <button
              onClick={() => onAppBgChange(!appBgEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${appBgEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: appBgEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                imagesmode
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">App Background</p>
                <small className="text-xs text-on-surface-variant">Show image background globally</small>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${appBgEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${appBgEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>

            {/* Board Background toggle */}
            <button
              onClick={() => onBoardBgChange(!boardBgEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300 mt-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${boardBgEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: boardBgEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                wallpaper
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">Board Background</p>
                <small className="text-xs text-on-surface-variant">Show image background on board</small>
              </div>

              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${boardBgEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${boardBgEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>

            {/* Footer Background toggle */}
            <button
              onClick={() => onFooterBgChange(!footerBgEnabled)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left bg-surface-container-highest/60 border-2 border-transparent hover:bg-surface-container-highest transition-all duration-300 mt-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors duration-300 ${footerBgEnabled ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontVariationSettings: footerBgEnabled ? "'FILL' 1" : "'FILL' 0" }}
              >
                photo_size_select_actual
              </span>
              <div className="flex-1">
                <p className="font-label font-bold text-sm text-on-surface">Footer Background</p>
                <small className="text-xs text-on-surface-variant">Show image background on footer</small>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${footerBgEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${footerBgEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>
          </div>
          {/* Support Developer section */}
          <div className="px-8 pb-4">
            <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-1.5">Support Developer <img src="./red-heart.png" alt="Red Heart" className="w-6 h-6" /></p>
            {/*Socials */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center pt-4 pb-1 md:justify-end gap-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary/10 group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
                  <img src="/github.png" alt="GitHub" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary/10 group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
                  <img src="/linkedin.png" alt="LinkedIn" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary/10 group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
                  <img src="/insta-512.png" alt="Instagram" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
            <p className="text-center p-4 text-xs text-on-surface-variant tracking-wider text-[rgb(112, 112, 112)]">&#169; Mindgame Sanctuary v1.3.3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
