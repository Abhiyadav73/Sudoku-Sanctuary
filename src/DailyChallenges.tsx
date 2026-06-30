import { useEffect } from 'react';
import AnimatedDivider from './Components/AnimatedDivider';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';

interface Props {
  onClose: () => void;
  onShowHowToPlay: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
  onShowTerms: () => void;
  footerBgEnabled?: boolean;
  isDark?: boolean;
  onShowPrivacy: () => void;
}

export default function DailyChallenges({ onClose, onShowHowToPlay, onShowStats, onShowSettings, onShowTerms, onShowPrivacy, footerBgEnabled, isDark }: Props) { 
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
      
      {/* Main content */}
      <main className='pt-12 pb-24 px-6 md:px-10 max-w-5xl mx-auto relative flex-1 w-full'>
        <h1>Streak and calender</h1>
      </main>
      
      {/*Animated Divider*/}
      <AnimatedDivider marginClass="mt-0"/>
      {/*Footer */}
      <Footer onShowPrivacy={onShowPrivacy} onShowTerms={onShowTerms} footerBgEnabled={footerBgEnabled} isDark={isDark}/>

    </div>
  )
}
 