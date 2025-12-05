"use client";

import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Code2, Database, GitBranch, Layout, Zap, Shield } from 'lucide-react';

// Floating Particle Component
const FloatingParticle = ({ 
  x, y, size, duration, delay 
}: { 
  x: number; y: number; size: number; duration: number; delay: number 
}) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
    }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Text Reveal Animation Component (word by word)
const TextReveal = ({ 
  children, 
  className = '', 
  delay = 0,
  isInView 
}: { 
  children: string; 
  className?: string; 
  delay?: number;
  isInView: boolean;
}) => {
  const words = children.split(' ');
  
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ 
            duration: 0.4, 
            delay: delay + i * 0.025,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Card slide directions for principles (from different corners)
const cardDirections = [
  { x: -40, y: -25, rotate: -5 },   // top-left
  { x: 40, y: -25, rotate: 5 },    // top-right
  { x: -40, y: 25, rotate: 5 },    // bottom-left
  { x: 40, y: 25, rotate: -5 },    // bottom-right
];

// Animated Counter Component with its own inView detection
const AnimatedCounter = ({ 
  value, 
  suffix = '', 
  duration = 2,
}: { 
  value: number; 
  suffix?: string; 
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(counterRef, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      // Small delay to ensure smooth start
      const timeout = setTimeout(() => {
        const controls = animate(0, value, {
          duration,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
          onUpdate: (latest) => {
            setDisplayValue(Math.round(latest));
          }
        });
        return () => controls.stop();
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={counterRef}>{displayValue}{suffix}</span>
  );
};

const languages = ['HTML', 'CSS', 'JavaScript', 'TypeScript'];

const techStack = [
  'React', 'Next.js', 'Vue.js', 'Node.js', 'Express.js', 'Nest.js',
  'Laravel', 'PostgreSQL', 'MySQL', 'MongoDB', 'VS Code', 'Git', 'GitHub'
];

const principles = [
  { icon: Code2, title: 'Clean Code', desc: 'Modular & maintainable', color: 'from-blue-500/20 to-cyan-500/20', iconGradient: 'from-blue-500/40 to-cyan-500/40' },
  { icon: Layout, title: 'SOLID', desc: 'Design principles', color: 'from-purple-500/20 to-pink-500/20', iconGradient: 'from-purple-500/40 to-pink-500/40' },
  { icon: GitBranch, title: 'DRY', desc: "Don't repeat yourself", color: 'from-green-500/20 to-emerald-500/20', iconGradient: 'from-green-500/40 to-emerald-500/40' },
  { icon: Database, title: 'Scalable', desc: 'Ready for growth', color: 'from-orange-500/20 to-yellow-500/20', iconGradient: 'from-orange-500/40 to-yellow-500/40' },
];

// Animation variants for staggered reveal
const principlesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

// Dynamic card variants based on direction
const createCardVariants = (direction: { x: number; y: number; rotate: number }) => ({
  hidden: { 
    opacity: 0, 
    x: direction.x, 
    y: direction.y, 
    scale: 0.9,
    rotate: direction.rotate
  },
  visible: { 
    opacity: 1, 
    x: 0,
    y: 0, 
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
});

const stats = [
  { value: 2, suffix: '+', label: 'Years Experience', icon: Zap },
  { value: 10, suffix: '+', label: 'Projects Done', icon: Code2 },
  { value: 100, suffix: '%', label: 'Code Quality', icon: Shield },
];

const AboutSection = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  
  // Top gradient overlay - fades out as user scrolls into section
  const topGradientOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  
  // Parallax transforms for different elements
  const statsY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const leftColumnY = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [50, -35]);
  const headerY = useTransform(scrollYProgress, [0, 1], [30, -20]);

  // Predefined particle positions for consistent rendering
  const particles = useMemo(() => [
    { id: 0, x: 15, y: 20, size: 3, duration: 15, delay: 0 },
    { id: 1, x: 85, y: 15, size: 4, duration: 18, delay: 2 },
    { id: 2, x: 45, y: 80, size: 2, duration: 12, delay: 1 },
    { id: 3, x: 70, y: 45, size: 3, duration: 20, delay: 3 },
    { id: 4, x: 25, y: 65, size: 4, duration: 16, delay: 0.5 },
    { id: 5, x: 90, y: 70, size: 2, duration: 14, delay: 2.5 },
    { id: 6, x: 10, y: 85, size: 3, duration: 17, delay: 1.5 },
    { id: 7, x: 55, y: 30, size: 4, duration: 19, delay: 4 },
    { id: 8, x: 35, y: 50, size: 2, duration: 13, delay: 0.8 },
    { id: 9, x: 75, y: 90, size: 3, duration: 15, delay: 3.5 },
    { id: 10, x: 5, y: 40, size: 4, duration: 18, delay: 1.2 },
    { id: 11, x: 60, y: 10, size: 2, duration: 16, delay: 2.8 },
    { id: 12, x: 40, y: 95, size: 3, duration: 14, delay: 4.5 },
    { id: 13, x: 95, y: 55, size: 4, duration: 20, delay: 0.3 },
    { id: 14, x: 20, y: 35, size: 2, duration: 12, delay: 3.2 },
  ], []);

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden" ref={containerRef}>
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise Texture Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.015]">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Top Gradient Overlay - Smooth transition from TransitionSection */}
      <motion.div 
        style={{ opacity: topGradientOpacity }}
        className="absolute inset-x-0 top-0 h-[40vh] bg-linear-to-b from-background via-background/50 to-transparent pointer-events-none z-10"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Primary Orb - Top Left */}
        <motion.div 
          style={{ scale: orbScale }}
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
          style={{ scale: orbScale }}
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
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

        {/* Small Accent Orb - Top Right */}
        <motion.div 
          className="absolute top-40 right-1/4 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl"
          animate={{
            x: [0, 15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Section Header with Parallax */}
        <motion.div
          style={{ y: headerY }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-16 text-center"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-4 text-sm text-primary bg-primary/10 rounded-full"
          >
            About Me
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <motion.span 
              className="text-gradient inline-block"
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Passionate Developer
            </motion.span>
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-1 bg-linear-to-r from-transparent via-primary to-transparent rounded-full mx-auto"
          />
        </motion.div>

        {/* Stats Row with Parallax */}
        <motion.div
          style={{ y: statsY }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 15 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: 0.3 + index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 rounded-2xl text-center group cursor-default relative overflow-hidden"
              style={{ transformPerspective: 1000 }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon with pulse animation */}
              <motion.div
                animate={isInView ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              </motion.div>
              
              {/* Animated Counter */}
              <div className="text-3xl md:text-4xl font-bold text-gradient relative z-10">
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  duration={2 + index * 0.3}
                />
              </div>
              
              <div className="text-sm text-muted-foreground mt-1 relative z-10">{stat.label}</div>
              
              {/* Bottom accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent"
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Text with Parallax & Text Reveal */}
          <motion.div
            style={{ y: leftColumnY }}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="space-y-6"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              <TextReveal delay={0.3} isInView={isInView}>
                Saya seorang
              </TextReveal>
              <motion.span 
                className="text-primary font-semibold inline-block mx-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                Fullstack Developer
              </motion.span>
              <TextReveal delay={0.55} isInView={isInView}>
                yang fokus pada kualitas, efisiensi, dan skalabilitas. Saya menggunakan pendekatan engineering untuk membuat Product Requirement Documentation dan technical documentation sebelum memulai pengembangan.
              </TextReveal>
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              <TextReveal delay={0.8} isInView={isInView}>
                Saya merancang arsitektur sistem, workflow, dan requirement secara detail agar proses development berjalan jelas. Saya memakai AI tools seperti Copilot, tetapi tetap mengutamakan prinsip development yang kuat.
              </TextReveal>
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              <TextReveal delay={1.0} isInView={isInView}>
                Saya membangun codebase yang bersih, modular, dan maintainable. Backend berfokus pada arsitektur efisien, keamanan API, dan performa database. Frontend berfokus pada clean code dan komponen yang reusable.
              </TextReveal>
            </p>

            <motion.blockquote 
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative pl-6 py-4 italic text-foreground/80"
            >
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary via-primary/50 to-transparent rounded-full origin-top" 
              />
              <motion.span 
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.4 }}
                className="text-4xl text-primary/30 absolute -top-2 left-4"
              >
                &quot;
              </motion.span>
              <TextReveal delay={1.4} isInView={isInView}>
                Dokumentasi yang jelas dan struktur kode yang solid menghasilkan aplikasi yang cepat, aman, dan siap scale.
              </TextReveal>
            </motion.blockquote>
          </motion.div>


          {/* Right Column - Skills with Parallax */}
          <motion.div
            style={{ y: rightColumnY }}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="space-y-8"
          >
            {/* Principles with Connecting Lines */}
            <div className="relative">
              {/* Connecting Lines - Center Cross */}
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                {/* Horizontal line */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute top-1/2 left-[15%] right-[15%] h-px bg-linear-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2"
                />
                {/* Vertical line */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="absolute left-1/2 top-[15%] bottom-[15%] w-px bg-linear-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2"
                />
                {/* Center dot */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.1 }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary/50 rounded-full -translate-x-1/2 -translate-y-1/2"
                />
              </div>

              {/* Principles Grid - Cards from different directions */}
              <motion.div 
                variants={principlesContainerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="grid grid-cols-2 gap-4 relative z-10"
              >
                {principles.map((item, index) => (
                  <motion.div
                    key={item.title}
                    variants={createCardVariants(cardDirections[index])}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotate: 0,
                      transition: { duration: 0.2 }
                    }}
                    className="relative glass-card p-5 rounded-xl overflow-hidden group cursor-default transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Border glow on hover */}
                    <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/30 transition-colors duration-300" />
                    
                    <div className="relative z-10">
                      {/* Icon with gradient background */}
                      <div className={`p-2.5 rounded-xl bg-linear-to-br ${item.iconGradient} w-fit mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Languages - Slide from right */}
            <div>
              <motion.h4 
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2"
              >
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.0 }}
                  className="w-8 h-px bg-primary/50 origin-left" 
                />
                Languages
              </motion.h4>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang, index) => (
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, x: 30, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.0 + index * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30 cursor-default"
                  >
                    {lang}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tech Stack - Wave animation */}
            <div>
              <motion.h4 
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2"
              >
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.2 }}
                  className="w-8 h-px bg-primary/50 origin-left" 
                />
                Tech Stack
              </motion.h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.4, 
                      delay: 1.2 + index * 0.04,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -2,
                      backgroundColor: "hsl(var(--primary) / 0.2)",
                      color: "hsl(var(--primary))"
                    }}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm cursor-default transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
