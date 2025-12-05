"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef, useSyncExternalStore } from 'react';
import ImageSequenceCanvas from './ImageSequenceCanvas';

// ============================================================================
// CONFIGURATION - Update these values when you have more frames
// ============================================================================
// Set to true when you have multiple frames generated from Flow
// Set to false to use single frame with CSS zoom-out effect
const USE_IMAGE_SEQUENCE = true;

// Total frames in your macro sequence (191 frames available)
const MACRO_TOTAL_FRAMES = 191;

// Base URL for macro frames
const MACRO_BASE_URL = "https://kgsvqtknngpsfqovfurw.supabase.co/storage/v1/object/public/macro/frame_000_delay-0.04s.webp";
// ============================================================================

// Custom hook for checking if component is mounted (SSR-safe)
const useIsMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

const TransitionSection = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const isMounted = useIsMounted();

  // Calculate scroll positions based on window height
  // Start animation earlier - when TransitionSection begins to appear
  // HeroSection is 200vh, animation starts at ~100vh scroll (when section starts appearing)
  const sectionStart = windowSize.height * 1;
  const sectionEnd = windowSize.height * 2.5;

  // Transform values for animations
  const contentOpacity = useTransform(
    scrollY,
    [sectionStart + windowSize.height * 0.5, sectionEnd - windowSize.height * 0.3],
    [0, 1]
  );

  const contentY = useTransform(
    scrollY,
    [sectionStart + windowSize.height * 0.5, sectionEnd - windowSize.height * 0.3],
    [50, 0]
  );

  // Gradient overlay opacity - fades in towards the end
  const gradientOpacity = useTransform(
    scrollY,
    [sectionEnd - windowSize.height * 0.5, sectionEnd],
    [0, 1]
  );

  // Scale effect for zoom-out feel - starts zoomed in (macro), zooms out to reveal context
  const scaleValue = useTransform(
    scrollY,
    [sectionStart, sectionEnd],
    [2.0, 1] // Start at 2x zoom (macro feel), end at normal
  );

  // Image opacity - fade in from Hero
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

  // Preload the macro image
  useEffect(() => {
    const img = new Image();
    img.src = "https://kgsvqtknngpsfqovfurw.supabase.co/storage/v1/object/public/macro/frame_000_delay-0.04s.webp";
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
      {/* Fixed Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* Option 1: Image Sequence Animation (when you have multiple frames) */}
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

        {/* Option 2: Single Frame with CSS Scale Transform for Zoom-Out Effect */}
        {!USE_IMAGE_SEQUENCE && (
          <motion.div 
            style={{ 
              scale: scaleValue,
              opacity: imageOpacity,
            }}
            className="absolute inset-0 origin-center"
          >
            <motion.img
              src={MACRO_BASE_URL}
              alt="Transition macro shot"
              className="w-full h-full object-cover"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease'
              }}
            />
          </motion.div>
        )}

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 cinematic-overlay" />
        
        {/* Side Gradients */}
        <div className="absolute inset-0 bg-linear-to-r from-background/40 via-transparent to-background/40" />
        
        {/* Bottom Gradient - fades to background for smooth transition to About */}
        <motion.div 
          style={{ opacity: gradientOpacity }}
          className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent"
        />

        {/* Content Overlay - Reveal Text */}
        {isMounted && (
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            <motion.div className="text-center">
              {/* Decorative line */}
              <motion.div 
                className="w-16 h-px bg-primary/50 mx-auto mb-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Reveal Text */}
              <motion.p
                className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-4"
              >
                Discover
              </motion.p>
              
              <motion.h2
                className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
              >
                <span className="text-gradient">The Story Behind</span>
              </motion.h2>
              
              <motion.p
                className="text-muted-foreground text-lg max-w-md mx-auto"
              >
                From chaos to clarity, every detail matters
              </motion.p>

              {/* Decorative line */}
              <motion.div 
                className="w-16 h-px bg-primary/50 mx-auto mt-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Floating particles for continuity */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => {
              const xPos = ((i * 1234567) % 100);
              const yPos = ((i * 7654321) % 100);
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/20 rounded-full"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4 + (i % 3),
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TransitionSection;
