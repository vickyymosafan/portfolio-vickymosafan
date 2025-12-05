"use client";

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Database, GitBranch, Layout, Zap, Shield } from 'lucide-react';

const languages = ['HTML', 'CSS', 'JavaScript', 'TypeScript'];

const techStack = [
  'React', 'Next.js', 'Vue.js', 'Node.js', 'Express.js',
  'Laravel', 'PostgreSQL', 'MySQL', 'MongoDB', 'VS Code', 'Git', 'GitHub'
];

const principles = [
  { icon: Code2, title: 'Clean Code', desc: 'Modular & maintainable', color: 'from-blue-500/20 to-cyan-500/20' },
  { icon: Layout, title: 'SOLID', desc: 'Design principles', color: 'from-purple-500/20 to-pink-500/20' },
  { icon: GitBranch, title: 'DRY', desc: "Don't repeat yourself", color: 'from-green-500/20 to-emerald-500/20' },
  { icon: Database, title: 'Scalable', desc: 'Ready for growth', color: 'from-orange-500/20 to-yellow-500/20' },
];

const stats = [
  { value: '3+', label: 'Years Experience', icon: Zap },
  { value: '10+', label: 'Projects Done', icon: Code2 },
  { value: '100%', label: 'Code Quality', icon: Shield },
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

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden" ref={containerRef}>
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-30 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-16 text-center"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-4 text-sm text-primary bg-primary/10 rounded-full"
          >
            About Me
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">Passionate Developer</span>
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto"
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 rounded-2xl text-center group cursor-default"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="space-y-6"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              Saya seorang <motion.span 
                className="text-primary font-semibold inline-block"
                whileHover={{ scale: 1.05 }}
              >Fullstack Developer</motion.span> yang 
              fokus pada kualitas, efisiensi, dan skalabilitas. Saya menggunakan pendekatan engineering 
              untuk membuat Product Requirement Documentation dan technical documentation sebelum 
              memulai pengembangan.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Saya merancang arsitektur sistem, workflow, dan requirement secara detail agar proses 
              development berjalan jelas. Saya memakai AI tools seperti Copilot, tetapi tetap 
              mengutamakan prinsip development yang kuat.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Saya membangun codebase yang bersih, modular, dan maintainable. Backend berfokus pada 
              arsitektur efisien, keamanan API, dan performa database. Frontend berfokus pada clean 
              code dan komponen yang reusable.
            </p>

            <motion.blockquote 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative pl-6 py-4 italic text-foreground/80"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
              <span className="text-4xl text-primary/30 absolute -top-2 left-4">&quot;</span>
              Dokumentasi yang jelas dan struktur kode yang solid menghasilkan aplikasi yang cepat, 
              aman, dan siap scale.
            </motion.blockquote>
          </motion.div>


          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="space-y-8"
          >
            {/* Principles */}
            <div className="grid grid-cols-2 gap-4">
              {principles.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className={`relative glass-card p-5 rounded-xl overflow-hidden group cursor-default`}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Languages */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-px bg-primary/50" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang, index) => (
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30 cursor-default"
                  >
                    {lang}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-px bg-primary/50" />
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1 + index * 0.03 }}
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
