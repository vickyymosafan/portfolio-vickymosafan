"use client";

import { motion } from 'framer-motion';
import { useRef, useState, useSyncExternalStore } from 'react';
import { ArrowDown, Briefcase, Code2, Rocket, Sparkles } from 'lucide-react';
import { useGSAP, gsap, ScrollTrigger } from '@/hooks/use-gsap';

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
  const [activePanel, setActivePanel] = useState(0);
  const isMounted = useIsMounted();


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
        onUpdate: (self) => {
          const progress = self.progress;
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

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isMounted, activePanel]);


  return (
    <section 
      ref={containerRef} 
      className="relative bg-background"
      id="journey-bridge"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Noise Texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
          <filter id="noiseFilterBridge">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilterBridge)" />
        </svg>
      </div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
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
              {/* Icon with 3D transform */}
              <div 
                className="panel-icon mb-8 inline-flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div 
                  className="p-6 rounded-2xl bg-primary/10 border border-primary/20"
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
                <span className="subtitle-text text-gradient block">
                  <SplitText text={panel.subtitle} />
                </span>
              </h2>

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

            {/* Decorative floating elements */}
            <motion.div
              className="absolute bottom-20 left-20 w-2 h-2 bg-primary/50 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            />
            <motion.div
              className="absolute top-32 right-32 w-3 h-3 bg-primary/30 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 + index * 0.2 }}
            />
            <motion.div
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent/40 rounded-full"
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.4 }}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Progress indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
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
      </div>

      {/* Side scroll hint */}
      <motion.div 
        className="fixed right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground z-50"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-wider rotate-90 origin-center">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HorizontalScrollBridge;
