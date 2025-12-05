"use client";

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import ImageSequenceCanvas from './ImageSequenceCanvas';

const CoolingSection = () => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [scrollBounds, setScrollBounds] = useState({ start: 0, end: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  useEffect(() => {
    const calculateScrollBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY;
        setScrollBounds({
          start: scrollTop + rect.top,
          end: scrollTop + rect.bottom - window.innerHeight,
        });
      }
    };

    calculateScrollBounds();
    window.addEventListener('resize', calculateScrollBounds);
    return () => window.removeEventListener('resize', calculateScrollBounds);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden" ref={ref}>
        {/* Image Sequence */}
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0"
        >
          <ImageSequenceCanvas
            baseUrl="https://kgsvqtknngpsfqovfurw.supabase.co/storage/v1/object/public/cooling/frame_000_delay-0.04s.webp"
            totalFrames={191}
            scrollStart={scrollBounds.start}
            scrollEnd={scrollBounds.end}
            className="absolute inset-0"
          />
        </motion.div>


        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/80" />
        <div className="absolute inset-0 bg-linear-to-r from-background/40 via-transparent to-background/40" />

        {/* Animated Border Frame */}
        <div className="absolute inset-8 md:inset-16 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 border border-primary/20 rounded-3xl"
          />
          {/* Corner accents */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-xl"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-xl"
          />
        </div>

        {/* Content Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="text-center max-w-3xl"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-block px-4 py-1.5 mb-6 text-sm text-primary bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20"
            >
              The Journey
            </motion.span>
            
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="block text-foreground"
              >
                Building
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="block text-gradient"
              >
                Tomorrow&apos;s
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="block text-foreground"
              >
                Solutions
              </motion.span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto"
            >
              Crafting digital experiences with precision, passion, and purpose.
            </motion.p>

            {/* Animated line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 1.5 }}
              className="w-32 h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mt-8"
            />
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{ 
                x: `${20 + i * 15}%`, 
                y: `${30 + (i % 3) * 20}%`,
                opacity: 0 
              }}
              animate={isInView ? { 
                y: [`${30 + (i % 3) * 20}%`, `${25 + (i % 3) * 20}%`, `${30 + (i % 3) * 20}%`],
                opacity: [0, 0.6, 0],
              } : {}}
              transition={{ 
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoolingSection;
