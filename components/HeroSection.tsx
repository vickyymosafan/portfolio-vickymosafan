"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import ImageSequenceCanvas from './ImageSequenceCanvas';
import { useEffect, useState } from 'react';

// Generate deterministic positions based on index
const getParticlePosition = (index: number, width: number, height: number) => {
  // Use index-based pseudo-random values for consistent SSR/client rendering
  const xSeed = ((index * 1234567) % 100) / 100;
  const ySeed = ((index * 7654321) % 100) / 100;
  return {
    x: xSeed * width,
    y: ySeed * height,
  };
};

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [blurValue, setBlurValue] = useState(8); // Initial blur
  const [bgOpacity, setBgOpacity] = useState(1); // Initial background opacity
  const fullText = 'Fullstack Developer';
  const { scrollY } = useScroll();
  
  // ============================================================================
  // LINEAR SMOOTH SCROLLING - Content stays visible longer, then fades out smoothly
  // ============================================================================
  // Content opacity - stays visible, then fades out towards end of section
  const opacity = useTransform(
    scrollY,
    [0, windowSize.height * 0.1, windowSize.height * 0.4, windowSize.height * 0.7],
    [1, 1, 1, 0]
  );
  
  // Content scale - stays normal, then scales down slightly
  const scale = useTransform(
    scrollY,
    [0, windowSize.height * 0.4, windowSize.height * 0.7],
    [1, 1, 0.95]
  );
  
  // Content Y position - stays in place, then moves up
  const y = useTransform(
    scrollY,
    [0, windowSize.height * 0.4, windowSize.height * 0.7],
    [0, 0, -50]
  );
  // ============================================================================

  // ============================================================================
  // CINEMATIC BLUR EFFECT - Background starts blurred, becomes sharp as text fades
  // ============================================================================
  const backgroundBlurValue = useTransform(
    scrollY, 
    [0, windowSize.height * 0.4], 
    [8, 0]
  );
  
  // Update blur state based on scroll
  useMotionValueEvent(backgroundBlurValue, "change", (latest) => {
    setBlurValue(latest);
  });

  // ============================================================================
  // BACKGROUND OPACITY - Fade out earlier for smooth cross-fade to TransitionSection
  // ============================================================================
  const backgroundOpacity = useTransform(
    scrollY,
    [0, windowSize.height * 0.5, windowSize.height * 0.8],
    [1, 1, 0]  // Stay visible, then fade out for cross-fade overlap (0.5vh → 0.8vh)
  );

  // Update background opacity state based on scroll
  useMotionValueEvent(backgroundOpacity, "change", (latest) => {
    setBgOpacity(Math.max(0, Math.min(1, latest)));
  });
  // ============================================================================

  useEffect(() => {
    setIsMounted(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[150vh]">
      {/* Fixed Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background with cinematic blur effect and cross-fade opacity */}
        <div 
          className="absolute inset-0 transition-[filter] duration-100"
          style={{ 
            filter: `blur(${blurValue}px)`,
            opacity: bgOpacity  // Cross-fade out for smooth transition
          }}
        >
          <ImageSequenceCanvas
            baseUrl="https://kgsvqtknngpsfqovfurw.supabase.co/storage/v1/object/public/impact/frame_000_delay-0.04s.webp"
            totalFrames={191}
            scrollStart={0}
            scrollEnd={windowSize.height}
            className="absolute inset-0"
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-background/60" />
        
        {/* Floating Particles - only render after mount to avoid hydration mismatch */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => {
              const pos = getParticlePosition(i, windowSize.width, windowSize.height);
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/30 rounded-full"
                  initial={{ 
                    x: pos.x, 
                    y: pos.y,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [pos.y, pos.y - 100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: 3 + (i % 5) * 0.4,
                    repeat: Infinity,
                    delay: (i % 10) * 0.2,
                    ease: "easeOut"
                  }}
                />
              );
            })}
          </div>
        )}
        
        {/* Content */}
        <motion.div 
          style={{ opacity, scale, y }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-card border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Available for work</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-4"
            >
              Hello, I&apos;m
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1, type: "spring", stiffness: 80 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 relative"
            >
              <span className="text-gradient">Vicky Mosafan</span>
              {/* Glow effect */}
              <motion.span 
                className="absolute inset-0 text-gradient blur-2xl opacity-50 -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Vicky Mosafan
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="text-foreground/80 text-xl md:text-2xl font-light tracking-wide h-8"
            >
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-6 bg-primary ml-1 align-middle"
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(45 100% 60% / 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all"
              >
                Let&apos;s Talk
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--secondary))" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 border border-border text-foreground rounded-full font-medium transition-all"
              >
                View Work
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            onClick={scrollToAbout}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 group-hover:text-primary transition-colors" />
            </motion.div>
            {/* Line indicator */}
            <motion.div 
              className="w-px h-12 bg-linear-to-b from-primary/50 to-transparent"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 2.8 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
