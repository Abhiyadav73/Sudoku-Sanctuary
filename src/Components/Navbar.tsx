
interface Props {
  onClose: () => void;
  onShowHowToPlay: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
}

export default function Navbar({onClose, onShowHowToPlay, onShowStats, onShowSettings}: Props) {
  return (
   <header className="bg-surface/90 backdrop-blur-md full-width top-0 z-50 sticky shadow-sm">
        <div className="flex justify-between items-center px-10 py-6 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose}
              className="text-primary hover:bg-surface-variant/50 transition-colors duration-300 pt-[8px] rounded-full scale-95 active:scale-90"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-headline text-2xl font-extrabold text-primary tracking-tight"><span className='bigbesty'>Sudoku Sanctuary</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8 mr-4">
              <button onClick={onClose} className="nav-link-underline text-on-surface-variant font-label text-sm hover:text-primary transition-colors duration-300 cursor-pointer"><span className='titillium-web-regular text-lg font-semibold'>Play</span></button>
              <button onClick={() => { onClose(); onShowStats(); }} className="nav-link-underline text-on-surface-variant font-label text-sm  hover:text-primary transition-colors duration-300 cursor-pointer"><span className='titillium-web-regular text-lg font-semibold'>Stats</span></button>
              <button onClick={() => { onClose(); onShowHowToPlay(); }} className="nav-link-underline text-on-surface-variant font-label text-sm hover:text-primary transition-colors duration-300 cursor-pointer"><span className='titillium-web-regular text-lg font-semibold'>How to Play</span></button>
            </nav>
            <button 
              onClick={() => { onClose(); onShowSettings(); }} 
              className="material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-highest p-2.5 rounded-full transition-all duration-300 scale-95 active:scale-90 hover:rotate-90 cursor-pointer"
            >
              settings
            </button>
          </div>
        </div>
      </header>

  )
}
