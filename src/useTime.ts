import { useState, useEffect } from 'react';

export interface TimeData {
  formattedTime: string; // "12:45AM IST +5:30GMT"
  timeZone: string;      // "Asia/Kolkata" or "America/New_York"
  country: string;       // "India" or "United States"
  loading: boolean;
}

export function useTime(overrideTimeZone?: string): TimeData {
  const [timeZone, setTimeZone] = useState<string>(overrideTimeZone || 'UTC');
  const [country, setCountry] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(!overrideTimeZone);

  // 1. Detect location via IP geolocation api if no override is provided
  useEffect(() => {
    if (overrideTimeZone) {
      setTimeZone(overrideTimeZone);
      return;
    }

    setLoading(true);
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data.timezone) {
          setTimeZone(data.timezone);
          setCountry(data.country);
        }
      })
      .catch(() => {
        // Fallback to browser's built-in timezone detection if API fails
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      })
      .finally(() => setLoading(false));
  }, [overrideTimeZone]);

  // 2. Keep the time ticking every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Format the date string precisely into your custom required layout
  const formatTimeDetails = (): string => {
  try {
    // 1. Get Time (e.g., "11:32AM")
    const timeStr = currentTime.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace(/\s+/g, ''); 

    // 2. Get Short Abbreviation (e.g., "IST", "EDT", "MSK")
    let abbreviation = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    })
      .formatToParts(currentTime)
      .find((part) => part.type === 'timeZoneName')?.value || '';

    // 3. Get Long Offset (e.g., "GMT+05:30", "GMT-04:00")
    const offsetStr = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    })
      .formatToParts(currentTime)
      .find((part) => part.type === 'timeZoneName')?.value || '';

    // 4. Extract and clean up the numeric offset (e.g., "+05:30" -> "+5:30")
    const rawOffset = offsetStr.replace('GMT', ''); // Left with "+05:30" or "-04:00"
    
    // Clean leading zeros from hours (e.g., "+05:30" -> "+5:30", "-04:00" -> "-4:00")
    let cleanOffset = rawOffset.replace(/^([+-])0/, '$1');

    // Strip trailing zero minutes for whole hours (e.g., "-4:00" -> "-4")
    if (cleanOffset.endsWith(':00')) {
      cleanOffset = cleanOffset.slice(0, -3);
    }

    // Fix browser fallback bug: If abbreviation is a clone of the GMT offset,
    // let's substitute it with a clean local identifier or drop it to avoid duplication.
    if (abbreviation.includes('GMT') || abbreviation.includes('+') || abbreviation.includes('-')) {
      // Custom dictionary for prominent regions if the environment lacks local naming data
      const fallbacks: Record<string, string> = {
        'Asia/Kolkata': 'IST',
        'Europe/Moscow': 'MSK',
        'Asia/Seoul': 'KST',
      };
      abbreviation = fallbacks[timeZone] || '';
    }

    // Build the final string: "11:32AM IST +5:30GMT"
    // If no abbreviation fallback was found, it cleanly prints "11:32AM +5:30GMT"
    return abbreviation 
      ? `${timeStr} ${abbreviation} ${cleanOffset}GMT`
      : `${timeStr} ${cleanOffset}GMT`;

  } catch {
    return 'Loading...';
  }
};
  return {
    formattedTime: formatTimeDetails(),
    timeZone,
    country,
    loading,
  };
}