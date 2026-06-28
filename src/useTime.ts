import { useState, useEffect } from 'react';

export interface TimeData {
  formattedTime: string; 
  timeZone: string;      
  country: string;      
  loading: boolean;
}

export function useTime(overrideTimeZone?: string): TimeData {
  const [timeZone, setTimeZone] = useState<string>(overrideTimeZone || 'UTC');
  const [country, setCountry] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(!overrideTimeZone);

  useEffect(() => {
    if (overrideTimeZone) {
      setTimeZone(overrideTimeZone);
      return;
    }
//https://ipapi.co/json/ https://ipwho.is
    setLoading(true);
    fetch('') 
      .then((res) => res.json())
      .then((data) => {
        if (data.timezone) {
          setTimeZone(data.timezone);
          setCountry(data.country);
        }
      })
      .catch(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      })
      .finally(() => setLoading(false));
  }, [overrideTimeZone]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeDetails = (): string => {
  try {
    const timeStr = currentTime.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace(/\s+/g, ''); 

    
    let abbreviation = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    })
      .formatToParts(currentTime)
      .find((part) => part.type === 'timeZoneName')?.value || '';

    const offsetStr = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    })
      .formatToParts(currentTime)
      .find((part) => part.type === 'timeZoneName')?.value || '';

    const rawOffset = offsetStr.replace('GMT', '');

    let cleanOffset = rawOffset.replace(/^([+-])0/, '$1');
    if (cleanOffset.endsWith(':00')) {
      cleanOffset = cleanOffset.slice(0, -3);
    }

    if (abbreviation.includes('GMT') || abbreviation.includes('+') || abbreviation.includes('-')) {
      const fallbacks: Record<string, string> = {
        'Asia/Kolkata': 'IST',
        'Europe/Moscow': 'MSK',
        'Asia/Seoul': 'KST',
      };
      abbreviation = fallbacks[timeZone] || '';
    }

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