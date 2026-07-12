import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import AnimatedDivider from './Components/AnimatedDivider';
import Indicator from './Components/Indicator';

interface WelcomeScreenProps {
  onStart: () => void;
  onSettings: () => void;
  onHowToPlay: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onStats: () => void;
  footerBgEnabled: boolean;
  isDark: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onSettings, onHowToPlay, onPrivacy, onTerms, onStats, footerBgEnabled, isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      
      const floatEls = document.querySelectorAll('.asymmetric-float');
      floatEls.forEach(el => {
          (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
      
      const grid = document.querySelector('.floating-grid-element') as HTMLElement;
      if (grid) {
          const rect = grid.getBoundingClientRect();
          const gridX = (e.clientX - (rect.left + rect.width / 2)) * 0.02;
          const gridY = (e.clientY - (rect.top + rect.height / 2)) * 0.02;
          grid.style.transform = `rotateY(${gridX}deg) rotateX(${-gridY}deg)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const powerSvg=()=>{
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true" fill="currentColor" className="w-5 h-5 shrink-0"><path d="M434.8 54.1C446.7 62.7 451.1 78.3 445.7 91.9L367.3 288L512 288C525.5 288 537.5 296.4 542.1 309.1C546.7 321.8 542.8 336 532.5 344.6L244.5 584.6C233.2 594 217.1 594.5 205.2 585.9C193.3 577.3 188.9 561.7 194.3 548.1L272.7 352L128 352C114.5 352 102.5 343.6 97.9 330.9C93.3 318.2 97.2 304 107.5 295.4L395.5 55.4C406.8 46 422.9 45.5 434.8 54.1z"/></svg> 
    )
  }

  useEffect(() => {
    const typed = new Typed('#typed', {
      strings: ["Fun","Brain Storm","Engaging","Challenging"],
      typeSpeed: 40,
      backSpeed: 30,
      smartBackspace: true,
      loop: true,
      cursorChar: '!' 
    });
    
     return () => typed.destroy();
   }, []);

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden font-body" ref={containerRef}>
      <style>{`
        .font-headline { font-family: 'Manrope', sans-serif; }
        .hero-gradient { background: linear-gradient(135deg, #3525cd 0%, #4f46e5 100%); }
        .glass-panel { backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.8); }
        
        @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floating-grid {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(10px, -15px) rotate(0.5deg); }
            66% { transform: translate(-5px, -10px) rotate(-0.5deg); }
        }

        .animate-fade-up {
            opacity: 0;
            animation: fade-up 0.8s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }

        .floating-grid-element {
            animation: floating-grid 8s ease-in-out infinite;
            transform-style: preserve-3d;
        }

        .nav-link-underline {
            position: relative;
        }
        .nav-link-underline::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: currentColor;
            transition: width 0.3s ease;
        }
        .nav-link-underline:hover::after {
            width: 100%;
        }

        @media (prefers-reduced-motion: reduce) {
            .animate-fade-up, .floating-grid-element, .asymmetric-float {
                animation: none !important;
                transform: none !important;
                opacity: 1 !important;
            }
            .transition-all, .transition-transform {
                transition: none !important;
            }
        }
        
        .asymmetric-float { animation: float 6s ease-in-out infinite; }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
      `}</style>
      
      {/* TopAppBar */}
      <Indicator/>
      <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/10">
        <nav className="flex justify-between items-center px-10 py-6 w-full max-w-7xl mx-auto">
          <div className="text-display-md font-headline font-black text-primary tracking-tight cursor-default text-xl">
            <span className='bigbesty animate-fade-in text-2xl'>Sudoku Sanctuary</span> 
          </div>
          <div className="hidden md:flex items-center gap-10">
            <button onClick={onStart} className="nav-link-underline hover:text-primary transition-colors duration-300"><span className='titillium-web-regular text-lg font-semibold'>Play</span></button>  
            <button onClick={onHowToPlay} className="nav-link-underline hover:text-primary transition-colors duration-300"><span className='titillium-web-regular text-lg font-semibold'>How to Play ?</span></button>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onSettings} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all duration-300 hover:rotate-90">settings</button>
          </div>
        </nav>
      </header>

      <main className="pt-24 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative px-10 py-20 md:py-32 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-16 overflow-hidden">
          {/* Text Content */}
          <div className="flex-1 z-10 text-center lg:text-left ">
            <span className="animate-fade-up inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-label-md font-medium tracking-wide mb-6 hover:scale-105 transition-all duration-300"> 
              A Pure Logic Experience {powerSvg()} 
            </span>
            <h1 className="animate-fade-up font-headline text-5xl sm:text-6xl md:text-8xl font-black text-on-surface tracking-tighter leading-[1.1] mb-8 flex flex-col">
              <span>Play with</span> <span className='flex items-center lg:justify-start justify-center gap-1'> <span className="text-primary" id="typed">Fun</span> </span>
            </h1>
            <p className="animate-fade-up text-on-surface-variant text-xl md:text-2xl leading-relaxed max-w-xl mb-12 font-body font-normal">
              Find your flow in the mathematical sanctuary. An editorial-grade puzzle experience designed for deep focus and cognitive serenity.
            </p>
            <div className="animate-fade-up flex flex-col sm:flex-row gap-6 justify-center lg:justify-start" style={{ animationDelay: '0.4s' }}>
              <button onClick={onStart} className="bg-primary text-on-primary px-10 py-5 rounded-full text-label-md font-bold tracking-wider shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 active:scale-95">
                ENTER SANCTUARY
              </button>
              <button onClick={onHowToPlay} className="px-10 py-5 rounded-full border border-outline-variant text-on-surface text-label-md font-bold tracking-wider hover:bg-surface-container-low hover:border-primary/50 transition-all duration-300 active:scale-95">
                LEARN THE LOGIC
              </button>
            </div>
          </div>
          
          {/* Visual Component: The Abstract Board */}
          <div className="flex-1 relative w-full aspect-square max-w-135 flex items-center justify-center perspective-[1000px]">
            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30 asymmetric-float"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30 asymmetric-float" style={{ animationDelay: '2s' }}></div>
            
            {/* Geometric Grid Representation */}
            <div className="floating-grid-element relative z-10 w-full aspect-square bg-surface-container-lowest shadow-2xl shadow-on-surface/5 rounded-xl p-6 border border-outline-variant/10">
              <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
                {/* 9 Macro Blocks */}
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg opacity-20">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg">
                  <div className="bg-white flex items-center justify-center font-headline text-primary font-bold">5</div>
                  <div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white flex items-center justify-center font-headline text-primary font-bold">1</div><div className="bg-white"></div>
                </div>
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg opacity-20">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg">
                  <div className="bg-white"></div><div className="bg-white flex items-center justify-center font-headline text-primary font-bold">2</div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white flex items-center justify-center font-headline text-primary font-bold">8</div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
                <div className="bg-primary-container/10 grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-primary flex items-center justify-center font-headline text-on-primary font-black rounded-sm shadow-lg shadow-primary/30">9</div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white flex items-center justify-center font-headline text-primary font-bold">4</div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white flex items-center justify-center font-headline text-primary font-bold">7</div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg opacity-20">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg">
                  <div className="bg-white"></div><div className="bg-white flex items-center justify-center font-headline text-primary font-bold">6</div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white flex items-center justify-center font-headline text-primary font-bold">3</div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
                <div className="bg-surface-container grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded-lg opacity-20">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto w-full px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4 p-8 rounded-2xl hover:bg-surface-container-low hover:-translate-y-2 transition-all duration-300 group">
            <h3 className="text-display-sm text-4xl font-headline font-black text-on-surface group-hover:text-primary transition-colors">10k+</h3>
            <p className="text-on-surface-variant font-body">Unique daily puzzles curated for logical perfection.</p>
          </div>
          <div className="flex flex-col gap-4 p-8 rounded-2xl hover:bg-surface-container-low hover:-translate-y-2 transition-all duration-300 group">
            <h3 className="text-display-sm text-4xl font-headline font-black text-on-surface group-hover:text-primary transition-colors">No Ads.</h3>
            <p className="text-on-surface-variant font-body">Zero interruptions to protect your focus and sanctuary.</p>
          </div>
          <div className="flex flex-col gap-4 p-8 rounded-2xl hover:bg-surface-container-low hover:-translate-y-2 transition-all duration-300 group">
            <h3 className="text-display-sm text-4xl font-headline font-black text-on-surface group-hover:text-primary transition-colors">Any Device.</h3>
            <p className="text-on-surface-variant font-body">Seamless mathematical flow from mobile to desktop.</p>
          </div>
        </section>

        {/* Gallery / Visual Mood */}
        <section className="px-10 py-24 bg-surface-container-low w-full" id="gallery">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div className="max-w-2xl reveal-on-scroll opacity-0">
                <h2 className="font-headline text-4xl font-bold mb-4">Architecture of Mind</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg">We strip away the noise of traditional gaming. No timers unless you want them. No scores that don't reflect your logic. Just you and the grid.</p>
              </div>
              <div className="hidden md:block reveal-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
                <button onClick={onStats} className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all group tracking-wider uppercase text-sm">
                  <span>EXPLORE STATS</span>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal-on-scroll opacity-0" style={{ animationDelay: '0.4s' }}>
              <div className="aspect-4/5 bg-white rounded-full overflow-hidden shadow-sm group cursor-pointer">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" alt="A minimalist architectural shot of a clean white building" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAfEpamzEGRozXJRIaD7orWwkh-XlPH8-L-Flmd6rJ742PcTtfVLo3ZkHWzYD8Yih7frDPib6w5_Gb6dNzHZ0QcMuAqcITSu7e7lXbUZ0JKlspX-P37h6fsxJLvOlLJvPfQbxUxB83UDW6NzuAinQLoATfYxu-BiFN5DbNzQ1fpf8ACyl6P7TmigvHRlVr1wvwFFpl1H0LUD8SGz-IppuG1DYaZVkei9S-tYI4Z6kBJwTckBw-Z2Ud-lh9Mt76EryMQ4OLBUUTXj6c" />
              </div>
              <div className="aspect-4/5 bg-white rounded-full overflow-hidden shadow-sm mt-12 group cursor-pointer">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" alt="An abstract digital composition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm3jlFQR3d0ZnL5FgyQR9iOzXizOWkWwW-6mxSs-ARRhz6krXFpnW2kejkNOJ8akKfJblr9y7KWczFJuHcgL2wnpTdrTVE8_QbefKjdIkqneiL1lR4G0is8yXibTGpqD4T99Gy-kn2LAjbUW1l6T4TxD9IyfaqR21fvO5cnHJmo4sMJSkc7jMNkZU6G9Jn69Q0mwWcO4dL6Md5nnpI5P6R9mG14MJPCmKN6R5UKk217J0OLOnkh2sYgxRFuOFJYkjYI8CQ1CYcR1I3" />
              </div>
              <div className="aspect-4/5 bg-white rounded-full overflow-hidden shadow-sm group cursor-pointer">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" alt="A high-end modern library or study space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb0H5424Fus2_mpb8kVEJDlvKlkcgNxVnN91BE-fgV6DhJFshTXUBl6CXlEZ8F4EjLNTEEeZQwS4g88-MARsdd2q23G5mCk2hI2iN5wC06_EkrMz9MaySujN7UY3yUG7zl0nu9oHebLdTAdR-z2nfYr3dWkX6iZhfl_mB6sGYmqFT-VUyW9C15VRl1exvZBVpIfWd3g7ugPaTOlP4NHt563E9fdkYOKTXBHAMzebSnU_8cascZKPf5eJnq-OedoTqmOGfUnQ7ghGuu" />
              </div>
              <div className="aspect-4/5 bg-white rounded-full overflow-hidden shadow-sm mt-12 group cursor-pointer flex items-center justify-center">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" alt="A macro photograph of clean, white paper with subtle geometric folds" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR73RQKLOWIBtXd6wi44QUtMQcl3wiEQVU9Ft6K3wkdPhBXPTnG8oELcWCRlDRfO7phQ4FiMR8IKQUfJGu7x8dzQNJ9IQJsQCMmlV1Cj1T_D9fI2IrPz0g6bBh8nwOPW1cHo_P6fOrALeNmAJMK7mz3HJU9DfVfwGN4hzJk5PKkHXlJGvDLz0PlTdR5CSak7ePCGc1FEkLEkOcBOQLyLTsyzqLDaFx5KnohCREqbM2GZLt_HhdvmYzf-KMsgSzGaz4DVkvLie2I2leIeA" />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <AnimatedDivider marginClass="mt-0"/> 
      {/* Footer */}
      <footer className="w-full mt-auto flex flex-col">
        {/* Layer 1 - Welcome text with optional bg image */}
        <div 
          className={`w-full relative ${footerBgEnabled ? '' : 'bg-surface-container-low dark:bg-surface-container-low'} border-t border-outline-variant/10`}
          style={footerBgEnabled ? {
            backgroundImage: `url('${isDark ? 'w-footer-dark.png' : 'w-footer-lite.png'}')`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          {footerBgEnabled && (
            <div className="absolute inset-0 z-0" style={{
              background: isDark ? 'linear-gradient(to bottom, rgba(25,28,30,0.8), rgba(25,28,30,0.95))' : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95))'
            }} />
          )}

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center px-5 py-3 w-full gap-6 max-w-7xl mx-auto">
            <div className="w-full flex flex-col items-center justify-center py-6">
              <h2 className="font-headline text-4xl md:text-5xl font-black text-primary text-center" style={{ fontFamily: '"Dancing Script", cursive' }}>
                Let's play Sudoku....
              </h2>
              <div className="px-6 py-2 bg-on-surface-variant text-surface-container-lowest rounded-full text-sm font-medium tracking-wide mt-6 shadow-sm">
                Sharpen your mind, one puzzle at a time.
              </div>
              <div className="mt-8 flex gap-8 items-center text-sm z-50">
                <button onClick={onPrivacy} className="text-primary font-bold uppercase tracking-wide hover:opacity-80 transition-opacity cursor-pointer">Privacy Policy</button>
                <button onClick={onTerms} className="text-on-surface-variant hover:text-primary transition-all font-medium uppercase tracking-wide cursor-pointer">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2 (last tier) - Always dark mode copyright */}
        <div className="w-full bg-[#191c1e] text-white py-4 border-t border-white/10">
          <div className="flex justify-center w-full px-10 max-w-7xl mx-auto">
            <div className="text-white/80 text-xs font-body tracking-widest font-semibold text-center">
              © {new Date().getFullYear()} Mindgames Sanctuary.All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
