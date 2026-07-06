
interface StreakCardProps {
    currentStreak?: number;
    timeLeft?: string;
    streakMessage?: string;
    onShowDailyChallenge?: () => void;
    /** True if the player has already completed today's daily challenge */
    isDailyChallengeCompleted?: boolean;
}

export default function StreakCard({ 
    currentStreak = 5,
    timeLeft = "22:45:10",
    streakMessage = "You're on fire! Keep it up.",
    onShowDailyChallenge,
    isDailyChallengeCompleted = true,
}: StreakCardProps) {
    return (
        <div className="w-full bg-(--color-surface-container-low-tint)/80 backdrop-blur-sm/10 p-5 md:p-6 rounded-2xl border border-(--color-outline-variant)/10 shadow-sm hover:shadow-[0_0_25px_5px_var(--color-primary)]/15 hover:scale-102 hover:border-(--color-primary)/30 transition-all duration-500 ease-out" style={{ backgroundColor: isDailyChallengeCompleted ? '#4caf50' : 'var(--color-surface-container-low-tint)' }}
> 
            <div className="hidden md:flex flex-col gap-3 w-full"> 
                {/* Row 1 */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        {/* Animated Fire GIF Container with Number Overlaid */}
                        <div className="relative flex items-center justify-center w-14 h-14 select-none group">
                            <img
                                src="firegif.gif"
                                alt="Animated Flame"
                                className="w-full h-full object-contain scale-125 transition-transform duration-300 group-hover:scale-135"
                            />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-(--color-primary) font-bold text-base tracking-wide">
                                Sudoku Streak
                            </span>
                            <span className="text-xs text-(--color-on-surface-variant) uppercase tracking-wider font-medium opacity-80">
                                {currentStreak} Consecutive Days
                            </span>
                        </div>
                    </div>

                    {/* Today Badge */}
                    <button
                        onClick={onShowDailyChallenge}
                        className="px-4 py-1.5 bg-(--color-surface-container-high-tint)/80 text-(--color-text-tint) titillium-web-bold border border-(--color-primary)/20 rounded-[5px] text-lg font-bold uppercase tracking-widest hover:animate-pulse cursor-pointer"
                    >
                        Daily Challenge
                    </button>
                </div> 

                {/* Row 2 */}
                <div className="flex items-center justify-between w-full">
                    <p className="text-sm font-medium text-(--color-on-surface-variant) italic">
                        "{streakMessage}"
                    </p>
                    <div className="flex items-center gap-2 bg-(--color-surface-container-lowest) border text-lg border-(--color-outline-variant)/30 px-3 py-1.5 rounded-xl">
                        <span className="text-[10px] text-(--color-on-surface-variant) font-bold uppercase tracking-wider">
                            Resets In:
                        </span>
                        <span className="font-mono text-sm font-bold text-(--color-primary) tracking-tabular-nums">
                            {timeLeft}
                        </span>
                    </div>
                </div>
            </div>

                    {/* 
                MOBILE MODE: Compact Stacked Layout
                Flex on mobile, hidden on md screens and up
            */}
            <div className="flex md:hidden flex-col items-center text-center w-full">
                <span className="text-(--color-primary) font-bold text-lg tracking-wide mb-1">
                    Streak
                </span>

                {/* Centered Fire GIF + Number Overlay */}
                <div className="relative flex items-center justify-center w-28 h-28 my-2 select-none">
                    <img
                        src="firegif.gif"
                        alt="Animated Flame"
                        className="w-full h-full object-contain scale-110"
                    />
                    {/* Text heavily shadow-dropped to maintain maximum readability against moving fire */}
                    <span className="absolute inset-0 flex items-center justify-center font-headline font-black text-3xl text-(--color-on-surface) drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)] pt-4">
                        {currentStreak}
                    </span>
                </div>

                <span className="text-xs text-(--color-on-surface-variant) font-semibold uppercase tracking-widest opacity-90">
                    {currentStreak} Days Active
                </span>

                <p className="text-sm font-medium text-(--color-on-surface) mt-2 px-4 italic">
                    "{streakMessage}"
                </p>

                {/* Small Ticking Countdown centered below the message */}
                <div className="mt-4 flex items-center gap-2 bg-(--color-surface-container-lowest) border border-(--color-outline-variant)/30 px-4 py-1.5 rounded-xl">
                    <span className="text-[10px] text-(--color-on-surface-variant) font-bold uppercase tracking-wider">
                        Next Day In:
                    </span>
                    <span className="font-mono text-xs font-bold text-(--color-primary) tracking-widest">
                        {timeLeft}
                    </span>
                </div>
            </div>

        </div>
    );
}