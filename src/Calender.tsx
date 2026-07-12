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

  const themeClasses: Record<ThemeMode, string> = {
    'light': 'bg-(--color-background-tint) text-(--color-text-visible) border border-gray-200',
    'dark': 'bg-gray-900 text-gray-100 border border-gray-800',
    'minimal-blue': 'bg-slate-50 text-slate-800 border border-blue-100'
  };

  const handleOpenDay = (day: CalendarDay) => {
    selectDay(day);
    setNoteInput(day.note || '');
    setStreakInput(day.isStreak || false);
  };

  return (
    <div className={`w-full mx-auto p-4 mt-5 rounded-xl shadow-sm transition-all duration-500 ease-out ibm-plex-mono-semibold ${themeClasses[theme]} backdrop-blur-sm/10 hover:scale-102 hover:border-(--color-primary)/30`}>

      {/* Calendar Header Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b-3 border-current opacity-80">
        {/* Month Navigation */}
        <div className="flex items-center justify-center w-full lg:w-auto gap-2">
          <button
            onClick={() => changeMonth("prev")}
            className="p-2 hover:opacity-80 cursor-pointer pt-3"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <span className="text-2xl font-bold w-32 text-center">
            {MONTH_NAMES[currentMonth]}
          </span>

          <button
            onClick={() => changeMonth("next")}
            className="p-2 hover:opacity-80 cursor-pointer pt-3"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Selects */}
        <div className="flex flex-wrap justify-center lg:justify-end items-center gap-3 w-full lg:w-auto">
          <select
            value={currentYear}
            onChange={(e) =>
              jumpToYearMonth(Number(e.target.value), currentMonth)
            }
            className="bg-transparent border-2 border-current rounded-md px-2 py-1.5 text-sm font-semibold outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {yearsRange.map((y) => (
              <option key={y} value={y} className="text-black bg-white">
                {y}
              </option>
            ))}
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
            className="bg-transparent border-2 border-current rounded-md px-2 py-1.5 text-sm font-semibold outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <option value="light" className="text-black bg-white">
              Light
            </option>
            <option value="dark" className="text-black bg-white">
              Dark
            </option>
            <option value="minimal-blue" className="text-black bg-white">
              Blue Minimal
            </option>
          </select>
        </div>
      </div>

      {/* Weekday Indicator Row */}
      <div className="grid grid-cols-7 gap-1 text-center py-3 font-semibold text-lg uppercase">
        {WEEKDAYS.map((day, idx) => (
          <span key={day} className={idx === 0 ? 'text-red-500' : 'opacity-80'}>
            {day}
          </span>
        ))}
      </div>

      {/* Dynamic 2D Days Grid Box */}
      <div className="grid grid-cols-7 gap-1">
        {daysGrid.flat().map((day, index) => (
          <div
            key={index}
            onClick={() => handleOpenDay(day)}
            className={`aspect-square p-1 border-3 border-current border-opacity-5 text-lg rounded flex flex-col justify-between cursor-pointer transition-all relative
              ${day.isCurrentMonth ? 'opacity-100' : 'opacity-30'}
              ${day.isToday ? 'ring-2 ring-blue-500' : ''}
              ${day.challengeCompleted ? 'bg-emerald-500 bg-opacity-20 border-emerald-400 text-white hover:border-violet-700 hover:bg-opacity-5 hover:bg-orange-500 bg-opacity-20' : ""}
            `}
          >
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${day.isSunday ? 'text-red-500' : ''}`}>
                {day.dayNumber}
              </span>
              <div className="flex items-center gap-0.5">
                {day.challengeCompleted && <span className="text-xs" title="Daily Challenge Completed">🎯</span>}
              </div>
            </div>

            {day.note && (
              <div className="text-[10px] truncate max-w-full text-black bg-opacity-10 rounded px-1 mt-1">
                {day.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Embedded Drawer Detail Sidebar/Modal for Notes Management */}
      {selectedDayData && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white text-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">Details for {selectedDayData.dateStr}</h3>

            {/* Daily Challenge status */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Challenge Status:</span>
              {selectedDayData.challengeCompleted ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span>🎯</span> Completed
                </span>
              ) : (
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <span>⚪</span> Not Completed
                </span>
              )}
            </div>

            <textarea
              className="w-full border border-gray-200 rounded-lg p-2 text-sm h-28 focus:outline-blue-500"
              placeholder="Write local diary logs/notes here..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />

            <label className="flex items-center gap-2 my-4 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={streakInput}
                onChange={(e) => setStreakInput(e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              Mark as Daily Streak Activity
            </label>

            <div className="flex justify-end gap-2 text-sm font-medium">
              <button onClick={closeModal} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => {
                  saveDayData(selectedDayData.dateStr, noteInput, streakInput);
                  closeModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}