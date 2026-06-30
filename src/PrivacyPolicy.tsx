import { useEffect } from 'react';
import AnimatedDivider from './Components/AnimatedDivider';


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

export default function PrivacyPolicy({ onClose, onShowHowToPlay, onShowStats, onShowSettings, onShowTerms,onShowPrivacy, footerBgEnabled, isDark }: Props) {
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

      <main className="pt-12 pb-24 px-6 md:px-10 max-w-5xl mx-auto relative flex-1 w-full">
        {/* Atmospheric Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#c7c4d8_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 pointer-events-none -z-10"></div>

        {/* Hero Section */}
        <header className="mb-20 text-center md:text-left animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed mb-6">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            <span className="text-label-md font-medium tracking-wide">Privacy First</span>
          </div>
          <h1 className="font-headline font-black text-6xl md:text-7xl text-on-surface tracking-tighter mb-8">
            Privacy Policy
          </h1>
          <p className="font-headline text-2xl md:text-3xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
            Your data stays with <span className="text-primary font-bold">you</span>. In a world of noise, we offer a sanctuary of pure logic and total anonymity.
          </p>
        </header>

        {/* The Core Promise Card */}
        <section className="animate-fade-up bg-surface-container-lowest rounded-4xl p-8 md:p-16 shadow-[0_20px_40px_rgba(25,28,30,0.04)] mb-16 border border-outline-variant/10" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="font-headline font-bold text-3xl mb-6 text-on-surface">The Mathematical Core</h2>
              <p className="text-on-surface-variant text-lg leading-loose mb-6">
                We believe that Sudoku should be a private ritual. Unlike typical apps that track every tap, Sudoku Sanctuary is built as an offline-first experience.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <p className="text-on-surface font-medium">Progress is stored locally on your device.</p>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <p className="text-on-surface font-medium">Game states never leave your browser.</p>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <p className="text-on-surface font-medium">Personal preferences are yours alone.</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-square rounded-full bg-linear-to-br from-primary to-primary-container relative overflow-hidden flex items-center justify-center p-1 ">
                <div className="bg-surface-container-lowest w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                    alt="Privacy Screen Asset"
                    src="/privacy_screen.png"
                  />
                </div>
                {/* Decorative Floaties */}
                <div className="absolute top-10 left-10 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-8 h-8 bg-secondary-fixed rounded-xl rotate-45 border-4 border-primary/20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Sections (Bento-ish Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Section 1 */}
          <div className="animate-fade-up bg-surface-container-low p-10 rounded-4xl border border-transparent hover:border-primary/10 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(53,37,205,0.12)] group cursor-default" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center mb-8 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <span className="material-symbols-outlined text-white">search_off</span>
            </div>
            <h3 className="font-headline font-bold text-2xl mb-4 text-on-surface">Information Collection</h3>
            <p className="text-on-surface-variant leading-relaxed">
              We collect <span className="font-bold text-on-surface">none</span> of your personal information. No names, no emails, and no tracking cookies. Our app is a "Black Box" that operates entirely within your local environment.
            </p>
          </div>
          {/* Section 2 */}
          <div className="animate-fade-up bg-surface-container-low p-10 rounded-4xl border border-transparent hover:border-primary/10 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(53,37,205,0.12)] group cursor-default" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-8 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <span className="material-symbols-outlined text-white">database</span>
            </div>
            <h3 className="font-headline font-bold text-2xl mb-4 text-on-surface">Data Usage</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Any data generated (saved games, settings, or statistics) is used exclusively to facilitate your gameplay. It resides in your device's local storage and is cleared only if you choose to wipe your site data.
            </p>
          </div>
          {/* Section 3 (Full Width) */}
          <div className="animate-fade-up md:col-span-2 bg-surface-container p-10 md:p-16 rounded-4xl border border-primary/5 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(53,37,205,0.12)] group cursor-default" style={{ animationDelay: '0.4s' }}>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="max-w-xl">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-8 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                  <span className="material-symbols-outlined text-white">share_off</span>
                </div>
                <h3 className="font-headline font-bold text-2xl mb-4 text-on-surface">Third-Party Sharing</h3>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  Since no data is collected, there is simply nothing to share. We do not integrate with third-party analytics, advertising networks, or social media trackers. Your puzzle-solving journey is anonymous.
                </p>
              </div>
              <div className="hidden lg:block text-primary/10 select-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
                <span className="material-symbols-outlined text-[180px]" style={{ fontVariationSettings: "'wght' 800" }}>shield_person</span>
              </div> 
            </div>
          </div>
        </div>

        {/* Mantra Section */}
        <section className="animate-fade-up mb-24 text-center" style={{ animationDelay: '0.5s' }}>
          <div className="bg-surface-container-lowest rounded-4xl p-12 md:p-20 shadow-[0_20px_40px_rgba(25,28,30,0.04)] border border-primary/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#c7c4d8_1px,transparent_1px)] bg-size-[40px_40px] opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"></div>
            <div className="relative z-10">
              <div className="text-primary/40 mb-8 transition-transform duration-500 group-hover:scale-125 flex justify-center">
                <span className="material-symbols-outlined text-4xl">auto_awesome</span>
              </div>
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-8 tracking-tight">
                संगच्छध्वं संवदध्वं संवो मनांसि जानताम्
              </h2>
              <div className="max-w-2xl mx-auto">
                <p className="font-body text-xl text-on-surface-variant leading-relaxed italic">
                  "Walk together, speak together, let your minds be of one accord."
                </p>
                <div className="mt-6 flex items-center justify-center gap-3 text-label-md font-medium text-primary/60">
                  <span className="h-px w-8 bg-primary/20"></span>
                  <span>Rig Veda 10.191.2</span>
                  <span className="h-px w-8 bg-primary/20"></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Game CTA */}
        <div className="flex justify-center mb-12 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <button onClick={onClose} className="group relative px-12 py-5 bg-linear-to-br from-primary to-primary-container text-white font-headline font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_0_rgba(79,70,229,0.4)] hover:brightness-110 active:scale-95">
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl scale-150"></span>
            <span className="relative z-10 flex items-center gap-2">
              Back to the Sanctuary
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
          </button>
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
              <button onClick={onShowPrivacy} className="text-primary font-medium tracking-wide cursor-pointer">Privacy Policy</button>
              <button onClick={onShowTerms} className="text-on-surface-variant hover:text-primary transition-all font-medium tracking-wide cursor-pointer">Terms of Service</button>
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
