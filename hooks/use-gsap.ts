"use client";

import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Custom hook for GSAP animations with automatic cleanup
 */
export const useGSAP = (
  callback: (gsapContext: gsap.Context) => void,
  dependencies: React.DependencyList = []
) => {
  const contextRef = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Create GSAP context for automatic cleanup
    contextRef.current = gsap.context(() => {
      callback(contextRef.current!);
    });

    return () => {
      contextRef.current?.revert();
    };
  }, dependencies);

  return contextRef;
};

/**
 * Split text into spans for character/word animation
 */
export const splitText = (text: string, type: 'chars' | 'words' = 'words'): string[] => {
  if (type === 'chars') {
    return text.split('');
  }
  return text.split(' ');
};

/**
 * Create a scroll-triggered timeline
 */
export const createScrollTimeline = (
  trigger: string | Element,
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean | string;
    markers?: boolean;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
  } = {}
): gsap.core.Timeline => {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start || 'top top',
      end: options.end || '+=100%',
      scrub: options.scrub ?? 1,
      pin: options.pin ?? false,
      markers: options.markers ?? false,
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
    },
  });
};

/**
 * Batch animation for multiple elements
 */
export const createBatchAnimation = (
  targets: string,
  options: {
    start?: string;
    end?: string;
    fromVars?: gsap.TweenVars;
    toVars?: gsap.TweenVars;
    stagger?: number;
  } = {}
) => {
  ScrollTrigger.batch(targets, {
    start: options.start || 'top 80%',
    end: options.end || 'bottom 20%',
    onEnter: (elements) => {
      gsap.fromTo(
        elements,
        options.fromVars || { opacity: 0, y: 50 },
        {
          ...options.toVars,
          opacity: 1,
          y: 0,
          stagger: options.stagger || 0.1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    },
  });
};

export { gsap, ScrollTrigger };
