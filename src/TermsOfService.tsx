import { useEffect } from 'react';
import AnimatedDivider from './Components/AnimatedDivider';

interface Props {
  onClose: () => void;
  onShowHowToPlay: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
  onShowPrivacy: () => void;
  footerBgEnabled?: boolean;
  isDark?: boolean;
}

export default function TermsOfService({ onClose, onShowHowToPlay, onShowStats, onShowSettings, onShowPrivacy, footerBgEnabled, isDark }: Props) {
  // Prevent scrolling on the main page when this is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-100 bg-surface overflow-y-auto overflow-x-hidden font-body text-on-surface flex flex-col">
      {/* TopAppBar */}
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

      <main className="pt-12 pb-24 px-6 md:px-10 max-w-4xl mx-auto relative flex-1 w-full">
        {/* Atmospheric Background Element */}
        <div className="absolute inset-0 bg-[radial-gradient(#c7c4d8_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 pointer-events-none -z-10"></div>
        
        {/* Header Section */}
        <div className="mb-20 text-center md:text-left animate-fade-up">
          <span className="text-primary font-bold tracking-widest text-label-md uppercase mb-4 block">Legal Framework</span>
          <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-tight">
            Terms of <span className="text-primary-container">Service</span>
          </h1>
          <p className="mt-6 text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Welcome to the Mathematical Sanctuary. These terms govern your engagement with our logic puzzles and digital environment. By playing, you agree to our architecture of rules.
          </p>
          <div className="mt-8 flex items-center gap-3 text-outline text-sm justify-center md:justify-start">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Last Updated: May 24, 2024</span>
          </div>
        </div>

        {/* Bento-Style Legal Sections */}
        <div className="grid grid-cols-1 gap-12">
          {/* 01. Acceptance of Terms */}
          <section className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="shrink-0">
              <span className="font-headline text-4xl font-black text-outline-variant/30 group-hover:text-primary/20 transition-colors duration-500">01</span>
            </div>
            <div className="space-y-6 w-full">
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Acceptance of Terms</h2>
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] space-y-4">
                <p className="text-on-surface-variant leading-relaxed font-body">
                  By accessing or using Sudoku Sanctuary, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use immediately.
                </p>
                <p className="text-on-surface-variant leading-relaxed font-body">
                  This is a legal agreement between you and Sudoku Sanctuary. We reserve the right to update these terms at our discretion, reflecting the evolving nature of our sanctuary.
                </p>
              </div>
            </div>
          </section>

          {/* 02. Fair Play */}
          <section className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="shrink-0">
              <span className="font-headline text-4xl font-black text-outline-variant/30 group-hover:text-primary/20 transition-colors duration-500">02</span>
            </div>
            <div className="space-y-6 grow w-full">
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Fair Play Policy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">block</span>
                  </div>
                  <h3 className="font-bold text-on-surface">No Cheating</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    The use of external solvers, automated scripts, or manipulative software is strictly prohibited to preserve the integrity of the leaderboard.
                  </p>
                </div>
                <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <h3 className="font-bold text-on-surface">Human Logic</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Our sanctuary is designed for the human mind. Any attempt to reverse-engineer our puzzle generation algorithms is a violation of these terms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 03. Intellectual Property */}
          <section className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="shrink-0">
              <span className="font-headline text-4xl font-black text-outline-variant/30 group-hover:text-primary/20 transition-colors duration-500">03</span>
            </div>
            <div className="space-y-6 w-full">
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Intellectual Property</h2>
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] border-l-4 border-primary">
                <p className="text-on-surface-variant leading-relaxed font-body">
                  All content, including but not limited to the visual interface, brand identity, "Indigo Logic" design system, puzzle algorithms, and soundtrack, is the exclusive property of Sudoku Sanctuary.
                </p>
                <p className="text-on-surface-variant leading-relaxed font-body mt-4 italic">
                  You are granted a limited, non-exclusive license to enjoy the puzzles for personal, non-commercial use only. Redistribution of our specific grid patterns is prohibited.
                </p>
              </div>
            </div>
          </section>

          {/* 04. Limitation of Liability */}
          <section className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="shrink-0">
              <span className="font-headline text-4xl font-black text-outline-variant/30 group-hover:text-primary/20 transition-colors duration-500">04</span>
            </div>
            <div className="space-y-6 w-full">
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Limitation of Liability</h2>
              <div className="bg-primary text-on-primary p-8 rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
                <p className="leading-relaxed font-body opacity-90">
                  Sudoku Sanctuary is provided "as is" and "as available." While we strive for perfection in our mathematical logic, we do not warrant that the service will be uninterrupted or error-free. 
                </p>
                <p className="leading-relaxed font-body mt-4 opacity-90">
                  In no event shall we be liable for any indirect, incidental, or consequential damages arising from your focus on puzzles or use of our platform. Use your logic responsibly.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action / Acceptance Footer */}
        <div className="mt-24 pt-16 border-t border-outline-variant/20 text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <button onClick={onClose} className="px-10 py-4 bg-linear-to-br from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer">
            I Understand and Accept
          </button>
          <p className="mt-6 text-outline text-sm">
            By clicking above, you agree to abide by the mathematical laws of the Sanctuary.
          </p>
        </div>
      </main>
      
      <AnimatedDivider marginClass="mt-0" />

      {/* Footer */}
      <footer className="w-full flex flex-col mt-auto border-t border-outline-variant/10">
        <div
          className={`w-full relative ${footerBgEnabled ? '' : 'bg-surface-container-low'}`}
          style={footerBgEnabled ? {
            backgroundImage: `url('${isDark ? '/w-footer-dark.png' : '/w-footer-lite.png'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          {footerBgEnabled && (
            <div className="absolute inset-0 z-0" style={{
              background: isDark ? 'linear-gradient(to bottom, rgba(25,28,30,0.8), rgba(25,28,30,0.95))' : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95))'
            }} />
          )}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end px-10 py-12 w-full max-w-7xl mx-auto gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="text-2xl font-headline font-bold text-on-surface"><span className='bigbesty'>Sudoku Sanctuary</span></div>
              <p className="font-body text-label-md text-on-surface-variant tracking-wide text-center md:text-left">
                © {new Date().getFullYear()} Mindgames Sanctuary.All Rights Reserved.
              </p>
            </div>
            <div className="flex gap-8 items-center text-sm">
              <button onClick={onShowPrivacy} className="text-on-surface-variant hover:text-primary font-medium tracking-wide cursor-pointer transition-all">Privacy Policy</button>
              <button className="text-primary font-medium tracking-wide cursor-pointer">Terms of Service</button>
            </div>
          </div>
          <div className="relative z-10 w-full text-center pb-8 text-label-md font-medium text-on-surface-variant opacity-90">
            Made with ❤️ in India
          </div>
        </div>
      </footer>
    </div>
  );
}
