"use client";

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDown, Briefcase, Code2, Rocket, Sparkles } from 'lucide-react';

// Progress dot component to properly use hooks
const ProgressDot = ({ 
  index, 
  scrollYProgress 
}: { 
  index: number; 
  scrollYProgress: MotionValue<number> 
}) => {
  const dotScale = useTransform(
    scrollYProgress,
    [index * 0.33, index * 0.33 + 0.16, (index + 1) * 0.33],
    [1, 1.5, 1]
  );
  
  const dotOpacity = useTransform(
    scrollYProgress,
    [index * 0.33, index * 0.33 + 0.1, (index + 1) * 0.33 - 0.1, (index + 1) * 0.33],
    [0.3, 1, 1, 0.3]
  );

  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-primary"
      style={{
        scale: dotScale,
        opacity: dotOpacity,
      }}
    />
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

const HorizontalScrollBridge = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform vertical scroll to horizontal movement (3 panels)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);
  
  // Progress for each panel (0-1 range for each)
  const panel1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0.3]);
  const panel2Opacity = useTransform(scrollYProgress, [0.2, 0.35, 0.5, 0.65], [0.3, 1, 1, 0.3]);
  const panel3Opacity = useTransform(scrollYProgress, [0.55, 0.7, 1], [0.3, 1, 1]);
  
  // Scale transforms for text emphasis
  const panel1Scale = useTransform(scrollYProgress, [0, 0.2, 0.33], [1, 1, 0.95]);
  const panel2Scale = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0.95, 1, 0.95]);
  const panel3Scale = useTransform(scrollYProgress, [0.55, 0.75, 1], [0.95, 1, 1]);
  
  // Arrow bounce for last panel
  const arrowY = useTransform(scrollYProgress, [0.8, 0.85, 0.9, 0.95, 1], [0, 10, 0, 10, 0]);

  // Progress indicator
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Transition gradient opacity - fades in as approaching end

  return (
    <section 
      ref={containerRef} 
      className="h-[300vh] relative bg-background"
      id="journey-bridge"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background elements - matching AboutSection */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
          
          {/* Noise Texture Overlay - same as AboutSection */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
            <filter id="noiseFilterBridge">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilterBridge)" />
          </svg>
        </div>
        
        {/* Animated Gradient Orbs - matching AboutSection style */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary Orb - Top Left */}
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Accent Orb - Bottom Right */}
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              x: [0, -25, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Secondary Orb - Center */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Horizontal panels container */}
        <motion.div 
          style={{ x }}
          className="flex h-full w-[300vw]"
        >
          {panels.map((panel, index) => {
            const opacity = index === 0 ? panel1Opacity : index === 1 ? panel2Opacity : panel3Opacity;
            const scale = index === 0 ? panel1Scale : index === 1 ? panel2Scale : panel3Scale;
            
            return (
              <motion.div
                key={panel.id}
                style={{ opacity, scale }}
                className="w-screen h-full flex items-center justify-center relative"
              >
                {/* Bottom gradient for last panel - smooth transition to ExperienceSection */}
                {panel.isLast && (
                  <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-secondary/20 via-secondary/10 to-transparent pointer-events-none" />
                )}

                {/* Content */}
                <div className="relative z-10 text-center px-8 max-w-4xl">
                  {/* Icon */}
                  <motion.div
                    className="mb-8 inline-flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                      <panel.icon className="w-12 h-12 text-primary" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
                    <span className="text-muted-foreground">{panel.title}</span>
                    <br />
                    <span className="text-gradient">{panel.subtitle}</span>
                  </h2>

                  {/* Description */}
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    {panel.description}
                  </p>

                  {/* Arrow indicator on last panel */}
                  {panel.isLast && (
                    <motion.div 
                      style={{ y: arrowY }}
                      className="mt-12 flex flex-col items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      <span className="text-sm text-muted-foreground uppercase tracking-wider">
                        Scroll to explore
                      </span>
                      <ArrowDown className="w-6 h-6 text-primary" />
                    </motion.div>
                  )}
                </div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute bottom-20 left-20 w-2 h-2 bg-primary/50 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-32 right-32 w-3 h-3 bg-primary/30 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          {/* Progress bar */}
          <div className="w-32 h-1 bg-primary/20 rounded-full overflow-hidden">
            <motion.div 
              style={{ width: progressWidth }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          
          {/* Dots */}
          <div className="flex gap-3">
            <ProgressDot index={0} scrollYProgress={scrollYProgress} />
            <ProgressDot index={1} scrollYProgress={scrollYProgress} />
            <ProgressDot index={2} scrollYProgress={scrollYProgress} />
          </div>
        </div>

        {/* Side scroll hint */}
        <motion.div 
          className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs uppercase tracking-wider rotate-90 origin-center">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScrollBridge;
