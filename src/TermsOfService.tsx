import { useEffect } from 'react';
import AnimatedDivider from './Components/AnimatedDivider';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

interface Props {
  onClose: () => void;
  onShowHowToPlay: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  footerBgEnabled?: boolean;
  isDark?: boolean;
}

export default function TermsOfService({ onClose, onShowHowToPlay, onShowStats, onShowSettings, onShowTerms, onShowPrivacy, footerBgEnabled, isDark }: Props) {
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
      <Navbar onShowHowToPlay={onShowHowToPlay} onShowStats={onShowStats} onShowSettings={onShowSettings} onClose={onClose}/>

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
            <span>Last Updated: June 30, 2026</span>
          </div>
        </div>

        {/*Legal Sections */}
        <div className="grid grid-cols-1 gap-12">
          {/* 01. Acceptance of Terms */}
          <section className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-fade-up" style={{ animationDelay: '0.1s' }} >
            <div className="shrink-0">
              <span className="font-headline text-4xl font-black text-outline-variant/30 group-hover:text-primary/20 transition-colors duration-500">01</span>
            </div>
            <div className="space-y-6 w-full">
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Acceptance of Terms</h2>

              {/* OUTER CONTAINER: Handles the spinning border size & radius */}
              <div className="p-[3px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(25,28,30,0.06)]">

                {/* INNER CONTAINER: Solid background blocks the gradient from showing inside */}
                <div className="bg-surface-container-lowest p-8 rounded-[10px] w-full h-full relative z-10 space-y-4">
                  <p className="text-on-surface-variant leading-relaxed font-body">
                    By accessing or using Sudoku Sanctuary, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use immediately.
                  </p>
                  <p className="text-on-surface-variant leading-relaxed font-body">
                    This is a legal agreement between you and Sudoku Sanctuary. We reserve the right to update these terms at our discretion, reflecting the evolving nature of our sanctuary.
                  </p>
                </div>
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
      <Footer onShowPrivacy={onShowPrivacy} onShowTerms={onShowTerms} footerBgEnabled={footerBgEnabled} isDark={isDark} />

    </div>
  );
}
