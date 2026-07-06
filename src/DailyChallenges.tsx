import { useEffect, useState } from 'react';
import AnimatedDivider from './Components/AnimatedDivider';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import StreakCard from './Components/StreakCard';

interface Props {
  onClose: () => void;
  onShowHowToPlay: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
  onShowTerms: () => void;
  footerBgEnabled?: boolean;
  isDark?: boolean;
  appBgEnabled?: boolean;
  onShowPrivacy: () => void;
  onShowDailyChallenge: () => void;
  currentStreak?: number;
  dailyChallengeCompleted?: boolean;
}

export default function DailyChallenges({ onClose, onShowHowToPlay, onShowStats, onShowSettings, onShowTerms, onShowPrivacy, footerBgEnabled, isDark, appBgEnabled, onShowDailyChallenge, currentStreak, dailyChallengeCompleted }: Props) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
      );
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-100 bg-surface overflow-y-auto overflow-x-hidden font-body text-on-surface flex flex-col">
      {/* TopAppBar */}
      <Navbar onShowHowToPlay={onShowHowToPlay} onShowStats={onShowStats} onShowSettings={onShowSettings} onClose={onClose} />

      {/* Main content */}
      <main
        className={`pt-12 pb-24 px-6 md:px-10 max-w-5xl mx-auto relative flex-1 w-full ${appBgEnabled ? "" : "bg-surface"
          }`}
      >
        {appBgEnabled && (
          <>
            {/* Solid base behind image */}
            <div className="fixed inset-0 bg-surface z-[-2]" />

            {/* Theme-specific background image */}
            <div
              className="fixed inset-0 pointer-events-none z-[-1]"
              style={{
                backgroundImage: `url('${isDark ? "/dotted-dark.jpeg" : "/dotted.png" 
                  }')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isDark ? 0.9 : 0.17,
                mixBlendMode: isDark ? "screen" : "multiply",
              }}
            />
          </>
        )}
        <StreakCard 
          currentStreak={currentStreak} 
          timeLeft={timeLeft} 
          onShowDailyChallenge={onShowDailyChallenge}
          isDailyChallengeCompleted={dailyChallengeCompleted}
        />
      </main>

      {/*Animated Divider*/}
      <AnimatedDivider marginClass="mt-0" />
      {/*Footer */}
      <Footer onShowPrivacy={onShowPrivacy} onShowTerms={onShowTerms} footerBgEnabled={footerBgEnabled} isDark={isDark} />

    </div>
  )
}
