import { useEffect, useState } from 'react';
import AnimatedDivider from './Components/AnimatedDivider';
import Indicator from './Components/Indicator';

interface Props {
  onClose: () => void;
  onShowLeaderboard: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
  footerBgEnabled: boolean;
  isDark: boolean;
}

export default function HowToPlay({ onClose, onShowLeaderboard, onShowStats, onShowSettings, onShowPrivacy, onShowTerms, footerBgEnabled, isDark }: Props) {
  const [activeSection, setActiveSection] = useState('basics');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-130px 0px -50% 0px' });

    const sections = ['basics', 'controls', 'techniques'].map(id => document.getElementById(id));
    sections.forEach(s => { if (s) observer.observe(s); });

    return () => observer.disconnect();
  }, []);

  const getTabClass = (id: string) => {
    const base = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ";
    if (activeSection === id) {
      return base + "bg-primary-fixed text-on-primary-fixed-variant font-bold hover:bg-primary-fixed/80";
    }
    return base + "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium";
  };

  return (
    <div className="fixed inset-0 z-100 bg-surface overflow-y-auto overflow-x-hidden font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed-variant flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface/90 backdrop-blur-md full-width top-0 z-50 sticky shadow-sm">
        <Indicator/>
        <div className="flex justify-between items-center px-10 py-6 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose}
              className="text-primary hover:bg-surface-variant/50 transition-colors duration-300 p-2 rounded-full scale-95 active:scale-90"
            >
              <span className="material-symbols-outlined pt-[8px]">arrow_back</span>
            </button>
            <h1 className="font-headline text-2xl font-extrabold text-primary tracking-tight"> <span className='bigbesty'>Sudoku Sanctuary</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8 mr-4">
              <button onClick={onClose} className="nav-link-underline text-on-surface-variant font-label text-sm tracking-wider hover:text-primary transition-colors duration-300"><span className='titillium-web-regular text-lg font-semibold'>Play</span></button>
              <button onClick={onShowStats} className="nav-link-underline text-on-surface-variant font-label text-sm tracking-wider hover:text-primary transition-colors duration-300"><span className='titillium-web-regular text-lg font-semibold'>Stats</span></button>
            </nav> 
            <button 
              onClick={onShowSettings} 
              className="material-symbols-outlined text-on-surface-variant hover:text-primary hover:bg-surface-container-highest p-2.5 rounded-full transition-all duration-300 scale-95 active:scale-90 hover:rotate-90"
            >
              settings
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row gap-16 flex-1 w-full">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-32">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-primary mb-8">How to Play</h2>
            <nav className="flex flex-col gap-2">
              <a className={getTabClass('basics')} href="#basics">
                <span className="material-symbols-outlined">grid_3x3</span>
                <span className="font-label text-sm">The Basics</span>
              </a>
              <a className={getTabClass('controls')} href="#controls">
                <span className="material-symbols-outlined">settings_input_component</span>
                <span className="font-label text-sm">Game Controls</span>
              </a>
              <a className={getTabClass('techniques')} href="#techniques">
                <span className="material-symbols-outlined">psychology</span>
                <span className="font-label text-sm">Solving Techniques</span>
              </a>
            </nav>
            <div className="mt-12 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10">
              <p className="text-sm font-body text-on-surface-variant leading-relaxed">
                Sudoku is more than just numbers; it's a sanctuary for the focused mind. Master the rules to unlock new levels of cognitive flow.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Canvas */}
        <div className="grow space-y-24">
          {/* Section 1: The Basics */}
          <section className="scroll-mt-32" id="basics">
            <div className="mb-12">
              <span className="font-label text-sm font-bold tracking-widest uppercase text-primary mb-2 block">Step One</span>
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-6">The Basics</h2>
              <p className="text-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Sudoku is played on a 9x9 grid, divided into nine 3x3 subgrids. The objective is simple yet requires deep concentration: every row, every column, and every subgrid must contain the numbers 1 through 9 exactly once.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-surface-container-lowest p-8 rounded-4xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] aspect-square max-w-md mx-auto lg:mx-0 w-full flex flex-col">
                {/* Illustrative Grid Diagram */}
                <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full bg-outline-variant/20 rounded-xl overflow-hidden flex-1 mb-4">
                  {/* Loop for 3x3 blocks */}
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1">
                    <div className="bg-primary-fixed/20 rounded-lg flex items-center justify-center font-headline text-xl text-primary font-bold">1</div>
                    <div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-primary-fixed/20 rounded-lg flex items-center justify-center font-headline text-xl text-primary font-bold">2</div>
                    <div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-primary-fixed/20 rounded-lg flex items-center justify-center font-headline text-xl text-primary font-bold">3</div>
                  </div>
                  {/* Placeholder blocks */}
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                  {/* Row 2 */}
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                  {/* Row 3 */}
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                  <div className="bg-surface-container-lowest grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-40">
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                    <div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div><div className="bg-surface-container-low rounded-lg"></div>
                  </div>
                </div>
                <div className="h-8 flex items-center justify-center text-on-surface-variant font-label text-sm italic shrink-0">
                  Each 3x3 block is an independent sanctuary.
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container font-bold text-lg">1</div>
                  <div>
                    <h4 className="font-headline text-xl font-bold text-on-surface mb-2">Rows &amp; Columns</h4>
                    <p className="text-on-surface-variant leading-relaxed">Look horizontally and vertically. No number can repeat in the same line.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container font-bold text-lg">2</div>
                  <div>
                    <h4 className="font-headline text-xl font-bold text-on-surface mb-2">The Nonet Rule</h4>
                    <p className="text-on-surface-variant leading-relaxed">Each thick-bordered 3x3 square must also house numbers 1-9 uniquely.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container font-bold text-lg">3</div>
                  <div>
                    <h4 className="font-headline text-xl font-bold text-on-surface mb-2">Pure Logic</h4>
                    <p className="text-on-surface-variant leading-relaxed">A true Sudoku puzzle has only one solution and requires no guessing.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Game Controls */}
          <section className="scroll-mt-32" id="controls">
            <div className="mb-12">
              <span className="font-label text-sm font-bold tracking-widest uppercase text-primary mb-2 block">Step Two</span>
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-6">Game Controls</h2>
              <p className="text-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Interface with the grid using our minimalist control suite. These tools are designed to facilitate thinking, not replace it.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Control Card: Difficulty */}
              <div className="bg-surface-container-low p-8 rounded-4xl hover:bg-surface-container-high transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-6 shadow-[0_8px_16px_rgba(53,37,205,0.25)]">
                  <span className="material-symbols-outlined">layers</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-3 text-on-surface">Difficulty Selector</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Switch between Easy, Medium, Hard, and Expert levels from the top menu.</p>
              </div>
              {/* Control Card: Undo */}
              <div className="bg-surface-container-low p-8 rounded-4xl hover:bg-surface-container-high transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest text-on-surface flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">undo</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-3 text-on-surface">Undo</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Retrace your steps. Reverses your last action instantly.</p>
              </div>
              {/* Control Card: Erase */}
              <div className="bg-surface-container-low p-8 rounded-4xl hover:bg-surface-container-high transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest text-on-surface flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">backspace</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-3 text-on-surface">Erase</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Clear a cell of its fixed number or all its pencil marks.</p>
              </div>
              {/* Control Card: Notes */}
              <div className="bg-surface-container-low p-8 rounded-4xl hover:bg-surface-container-high transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-6 shadow-[0_8px_16px_rgba(53,37,205,0.25)]">
                  <span className="material-symbols-outlined">edit</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-3 text-on-surface">Notes Mode</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Toggle pencil marks to track possible candidates for each cell.</p>
              </div>
              {/* Control Card: Hint */}
              <div className="bg-surface-container-low p-8 rounded-4xl hover:bg-surface-container-high transition-colors duration-300 lg:col-span-2">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest text-on-surface flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-3 text-on-surface">Hint</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-lg">Feeling stuck? A hint will reveal one logical next step without giving away the game.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Solving Techniques */}
          <section className="scroll-mt-32" id="techniques">
            <div className="mb-12">
              <span className="font-label text-sm font-bold tracking-widest uppercase text-primary mb-2 block">Step Three</span>
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-6">Solving Techniques</h2>
            </div>
            
            <div className="space-y-16">
              {/* Technique 1 */}
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2">
                  <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Scanning (Cross-Hatching)</h3>
                  <p className="text-body text-on-surface-variant leading-relaxed text-lg">
                    The most fundamental technique. Scan a row and column that already contain a specific number (e.g., '5') to eliminate positions in a neighboring 3x3 block. By process of elimination, only one spot remains for that number.
                  </p>
                </div>
                <div className="lg:w-1/2 bg-surface-container-low p-8 rounded-[2.5rem] w-full">
                  <img 
                    alt="Scanning Technique" 
                    className="w-full h-64 object-cover rounded-3xl shadow-[0_20px_40px_rgba(25,28,30,0.06)]" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQvhGFRpn24Ma96oOKJonuLZWvytkKvIJgG3yi9FiZlxjHkRRw9RapAjN-wLT9hkfnRXMV-kigkuGA5eCLILLBGCcySJsUKO3luZS-V1Hyl5VKScdkpAlo8ns9w7CjU-cIX9lMjvx0m92JgAOXcoR8MWkDZ-DqmSDrSXWWVB71UD-Ska_punfGJBsRkcdtMzqZWNLnunWcW5SLL4vGN1eWeJHbfpWNEM3uapOUzD05j8npDC6465FwzAvco42NMpOJKF-6jZNkGVBS"
                  />
                </div>
              </div>
              
              {/* Technique 2 */}
              <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
                <div className="lg:w-1/2">
                  <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Naked Pairs</h3>
                  <p className="text-body text-on-surface-variant leading-relaxed text-lg">
                    If two cells in the same row, column, or block contain the exact same pair of note candidates (and only those two), those numbers can be eliminated from all other cells in that same unit.
                  </p>
                </div>
                <div className="lg:w-1/2 bg-surface-container-low p-8 rounded-[2.5rem] w-full">
                  <div className="grid grid-cols-2 gap-6 h-64">
                    <div className="bg-surface-container-lowest rounded-3xl flex items-center justify-center flex-col border border-primary/20 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
                      <span className="text-xs text-outline font-label font-bold uppercase tracking-widest mb-3">Candidates</span>
                      <span className="text-4xl font-headline font-bold text-primary">2, 7</span>
                    </div>
                    <div className="bg-surface-container-lowest rounded-3xl flex items-center justify-center flex-col border border-primary/20 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
                      <span className="text-xs text-outline font-label font-bold uppercase tracking-widest mb-3">Candidates</span>
                      <span className="text-4xl font-headline font-bold text-primary">2, 7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-12 border-t border-outline-variant/20 mt-12">
            <div className="bg-primary rounded-[3rem] p-16 text-center relative overflow-hidden shadow-[0_40px_80px_rgba(53,37,205,0.2)]">
              <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-container opacity-90"></div>
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="font-headline text-4xl font-extrabold text-on-primary mb-6">Ready to test your logic?</h2>
                <p className="text-on-primary-container mb-10 max-w-lg mx-auto text-lg">Apply these techniques and find your flow state in a new game.</p>
                <button 
                  onClick={onClose}
                  className="bg-surface-container-lowest text-primary px-12 py-5 rounded-full font-label font-bold text-base tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                >
                  Start Playing
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <AnimatedDivider marginClass="mt-0"/> 

      {/* ── Footer ── */}
      <footer className="mt-auto w-full flex flex-col">
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 pb-6 border-b border-outline-variant/10">
              <span className="text-2xl font-extrabold text-on-surface tracking-tight font-headline">Sudoku Sanctuary</span>
              <div className="flex flex-wrap justify-center gap-10">
                <button onClick={onShowPrivacy} className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer">Privacy Policy</button>
                <button onClick={onShowTerms} className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer">Terms of Service</button>
                <button
                  onClick={() => {
                    onClose();
                    onShowLeaderboard();
                  }}
                  className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors duration-300"
                >
                  Leaderboard
                </button>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="flex justify-center md:justify-end gap-6">
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
        </div>

        {/* Layer 3 - always dark mode */}
        <div className="w-full bg-[#191c1e] text-white py-4 border-t border-white/10">
          <div className="flex justify-center w-full px-10 max-w-[1440px] mx-auto">
            <span className="text-xs font-medium text-white/80 font-headline text-center">© {new Date().getFullYear()} Mindgames Sanctuary. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
