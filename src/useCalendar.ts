import { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService} from './dbService';
import type { DatePayload } from './dbService';

export type ThemeMode = 'light' | 'dark' | 'minimal-blue';

export interface CalendarDay {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  note?: string;
  isStreak?: boolean;
  challengeCompleted?: boolean;
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useCalendar(initialTheme: ThemeMode = 'light') {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [dbRecords, setDbRecords] = useState<Record<string, DatePayload>>({});
  const [selectedDayData, setSelectedDayData] = useState<CalendarDay | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const refreshData = useCallback(async () => {
    try {
      const allRecords = await dbService.getAll();
      const recordsMap = allRecords.reduce((acc, curr) => {
        acc[curr.dateStr] = curr;
        return acc;
      }, {} as Record<string, DatePayload>);
      setDbRecords(recordsMap);
    } catch (err) {
      console.error('Failed to load storage values', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const yearsRange = useMemo(() => {
    const startYear = new Date().getFullYear() - 10;
    return Array.from({ length: 21 }, (_, i) => startYear + i);
  }, []);

  const changeMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const nextDate = new Date(prev.getFullYear(), prev.getMonth(), 1);
      nextDate.setMonth(direction === 'prev' ? nextDate.getMonth() - 1 : nextDate.getMonth() + 1);
      return nextDate;
    });
  }, []);

  const jumpToYearMonth = useCallback((year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
  }, []);

  const selectDay = useCallback((day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      setCurrentDate(day.date);
    }
    setSelectedDayData(day);
  }, []);

  const saveDayData = useCallback(async (dateStr: string, noteText: string, markStreak: boolean) => {
    const existing = dbRecords[dateStr];
    const updated = {
      ...existing,
      dateStr,
      note: noteText,
      isStreak: markStreak
    };
    await dbService.put(updated);
    await refreshData();
    if (selectedDayData && selectedDayData.dateStr === dateStr) {
      setSelectedDayData(prev => prev ? { ...prev, ...updated } : null);
    }
  }, [dbRecords, selectedDayData, refreshData]);

  const daysGrid = useMemo((): CalendarDay[][] => {
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = startOfMonth.getDay(); 
    
    const gridStartDate = new Date(startOfMonth);
    gridStartDate.setDate(gridStartDate.getDate() - startDayOfWeek);

    const today = new Date();
    const rows: CalendarDay[][] = [];
    const trackingDate = new Date(gridStartDate);

    for (let r = 0; r < 6; r++) {
      const row: CalendarDay[] = [];
      for (let d = 0; d < 7; d++) {
        const dateCopy = new Date(trackingDate);
        const dateStr = formatLocalDate(dateCopy);
        const savedInfo = dbRecords[dateStr];

        row.push({
          date: dateCopy,
          dateStr,
          dayNumber: dateCopy.getDate(),
          isCurrentMonth: dateCopy.getMonth() === currentMonth,
          isToday: dateCopy.toDateString() === today.toDateString(),
          isSunday: dateCopy.getDay() === 0,
          note: savedInfo?.note || '',
          isStreak: savedInfo?.isStreak || false,
          challengeCompleted: savedInfo?.challengeCompleted || false
        });
        trackingDate.setDate(trackingDate.getDate() + 1);
      }
      rows.push(row);
      
      const checkNextMonth = new Date(trackingDate);
      if (checkNextMonth.getMonth() !== currentMonth && checkNextMonth.getDate() > checkNextMonth.getDay()) {
        break;
      }
    }
    return rows;
  }, [currentYear, currentMonth, dbRecords]);

  return {
    currentDate,
    currentYear,
    currentMonth,
    daysGrid,
    yearsRange,
    theme,
    selectedDayData,
    setTheme,
    changeMonth,
    jumpToYearMonth,
    selectDay,
    saveDayData,
    closeModal: () => setSelectedDayData(null)
  };
}