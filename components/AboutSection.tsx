"use client";

import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Code2, Database, GitBranch, Layout, Zap, Shield } from 'lucide-react';
import { useGSAP, gsap } from '@/hooks/use-gsap';

// Floating Particle Component
const FloatingParticle = ({ 
  x, y, size, duration, delay 
}: { 
  x: number; y: number; size: number; duration: number; delay: number 
}) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

// Text Reveal Animation Component (word by word)
const TextReveal = ({ 
  children, className = '', delay = 0, isInView 
}: { 
  children: string; className?: string; delay?: number; isInView: boolean;
}) => {
  const words = children.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.4, delay: delay + i * 0.025, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(counterRef, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const timeout = setTimeout(() => {
        const controls = animate(0, value, {
          duration,
          ease: [0.25, 0.46, 0.45, 0.94],
          onUpdate: (latest) => setDisplayValue(Math.round(latest)),
        });
        return () => controls.stop();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, duration]);

  return <span ref={counterRef}>{displayValue}{suffix}</span>;
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

const stats = [
  { value: 2, suffix: '+', label: 'Years Experience', icon: Zap },
  { value: 10, suffix: '+', label: 'Projects Done', icon: Code2 },
  { value: 100, suffix: '%', label: 'Code Quality', icon: Shield },
];

// Card directions for 3D effect
const cardDirections = [
  { x: -40, y: -25, rotateY: -15, rotateX: 10 },
  { x: 40, y: -25, rotateY: 15, rotateX: 10 },
  { x: -40, y: 25, rotateY: -15, rotateX: -10 },
  { x: 40, y: 25, rotateY: 15, rotateX: -10 },
];

const AboutSection = () => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const languagesRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const topGradientOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const statsY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const leftColumnY = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [50, -35]);
  const headerY = useTransform(scrollYProgress, [0, 1], [30, -20]);

  // ============================================================================
  // GSAP SCROLL-TRIGGERED ANIMATIONS
  // ============================================================================
  useGSAP(() => {
    if (!containerRef.current) return;

    // Header reveal with scrub
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          }
        }
      );
    }

    // Stats cards with 3D flip effect
    if (statsRef.current) {
      const statCards = statsRef.current.querySelectorAll('.stat-card');
      statCards.forEach((card) => {
        gsap.fromTo(card,
          { 
            opacity: 0, 
            y: 80, 
            rotateX: 45,
            scale: 0.8,
            transformPerspective: 1000
          },
          {
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 65%',
              scrub: 0.5,
            }
          }
        );
      });
    }

    // Principles cards with 3D perspective from corners
    if (principlesRef.current) {
      const principleCards = principlesRef.current.querySelectorAll('.principle-card');
      principleCards.forEach((card, idx) => {
        const dir = cardDirections[idx];
        gsap.fromTo(card,
          { 
            opacity: 0, 
            x: dir.x, 
            y: dir.y,
            rotateY: dir.rotateY,
            rotateX: dir.rotateX,
            scale: 0.85,
            transformPerspective: 1200
          },
          {
            opacity: 1, 
            x: 0, 
            y: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: principlesRef.current,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
            }
          }
        );
      });

      // Connecting lines animation
      const lines = principlesRef.current.querySelectorAll('.connecting-line');
      lines.forEach((line, i) => {
        gsap.fromTo(line,
          { scaleX: 0, scaleY: 0, opacity: 0 },
          {
            scaleX: 1, scaleY: 1, opacity: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: principlesRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }

    // Tech stack batch animation with wave effect
    if (techStackRef.current) {
      const techTags = techStackRef.current.querySelectorAll('.tech-tag');
      gsap.fromTo(techTags,
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.7,
          rotateZ: -5
        },
        {
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotateZ: 0,
          stagger: {
            each: 0.05,
            from: 'start',
            ease: 'power2.out'
          },
          duration: 0.5,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: techStackRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Languages with elastic effect
    if (languagesRef.current) {
      const langTags = languagesRef.current.querySelectorAll('.lang-tag');
      gsap.fromTo(langTags,
        { 
          opacity: 0, 
          x: 50, 
          scale: 0.5
        },
        {
          opacity: 1, 
          x: 0, 
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: languagesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // ========================================================================
    // EXIT ANIMATION - Transition to HorizontalScrollBridge
    // ========================================================================
    if (containerRef.current) {
      // Stats cards compress on exit
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card');
        gsap.to(statCards, {
          scaleY: 0.8,
          opacity: 0.3,
          y: 30,
          stagger: 0.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'bottom 30%',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }

      // Principles cards fold on exit
      if (principlesRef.current) {
        const principleCards = principlesRef.current.querySelectorAll('.principle-card');
        gsap.to(principleCards, {
          rotateX: 20,
          opacity: 0.2,
          y: 40,
          scale: 0.9,
          stagger: 0.03,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'bottom 30%',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }

      // Tech tags scatter on exit
      if (techStackRef.current) {
        const techTags = techStackRef.current.querySelectorAll('.tech-tag');
        gsap.to(techTags, {
          y: 50,
          opacity: 0,
          scale: 0.7,
          stagger: 0.02,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'bottom 25%',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }

      // Languages scatter on exit
      if (languagesRef.current) {
        const langTags = languagesRef.current.querySelectorAll('.lang-tag');
        gsap.to(langTags, {
          x: 30,
          opacity: 0,
          scale: 0.8,
          stagger: 0.03,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'bottom 25%',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }

      // Gradient orbs move toward bottom center (portal effect)
      const orbs = containerRef.current.querySelectorAll('.gradient-orb');
      gsap.to(orbs, {
        y: 100,
        scale: 0.6,
        opacity: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 30%',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

  }, []);


  // Predefined particle positions
  const particles = useMemo(() => [
    { id: 0, x: 15, y: 20, size: 3, duration: 15, delay: 0 },
    { id: 1, x: 85, y: 15, size: 4, duration: 18, delay: 2 },
    { id: 2, x: 45, y: 80, size: 2, duration: 12, delay: 1 },
    { id: 3, x: 70, y: 45, size: 3, duration: 20, delay: 3 },
    { id: 4, x: 25, y: 65, size: 4, duration: 16, delay: 0.5 },
    { id: 5, x: 90, y: 70, size: 2, duration: 14, delay: 2.5 },
    { id: 6, x: 10, y: 85, size: 3, duration: 17, delay: 1.5 },
    { id: 7, x: 55, y: 30, size: 4, duration: 19, delay: 4 },
  ], []);

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden" ref={containerRef}>
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise Texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.015]">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Top Gradient Overlay */}
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
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none">
        <motion.div 
          style={{ scale: orbScale }}
          className="gradient-orb absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{ scale: orbScale }}
          className="gradient-orb absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      
      {/* Portal Effect - Bottom transition to HorizontalScrollBridge */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20">
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-64 opacity-0"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          style={{ y: headerY }}
          className="mb-16 text-center"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm text-primary bg-primary/10 rounded-full">
            About Me
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient inline-block">Passionate Developer</span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-transparent via-primary to-transparent rounded-full mx-auto" />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          ref={statsRef}
          style={{ y: statsY }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card glass-card p-6 rounded-2xl text-center group cursor-default relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-3xl md:text-4xl font-bold text-gradient relative z-10">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2 + i * 0.3} />
              </div>
              <div className="text-sm text-muted-foreground mt-1 relative z-10">{stat.label}</div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          ))}
        </motion.div>


        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Text */}
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

          {/* Right Column - Skills */}
          <motion.div
            style={{ y: rightColumnY }}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="space-y-8"
          >
            {/* Principles with 3D Cards */}
            <div ref={principlesRef} className="relative" style={{ perspective: '1200px' }}>
              {/* Connecting Lines */}
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                <div className="connecting-line absolute top-1/2 left-[15%] right-[15%] h-px bg-linear-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 origin-center" />
                <div className="connecting-line absolute left-1/2 top-[15%] bottom-[15%] w-px bg-linear-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2 origin-center" />
                <div className="connecting-line absolute top-1/2 left-1/2 w-2 h-2 bg-primary/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                {principles.map((item) => (
                  <motion.div
                    key={item.title}
                    className="principle-card relative glass-card p-5 rounded-xl overflow-hidden group cursor-default"
                    style={{ transformStyle: 'preserve-3d' }}
                    whileHover={{ scale: 1.05, y: -8, rotateY: 0, rotateX: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/30 transition-colors duration-300" />
                    <div className="relative z-10">
                      <div className={`p-2.5 rounded-xl bg-linear-to-br ${item.iconGradient} w-fit mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div ref={languagesRef}>
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-px bg-primary/50" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <motion.span
                    key={lang}
                    className="lang-tag px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30 cursor-default"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    {lang}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div ref={techStackRef}>
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-px bg-primary/50" />
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <motion.span
                    key={tech}
                    className="tech-tag px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm cursor-default"
                    whileHover={{ scale: 1.1, y: -2, backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}
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
