"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState, useRef, useSyncExternalStore } from 'react';
import ImageSequenceCanvas from './ImageSequenceCanvas';
import { useGSAP, gsap, ScrollTrigger } from '@/hooks/use-gsap';

// ============================================================================
// CONFIGURATION
// ============================================================================
const USE_IMAGE_SEQUENCE = true;
const MACRO_TOTAL_FRAMES = 191;
const MACRO_BASE_URL = "https://kgsvqtknngpsfqovfurw.supabase.co/storage/v1/object/public/macro/frame_000_delay-0.04s.webp";

// Custom hook for checking if component is mounted (SSR-safe)
const useIsMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

// Split text component for GSAP animation
const SplitTextReveal = ({ 
  text, 
  className = '',
  charClassName = ''
}: { 
  text: string; 
  className?: string;
  charClassName?: string;
}) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className={`split-char inline-block ${charClassName}`}
          style={{ opacity: 0, transform: 'translateY(20px) rotateX(-90deg)' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const TransitionSection = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [blurValue, setBlurValue] = useState(6);
  const [bgOpacity, setBgOpacity] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const isMounted = useIsMounted();


  // Scroll positions
  const sectionStart = windowSize.height * 0.5;
  const sectionEnd = windowSize.height * 2.5;

  // ============================================================================
  // GSAP SCROLL-TRIGGERED ANIMATIONS
  // ============================================================================
  useGSAP(() => {
    if (!sectionRef.current || !contentRef.current || windowSize.height === 0) return;

    // Create main timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
        // markers: true, // Uncomment for debugging
      }
    });

    // Animate decorative lines
    if (topLineRef.current) {
      tl.fromTo(topLineRef.current, 
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.3, ease: 'power2.out' },
        0
      );
    }

    // Animate subtitle (Discover)
    if (subtitleRef.current) {
      const subtitleChars = subtitleRef.current.querySelectorAll('.split-char');
      tl.fromTo(subtitleChars,
        { opacity: 0, y: 15, rotateX: -90 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          stagger: 0.03,
          duration: 0.4,
          ease: 'back.out(1.7)'
        },
        0.1
      );
    }

    // Animate title (The Story Behind)
    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.split-char');
      tl.fromTo(titleChars,
        { opacity: 0, y: 30, rotateX: -90, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          scale: 1,
          stagger: 0.02,
          duration: 0.5,
          ease: 'back.out(1.4)'
        },
        0.2
      );
    }

    // Animate description
    if (descRef.current) {
      const descChars = descRef.current.querySelectorAll('.split-char');
      tl.fromTo(descChars,
        { opacity: 0, y: 10 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.01,
          duration: 0.3,
          ease: 'power2.out'
        },
        0.4
      );
    }

    // Animate bottom line
    if (bottomLineRef.current) {
      tl.fromTo(bottomLineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.3, ease: 'power2.out' },
        0.5
      );
    }

    // Create exit animation timeline
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // Content fades out and moves up
    exitTl.to(contentRef.current, {
      y: -100,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power2.in'
    });

  }, [windowSize.height]);

  // ============================================================================
  // FRAMER MOTION TRANSFORMS (for background effects)
  // ============================================================================
  const backgroundOpacity = useTransform(
    scrollY,
    [sectionStart, sectionStart + windowSize.height * 0.3, sectionEnd - windowSize.height * 0.15, sectionEnd + windowSize.height * 0.2],
    [0, 1, 1, 0]
  );

  useMotionValueEvent(backgroundOpacity, "change", (latest) => {
    setBgOpacity(Math.max(0, Math.min(1, latest)));
  });

  const backgroundBlurValue = useTransform(
    scrollY,
    [sectionStart, sectionStart + windowSize.height * 0.5],
    [6, 0]
  );
  
  useMotionValueEvent(backgroundBlurValue, "change", (latest) => {
    setBlurValue(Math.max(0, latest));
  });

  const gradientOpacity = useTransform(
    scrollY,
    [sectionEnd - windowSize.height * 0.3, sectionEnd + windowSize.height * 0.1],
    [0, 1]
  );

  const scaleValue = useTransform(
    scrollY,
    [sectionStart, sectionEnd],
    [2.0, 1]
  );

  const imageOpacity = useTransform(
    scrollY,
    [sectionStart - windowSize.height * 0.2, sectionStart + windowSize.height * 0.1],
    [0, 1]
  );

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = MACRO_BASE_URL;
    img.onload = () => setImageLoaded(true);
  }, []);


  return (
    <section ref={sectionRef} className="relative h-[150vh] z-10">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background with cinematic blur effect */}
        <div 
          className="absolute inset-0 transition-[filter] duration-100"
          style={{ 
            filter: `blur(${blurValue}px)`,
            opacity: bgOpacity
          }}
        >
          {USE_IMAGE_SEQUENCE && windowSize.height > 0 && (
            <motion.div 
              style={{ scale: scaleValue }}
              className="absolute inset-0 origin-center"
            >
              <ImageSequenceCanvas
                baseUrl={MACRO_BASE_URL}
                totalFrames={MACRO_TOTAL_FRAMES}
                scrollStart={sectionStart}
                scrollEnd={sectionEnd}
                className="absolute inset-0"
              />
            </motion.div>
          )}

          {!USE_IMAGE_SEQUENCE && (
            <motion.div 
              style={{ scale: scaleValue, opacity: imageOpacity }}
              className="absolute inset-0 origin-center"
            >
              <motion.img
                src={MACRO_BASE_URL}
                alt="Transition macro shot"
                className="w-full h-full object-cover"
                style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
              />
            </motion.div>
          )}
        </div>

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="absolute inset-0 bg-linear-to-r from-background/40 via-transparent to-background/40" />
        
        {/* Bottom Gradient */}
        <motion.div 
          style={{ opacity: gradientOpacity }}
          className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent"
        />

        {/* Content with GSAP animations */}
        {isMounted && (
          <div
            ref={contentRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{ perspective: '1000px' }}
          >
            <div className="text-center">
              {/* Top decorative line */}
              <div 
                ref={topLineRef}
                className="w-16 h-px bg-primary/50 mx-auto mb-6 origin-center"
              />
              
              {/* Subtitle - Split text */}
              <p
                ref={subtitleRef}
                className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-4"
              >
                <SplitTextReveal text="Discover" />
              </p>
              
              {/* Title - Split text with gradient */}
              <h2
                ref={titleRef}
                className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <SplitTextReveal 
                  text="The Story Behind" 
                  charClassName="text-gradient"
                />
              </h2>
              
              {/* Description - Split text */}
              <p
                ref={descRef}
                className="text-muted-foreground text-lg max-w-md mx-auto"
              >
                <SplitTextReveal text="From chaos to clarity, every detail matters" />
              </p>

              {/* Bottom decorative line */}
              <div 
                ref={bottomLineRef}
                className="w-16 h-px bg-primary/50 mx-auto mt-6 origin-center"
              />
            </div>
          </div>
        )}

        {/* Enhanced floating particles with GSAP-ready classes */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => {
              const xPos = ((i * 1234567) % 100);
              const yPos = ((i * 7654321) % 100);
              const size = 2 + (i % 3);
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/20 transition-particle"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    width: size,
                    height: size,
                  }}
                  animate={{
                    y: [0, -80, 0],
                    x: [0, (i % 2 === 0 ? 20 : -20), 0],
                    opacity: [0.1, 0.6, 0.1],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 5 + (i % 4),
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Gradient orbs for visual continuity to AboutSection */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute -bottom-32 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-48 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>
      </div>
    </section>
  );
};

export default TransitionSection;
