import React, { useEffect, useState, useRef } from 'react';

interface IndicatorProps {
  opacity?: string | number;
  alwaysVisible?: boolean;
  lightGradient?: string;
  darkGradient?: string;
}

export const Indicator: React.FC<IndicatorProps> = ({
  opacity = 1,
  alwaysVisible = false,
  lightGradient = 'bg-gradient-to-r from-blue-500 to-purple-600',
  darkGradient = 'dark:bg-gradient-to-r dark:from-cyan-400 dark:to-emerald-500',
}) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target;
      if (!target) return;

      let totalHeight = 0;
      let scrollY = 0;

      if (target === document || target === window || target === document.documentElement) {
        totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollY = window.scrollY;
      } else {
        const element = target as HTMLElement;
        if (element.scrollHeight !== undefined && element.clientHeight !== undefined) {
          totalHeight = element.scrollHeight - element.clientHeight;
          scrollY = element.scrollTop;
        }
      }

      if (totalHeight > 0) {
        const progress = (scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }

      // Handle Smooth Visibility
      setIsScrolling(true);

      // Clear any existing timeout using a mutable ref (prevents closure bugs)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Keep it visible until 1.5 seconds AFTER the user completely stops moving the wheel
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    // Use capture phase to intercept scroll events from any nested scrollable container
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    // Initial check: scan the DOM to find any active scrollable container
    let initialTarget: HTMLElement | Window = window;
    const elements = document.querySelectorAll('*');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLElement;
      if (el.scrollHeight > el.clientHeight) {
        const style = window.getComputedStyle(el);
        const overflowY = style.getPropertyValue('overflow-y');
        const overflow = style.getPropertyValue('overflow');
        if (
          overflowY === 'auto' ||
          overflowY === 'scroll' ||
          overflow === 'auto' ||
          overflow === 'scroll'
        ) {
          initialTarget = el;
          break;
        }
      }
    }

    let totalHeight = 0;
    let scrollY = 0;
    if (initialTarget === window) {
      totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollY = window.scrollY;
    } else {
      const el = initialTarget as HTMLElement;
      totalHeight = el.scrollHeight - el.clientHeight;
      scrollY = el.scrollTop;
    }

    if (totalHeight > 0) {
      setScrollProgress((scrollY / totalHeight) * 100);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isVisible = alwaysVisible || (isScrolling && scrollProgress > 0);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-9999 w-full h-1 bg-transparent transition-opacity duration-500 ease-out"
      style={{
        opacity: isVisible ? opacity : 0,
        pointerEvents: 'none',
      }}
    >
      <div
        className={`h-full transition-all duration-75 ease-out ${lightGradient} ${darkGradient}`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default Indicator;