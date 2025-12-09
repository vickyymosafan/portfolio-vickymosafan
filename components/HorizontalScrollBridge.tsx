"use client";

import { motion } from 'framer-motion';
import { useRef, useState, useSyncExternalStore, useEffect, useCallback } from 'react';
import { ArrowDown, Briefcase, Code2, Rocket, Sparkles } from 'lucide-react';
import { useGSAP, gsap, ScrollTrigger } from '@/hooks/use-gsap';

// Frame sequence constants
const FRAME_COUNT = 191;
const BASE_URL = 'https://kgsvqtknngpsfqovfurw.supabase.co/storage/v1/object/public/car1';

// Easing function - easeInOutCubic for smooth cinematic feel (same as useAutoScroll)
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// SSR-safe mount detection hook
const useIsMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

const panels = [
  {
    id: 1,
    title: "The Journey",
    subtitle: "Continues...",
    description: "From passion to profession, every line of code tells a story",
    icon: Rocket,
    isLast: false,
  },
  {
    id: 2,
    title: "Building",
    subtitle: "Excellence",
    description: "Crafting digital experiences one project at a time",
    icon: Code2,
    isLast: false,
  },
  {
    id: 3,
    title: "My",
    subtitle: "Experience",
    description: "Let's explore the milestones together",
    icon: Briefcase,
    isLast: true,
  }
];

// Split text component for GSAP animation
const SplitText = ({ text, className = '' }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split('').map((char, i) => (
      <span 
        key={i} 
        className="split-char inline-block"
        style={{ opacity: 0, transform: 'translateY(30px) rotateX(-90deg)' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </span>
);

const HorizontalScrollBridge = () => {
  const containerRef = useRef<HTMLElement>(null);
  const panelsContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);
  
  const [activePanel, setActivePanel] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const hasAutoPlayedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const isMounted = useIsMounted();

  // Get frame URL helper
  const getFrameUrl = useCallback((index: number) => {
    const paddedIndex = String(index).padStart(3, '0');
    return `${BASE_URL}/frame_${paddedIndex}_delay-0.04s.webp`;
  }, []);

  // ============================================================================
  // FRAME PRELOADING
  // ============================================================================
  useEffect(() => {
    if (!isMounted) return;

    const imageArray: HTMLImageElement[] = [];
    loadedCountRef.current = 0;
    imagesRef.current = imageArray;

    const preloadImage = (index: number) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = getFrameUrl(index);
      img.onload = () => {
        loadedCountRef.current++;
        if (loadedCountRef.current >= Math.min(10, FRAME_COUNT)) {
          setIsCanvasLoading(false);
        }
      };
      img.onerror = () => {
        loadedCountRef.current++;
      };
      imageArray[index] = img;
    };

    // Load first 10 frames immediately for fast initial display
    for (let i = 0; i < Math.min(10, FRAME_COUNT); i++) {
      preloadImage(i);
    }

    // Lazy load remaining frames
    const loadRemaining = () => {
      for (let i = 10; i < FRAME_COUNT; i++) {
        preloadImage(i);
      }
    };

    const timeout = setTimeout(loadRemaining, 500);

    return () => clearTimeout(timeout);
  }, [isMounted, getFrameUrl]);

  // ============================================================================
  // CANVAS DRAWING
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[currentFrame];

    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    const draw = () => {
      const container = canvasContainerRef.current;
      if (!container) return;
      if (!img.complete || img.naturalWidth === 0) return;

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Cover fit calculation
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth, drawHeight, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try {
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      } catch {
        // Image might be in broken state, skip drawing
      }
    };

    requestAnimationFrame(draw);
  }, [currentFrame]);

  // ============================================================================
  // CANVAS RESIZE HANDLER
  // ============================================================================
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvasContainerRef.current;
      if (canvas && container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============================================================================
  // AUTO-SCROLL FUNCTION - Using requestAnimationFrame like useAutoScroll hook
  // ============================================================================
  const startAutoScroll = useCallback(() => {
    if (hasAutoPlayedRef.current || !containerRef.current || !panelsContainerRef.current) return;
    
    hasAutoPlayedRef.current = true;
    setIsAutoPlaying(true);
    
    const startPosition = window.scrollY;
    const scrollDistance = panelsContainerRef.current.scrollWidth - window.innerWidth;
    const containerTop = containerRef.current.offsetTop;
    const targetScroll = containerTop + scrollDistance;
    const distance = targetScroll - startPosition;
    
    // Don't scroll if distance is too small
    if (distance <= 50) {
      setIsAutoPlaying(false);
      return;
    }
    
    const duration = 4000; // 4 seconds for smooth 191 frame playback
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      const currentPosition = startPosition + (distance * easedProgress);
      window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAutoPlaying(false);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // ============================================================================
  // INTERSECTION OBSERVER - Trigger auto-scroll when section enters viewport
  // ============================================================================
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoPlayedRef.current) {
            startAutoScroll();
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [isMounted, startAutoScroll]);

  // ============================================================================
  // USER INTERRUPT HANDLER - Cancel auto-scroll on manual scroll
  // ============================================================================
  useEffect(() => {
    if (!isMounted) return;
    
    const handleWheel = () => {
      if (animationFrameRef.current && isAutoPlaying) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        setIsAutoPlaying(false);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMounted, isAutoPlaying]);


  // ============================================================================
  // GSAP HORIZONTAL SCROLL WITH SNAP
  // ============================================================================
  useGSAP(() => {
    if (!containerRef.current || !panelsContainerRef.current || !isMounted) return;

    const panels = panelsContainerRef.current.querySelectorAll('.panel');
    const totalPanels = panels.length;

    // Create horizontal scroll timeline
    const horizontalScroll = gsap.to(panelsContainerRef.current, {
      x: () => -(panelsContainerRef.current!.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${panelsContainerRef.current!.scrollWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (totalPanels - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: 'power2.inOut',
        },
        onToggle: (self) => setIsInView(self.isActive),
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          
          // Update frame index for canvas animation
          const frameIndex = Math.floor(progress * (FRAME_COUNT - 1));
          setCurrentFrame(frameIndex);
          
          // Canvas parallax scale effect (1.0 → 1.15)
          if (canvasContainerRef.current) {
            const scale = 1 + (progress * 0.15);
            canvasContainerRef.current.style.transform = `scale(${scale})`;
          }
          
          // Dynamic overlay opacity (0.5 → 0.3)
          if (overlayRef.current) {
            const opacity = 0.5 - (progress * 0.2);
            overlayRef.current.style.opacity = String(opacity);
          }
          
          // Golden glow effect - intensity based on curve phase (frames 64-127)
          if (glowRef.current) {
            const isCurvePhase = frameIndex >= 64 && frameIndex <= 127;
            const glowIntensity = isCurvePhase ? 0.6 : 0.3;
            const glowX = 50 + (progress * 20); // Move glow right as car turns
            const glowY = 50 - (progress * 10); // Move glow up slightly
            glowRef.current.style.background = `radial-gradient(ellipse at ${glowX}% ${glowY}%, rgba(255, 215, 0, ${glowIntensity}) 0%, transparent 50%)`;
          }
          
          const newActivePanel = Math.round(progress * (totalPanels - 1));
          if (newActivePanel !== activePanel) {
            setActivePanel(newActivePanel);
          }
          // Update progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress * 100}%`;
          }
        },
      },
    });

    // Panel content animations with containerAnimation
    panels.forEach((panel) => {
      const icon = panel.querySelector('.panel-icon');
      const titleChars = panel.querySelectorAll('.title-text .split-char');
      const subtitleChars = panel.querySelectorAll('.subtitle-text .split-char');
      const description = panel.querySelector('.panel-description');
      const arrow = panel.querySelector('.panel-arrow');

      // Create timeline for each panel
      const panelTl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          containerAnimation: horizontalScroll,
          start: 'left 80%',
          end: 'left 20%',
          scrub: 1,
          // markers: true, // Uncomment for debugging
        }
      });

      // Icon animation - bounce in with 3D rotation
      if (icon) {
        panelTl.fromTo(icon,
          { opacity: 0, scale: 0.5, rotateY: -180, y: 50 },
          { opacity: 1, scale: 1, rotateY: 0, y: 0, duration: 0.4, ease: 'back.out(1.7)' },
          0
        );
      }

      // Title characters - wave animation
      if (titleChars.length > 0) {
        panelTl.fromTo(titleChars,
          { opacity: 0, y: 30, rotateX: -90 },
          { 
            opacity: 1, y: 0, rotateX: 0,
            stagger: { each: 0.02, from: 'start' },
            duration: 0.3,
            ease: 'back.out(1.4)'
          },
          0.1
        );
      }

      // Subtitle characters - blur to sharp with scale
      if (subtitleChars.length > 0) {
        panelTl.fromTo(subtitleChars,
          { opacity: 0, y: 20, scale: 0.8, filter: 'blur(4px)' },
          { 
            opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
            stagger: { each: 0.015, from: 'center' },
            duration: 0.3,
            ease: 'power2.out'
          },
          0.2
        );
      }

      // Description - fade in from bottom
      if (description) {
        panelTl.fromTo(description,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.3
        );
      }

      // Arrow animation for last panel
      if (arrow) {
        panelTl.fromTo(arrow,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'bounce.out' },
          0.4
        );
      }
    });

    // ========================================================================
    // ENTRY REVEAL ANIMATION - Canvas expands from center
    // ========================================================================
    if (canvasContainerRef.current) {
      gsap.fromTo(canvasContainerRef.current,
        { 
          scale: 0.85, 
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          }
        }
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isMounted, activePanel]);


  return (
    <section 
      ref={containerRef} 
      className="relative bg-background overflow-hidden"
      id="journey-bridge"
    >
      {/* Frame-by-Frame Canvas Background */}
      <div 
        ref={canvasContainerRef} 
        className="absolute inset-0 z-0 origin-center"
        style={{ willChange: 'transform' }}
      >
        {/* Loading indicator */}
        {isCanvasLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Canvas for frame rendering */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ 
            opacity: isCanvasLoading ? 0 : 1, 
            transition: 'opacity 0.5s ease',
          }}
        />
        
        {/* Golden glow layer - follows car headlights */}
        <div 
          ref={glowRef}
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            transition: 'background 0.1s ease-out',
          }}
        />
        
        {/* Vignette overlay for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />
        
        {/* Dynamic dark overlay for text readability */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-background pointer-events-none"
          style={{ opacity: 0.5, transition: 'opacity 0.1s ease-out' }}
        />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Horizontal panels container */}
      <div 
        ref={panelsContainerRef}
        className="flex h-screen"
        style={{ width: `${panels.length * 100}vw` }}
      >
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className="panel w-screen h-full flex items-center justify-center relative shrink-0"
            style={{ perspective: '1000px' }}
          >
            {/* Bottom gradient for last panel */}
            {panel.isLast && (
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-secondary/20 via-secondary/10 to-transparent pointer-events-none" />
            )}

            {/* Content */}
            <div className="relative z-10 text-center px-8 max-w-4xl">
              {/* Icon with 3D transform and glow effect */}
              <div 
                className="panel-icon mb-8 inline-flex items-center justify-center relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Icon glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="relative p-6 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                >
                  <panel.icon className="w-12 h-12 text-primary" />
                </motion.div>
              </div>

              {/* Title with split text */}
              <h2 
                className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span className="title-text text-muted-foreground block">
                  <SplitText text={panel.title} />
                </span>
                <span 
                  className="subtitle-text text-gradient block relative"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s ease-in-out infinite',
                  }}
                >
                  <SplitText text={panel.subtitle} />
                </span>
              </h2>
              
              {/* Shimmer keyframes - injected via style tag */}
              <style jsx>{`
                @keyframes shimmer {
                  0%, 100% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                }
              `}</style>

              {/* Description */}
              <p className="panel-description text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                {panel.description}
              </p>

              {/* Arrow indicator on last panel */}
              {panel.isLast && (
                <motion.div 
                  className="panel-arrow mt-12 flex flex-col items-center gap-2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    Scroll to explore
                  </span>
                  <ArrowDown className="w-6 h-6 text-primary" />
                </motion.div>
              )}
            </div>

            {/* Enhanced floating particles with horizontal drift */}
            <motion.div
              className="absolute bottom-20 left-20 w-2 h-2 bg-primary/50 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1], 
                opacity: [0.5, 1, 0.5],
                x: [0, 50, 100], // Horizontal drift
              }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-32 right-32 w-3 h-3 bg-primary/30 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.3, 0.7, 0.3],
                x: [0, 30, 60], // Horizontal drift
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 + index * 0.2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent/40 rounded-full"
              animate={{ 
                y: [0, -30, 0], 
                x: [0, 40, 80], // Horizontal drift
                opacity: [0.2, 0.6, 0.2] 
              }}
              transition={{ duration: 5, repeat: Infinity, delay: index * 0.4, ease: "easeInOut" }}
            />
            {/* Additional golden particle */}
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#FFD700]/40 rounded-full"
              animate={{ 
                scale: [1, 1.8, 1],
                x: [0, 60, 120],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.2 + index * 0.3, ease: "easeInOut" }}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Progress indicator - only visible when section is active */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50 transition-opacity duration-300 ${
          isInView ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div className="w-32 h-1 bg-primary/20 rounded-full overflow-hidden">
          <div 
            ref={progressBarRef}
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: '0%' }}
          />
        </div>
        
        {/* Panel indicator dots with pulse effect */}
        <div className="flex gap-3">
          {panels.map((_, index) => (
            <div key={index} className="relative">
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activePanel === index 
                    ? 'bg-primary scale-150' 
                    : 'bg-primary/30 scale-100'
                }`}
              />
              {/* Pulse ring for active dot */}
              {activePanel === index && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Panel counter */}
        <div className="text-xs text-muted-foreground font-mono">
          <span className="text-primary">{activePanel + 1}</span>
          <span className="mx-1">/</span>
          <span>{panels.length}</span>
        </div>
        
        {/* Auto-play indicator */}
        {isAutoPlaying && (
          <motion.div 
            className="flex items-center gap-2 text-[10px] text-primary font-mono"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            Auto-playing...
          </motion.div>
        )}
      </div>

      {/* Side scroll hint - only visible when section is active */}
      <motion.div 
        className={`fixed right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground z-50 transition-opacity duration-300 ${
          isInView ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-wider rotate-90 origin-center">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HorizontalScrollBridge;
