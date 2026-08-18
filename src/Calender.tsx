import { useState } from 'react';
import { useCalendar } from './useCalendar';
import type { ThemeMode, CalendarDay } from './useCalendar';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MinimalCalendar() {
  const {
    currentYear, currentMonth, daysGrid, yearsRange, theme, selectedDayData,
    setTheme, changeMonth, jumpToYearMonth, selectDay, saveDayData, closeModal
  } = useCalendar('light');

  const [noteInput, setNoteInput] = useState('');
  const [streakInput, setStreakInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const themeClasses: Record<ThemeMode, string> = {
    'light': 'bg-(--color-background-tint) text-(--color-text-visible) border border-gray-200',
    'dark': 'bg-gray-900 text-gray-100 border border-gray-800',
    'minimal-blue': 'bg-blue-500/10 text-blue-800 border border-blue-100',
    'minimal-violet': 'bg-violet-500/10 text-violet-800 border border-violet-100',
  };

  const handleOpenDay = (day: CalendarDay) => {
    selectDay(day);
    setNoteInput(day.note || '');
    setStreakInput(day.isStreak || false);
    setIsEditing(false);
  };

  const handleMonthChange = (dir: 'prev' | 'next') => {
    setIsAnimating(true);
    changeMonth(dir);
    setTimeout(() => setIsAnimating(false), 250);
  };

  const handleYearMonthJump = (year: number, month: number) => {
    setIsAnimating(true);
    jumpToYearMonth(year, month);
    setTimeout(() => setIsAnimating(false), 250);
  };

  return (
    <div className={`w-full mx-auto p-4 md:p-6 mt-5 rounded-2xl shadow-lg transition-all duration-500 ease-out ibm-plex-mono-semibold ${themeClasses[theme]} backdrop-blur-sm hover:border-(--color-primary)/30`}>

      {/* Calendar Header Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b-2 border-current opacity-90">
        {/* Month Navigation */}
        <div className="flex items-center justify-center w-full lg:w-auto gap-3">
          <button
            onClick={() => handleMonthChange("prev")}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title="Previous Month"
          >
            <span className="material-symbols-outlined text-2xl select-none">chevron_left</span>
          </button>

          <span className={`text-2xl font-bold w-40 text-center transition-all duration-300 select-none ${isAnimating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
            {MONTH_NAMES[currentMonth]}
          </span>

          <button
            onClick={() => handleMonthChange("next")}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title="Next Month"
          >
            <span className="material-symbols-outlined text-2xl select-none">chevron_right</span>
          </button>
        </div>

        {/* Selects */}
        <div className="flex flex-wrap justify-center lg:justify-end items-center gap-3 w-full lg:w-auto">
          <select
            value={currentYear}
            onChange={(e) => handleYearMonthJump(Number(e.target.value), currentMonth)}
            className="bg-transparent border-2 border-current rounded-xl px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95"
          >
            {yearsRange.map((y) => (
              <option key={y} value={y} className="text-black bg-[#e3ddd3]">
                {y}
              </option>
            ))}
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
            className="bg-transparent border-2 border-current rounded-xl px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95"
          >
            <option value="light" className="text-white bg-[#8cd52d]">
              Light
            </option>
            <option value="dark" className="text-white bg-[#2c3e50]">
              Dark
            </option>
            <option value="minimal-blue" className="text-white bg-[#5ca4e2]">
              Blue Minimal
            </option>
            <option value="minimal-violet" className="text-white bg-[#b258e0]">
              Violet Minimal
            </option>
          </select>
        </div>
      </div>

      {/* Weekday Indicator Row */}
      <div className="grid grid-cols-7 gap-1 text-center py-3 font-bold text-base md:text-lg uppercase select-none">
        {WEEKDAYS.map((day, idx) => (
          <span key={day} className={idx === 0 ? 'text-red-500' : 'opacity-80'}>
            {day}
          </span>
        ))}
      </div>

      {/* Dynamic 2D Days Grid Box */}
      <div className={`grid grid-cols-7 gap-1.5 transition-all duration-300 ${isAnimating ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        {daysGrid.flat().map((day, index) => (
          <div
            key={index}
            onClick={() => handleOpenDay(day)}
            className={`aspect-square p-1.5 border-3 border-current/40 rounded-xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative select-none hover:scale-[1.06] hover:z-10 hover:shadow-md active:scale-95
              ${day.isCurrentMonth ? 'opacity-100' : 'opacity-35'}
              ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1 font-bold' : ''}
              ${day.challengeCompleted ? 'bg-emerald-500/20 border-emerald-400/80 shadow-sm hover:bg-amber-400' : 'hover:border-current/40'}
            `}
          >
            {day.challengeCompleted ? (
              <div className="flex-1 flex items-center justify-center text-xl md:text-2xl hover:scale-125 transition-transform" title="Daily Challenge Completed">
                🎯
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className={`text-xs md:text-sm font-semibold ${day.isSunday ? 'text-red-500' : ''}`}>
                  {day.dayNumber}
                </span>
              </div>
            )}

            {day.note && (
              <div className="text-[10px] truncate max-w-full bg-black/10 dark:bg-white/15 rounded px-1 py-0.5 mt-0.5 font-medium">
                <span className='w-2 h-2'></span>  
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Embedded Drawer Detail Sidebar/Modal for Notes Management */}
      {selectedDayData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 transform transition-all animate-scaleUp">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-bold">
                  {selectedDayData.dateStr}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Daily details
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400
                       bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition active:scale-95"
                >
                  ✏️ Edit
                </button>

                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center
                       rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">

              {/* Challenge Status */}
              <div className="mb-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50
                        flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Challenge Status
                </span>

                {selectedDayData.challengeCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    🎯 Completed
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                    ⚪ Not Completed
                  </span>
                )}
              </div>

              {/* ================= READ ONLY VIEW ================= */}
              {!isEditing && (
                <>
                  {selectedDayData.note?.trim() ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Diary Note
                      </p>

                      <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/40 rounded-xl p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                          {selectedDayData.note}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📝</div>

                      <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                        Do you want to write something?
                      </h4>

                      <p className="text-sm text-gray-400 dark:text-gray-400 mt-1 mb-5">
                        Add a diary note for this day.
                      </p>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white
                             rounded-xl text-sm font-medium
                             shadow-md hover:shadow-lg transition active:scale-95"
                      >
                        ✍️ Write
                      </button>
                    </div>
                  )}

                  {/* Streak status */}
                  {selectedDayData.isStreak && (
                    <div className="mt-5 flex items-center gap-2 text-sm
                              text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40
                              border border-orange-100 dark:border-orange-900/40 rounded-xl p-3">
                      🔥 This day counts as a streak activity
                    </div>
                  )}
                </>
              )}

              {/* ================= EDIT VIEW ================= */}
              {isEditing && (
                <>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Diary Note
                  </p>

                  <textarea
                    autoFocus
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         h-32 resize-none focus:outline-none
                         focus:ring-2 focus:ring-blue-500/30
                         focus:border-blue-500 transition"
                    placeholder="Write local diary logs/notes here..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />

                  <label className="flex items-center gap-2 my-5 text-sm
                              cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={streakInput}
                      onChange={(e) => setStreakInput(e.target.checked)}
                      className="w-4 h-4 accent-orange-500 rounded"
                    />

                    <span className="text-gray-600 dark:text-gray-300">
                      Mark as Daily Streak Activity
                    </span>
                  </label>

                  {/* Edit actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
                           rounded-xl text-sm font-medium transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        saveDayData(
                          selectedDayData.dateStr,
                          noteInput,
                          streakInput
                        );

                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl
                           shadow-md text-sm font-medium transition active:scale-95"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}