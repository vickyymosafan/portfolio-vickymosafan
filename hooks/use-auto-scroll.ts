"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoScrollOptions {
  targetScroll: number;
  duration?: number; // in milliseconds
  enabled?: boolean;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
}

// Easing function - easeInOutCubic for smooth cinematic feel
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const useAutoScroll = ({
  targetScroll,
  duration = 3000, // 3 seconds default for 191 frames
  enabled = true,
  onScrollStart,
  onScrollEnd,
}: UseAutoScrollOptions) => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const animationRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  const startAutoScroll = useCallback(() => {
    if (isAutoScrolling || hasTriggeredRef.current || !enabled) return;
    
    const startPosition = window.scrollY;
    const distance = targetScroll - startPosition;
    
    // Don't scroll if already past target or distance is too small
    if (distance <= 50) return;
    
    hasTriggeredRef.current = true;
    setIsAutoScrolling(true);
    onScrollStart?.();

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      const currentPosition = startPosition + (distance * easedProgress);
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAutoScrolling(false);
        onScrollEnd?.();
        // Reset trigger after a delay to allow scrolling back
        setTimeout(() => {
          hasTriggeredRef.current = false;
        }, 500);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [targetScroll, duration, enabled, isAutoScrolling, onScrollStart, onScrollEnd]);

  // Handle wheel event
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      // Only trigger on scroll down and when at top of page
      if (e.deltaY > 0 && window.scrollY < 100 && !isAutoScrolling && !hasTriggeredRef.current) {
        e.preventDefault();
        startAutoScroll();
      }
    };

    // Use passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, isAutoScrolling, startAutoScroll]);

  // Handle touch events for mobile
  useEffect(() => {
    if (!enabled) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;

      // Swipe down (scroll down) when at top
      if (deltaY > 30 && window.scrollY < 100 && !isAutoScrolling && !hasTriggeredRef.current) {
        e.preventDefault();
        startAutoScroll();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled, isAutoScrolling, startAutoScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    isAutoScrolling,
    startAutoScroll,
  };
};

export default useAutoScroll;
