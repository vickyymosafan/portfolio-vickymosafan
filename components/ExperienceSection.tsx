"use client";

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Calendar, ChevronRight, Layers } from 'lucide-react';

const experiences = [
  {
    title: 'Freelance Website Developer',
    company: 'Self-Employed',
    period: 'Present',
    description: 'Mengembangkan sistem monitoring kesehatan lansia untuk Posyandu.',
    features: ['BMI tracking', 'Tekanan darah', 'Kolesterol', 'Asam urat', 'Trend analysis otomatis', 'Health status summary'],
    techStack: ['Next.js', 'Express.js', 'Prisma', 'PostgreSQL'],
    highlight: true,
    icon: '🚀',
  },
  {
    title: 'Project Web Architect',
    company: 'Antosa Architect',
    period: '2023',
    description: 'Landing Page Optimization dan Client Dashboard Development dengan fokus pada Information System.',
    features: ['Landing Page', 'Client Dashboard', 'Information System'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    highlight: false,
    icon: '🏗️',
  },
  {
    title: 'Project-Based Virtual Intern',
    company: 'Bank Mandiri x Rakamin Academy',
    period: '2023',
    description: 'Mobile Apps Developer fokus pada Kotlin development, unit testing, dan API integration.',
    features: ['NewsAPL App', 'Unit Testing', 'API Integration', 'GitLab CI/CD'],
    techStack: ['Kotlin', 'Android Studio', 'GitLab'],
    highlight: false,
    icon: '📱',
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);


  return (
    <section id="experience" className="section-padding bg-secondary/20 relative overflow-hidden" ref={containerRef}>
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-40 pointer-events-none"
      >
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative" ref={ref}>
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
            My Journey
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">Experience</span>
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-1 bg-linear-to-r from-transparent via-primary to-transparent rounded-full mx-auto"
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary via-primary/50 to-transparent origin-top hidden md:block"
          />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15, type: "spring" }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`relative md:grid md:grid-cols-2 md:gap-8 ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <motion.div 
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full z-10 items-center justify-center"
                  animate={hoveredIndex === index ? { scale: 1.5 } : { scale: 1 }}
                >
                  <div className="w-2 h-2 bg-background rounded-full" />
                </motion.div>

                {/* Content */}
                <div className={`${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`glass-card rounded-2xl overflow-hidden ${
                      exp.highlight ? 'ring-2 ring-primary/30' : ''
                    }`}
                  >
                    {/* Glow effect for highlighted */}
                    {exp.highlight && (
                      <motion.div 
                        className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}

                    <div className="p-6 md:p-8 relative">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div 
                          className="text-3xl"
                          animate={hoveredIndex === index ? { rotate: [0, -10, 10, 0] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {exp.icon}
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                              {exp.title}
                            </h3>
                            {exp.highlight && (
                              <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-lg">{exp.company}</p>
                        </div>
                      </div>

                      {/* Period Badge */}
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{exp.period}</span>
                      </div>

                      <p className="text-foreground/80 mb-6">{exp.description}</p>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Key Features
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.features.map((feature, fIndex) => (
                            <motion.span
                              key={feature}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : {}}
                              transition={{ delay: 0.5 + fIndex * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1.5 bg-background/50 text-foreground/80 rounded-lg text-sm flex items-center gap-1 cursor-default"
                            >
                              <ChevronRight className="w-3 h-3 text-primary" />
                              {feature}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.techStack.map((tech, tIndex) => (
                            <motion.span
                              key={tech}
                              initial={{ opacity: 0, y: 10 }}
                              animate={isInView ? { opacity: 1, y: 0 } : {}}
                              transition={{ delay: 0.6 + tIndex * 0.05 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20 cursor-default"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Empty space for timeline layout */}
                <div className={`hidden md:block ${index % 2 === 0 ? '' : 'md:col-start-1 md:row-start-1'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
