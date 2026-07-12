import { useEffect, useState } from 'react';
import AnimatedDivider from './Components/AnimatedDivider';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import StreakCard from './Components/StreakCard';
import Calender from './Calender';

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

  const activityStats = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity-icon lucide-activity"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></svg>
    )
  }

  const dailyStats = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ferris-wheel-icon lucide-ferris-wheel"><circle cx="12" cy="12" r="2" /><path d="M12 2v4" /><path d="m6.8 15-3.5 2" /><path d="m20.7 7-3.5 2" /><path d="M6.8 9 3.3 7" /><path d="m20.7 17-3.5-2" /><path d="m9 22 3-8 3 8" /><path d="M8 22h8" /><path d="M18 18.7a9 9 0 1 0-12 0" /></svg>
    )
  }

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
            <div className="fixed inset-0 bg-surface z-[-2]" />
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
        <h1 className="flex items-center justify-center gap-3 mt-8 mb-4 text-2xl text-center font-bold ibm-plex-mono-bold text-on-surface">
          <span>Daily Checkout!</span>
          <span className="font-normal text-xl opacity-90 hover:animate-shakeTrophy">{activityStats()}</span>
        </h1>
        <StreakCard
          currentStreak={currentStreak}
          timeLeft={timeLeft}
          onShowDailyChallenge={onShowDailyChallenge}
          isDailyChallengeCompleted={dailyChallengeCompleted}
        />
        <h1 className="flex items-center justify-center gap-3 mt-8 mb-4 text-2xl text-center font-bold ibm-plex-mono-bold text-on-surface">
          <span>My Stats Tracker!</span>
          <span className="font-normal text-xl opacity-90 hover:animate-shakeTrophy">{dailyStats()}</span>
        </h1>
        
        <Calender />
      </main>

      {/*Animated Divider*/}
      <AnimatedDivider marginClass="mt-0" />
      {/*Footer */}
      <Footer onShowPrivacy={onShowPrivacy} onShowTerms={onShowTerms} footerBgEnabled={footerBgEnabled} isDark={isDark} />

    </div>
  )
}
