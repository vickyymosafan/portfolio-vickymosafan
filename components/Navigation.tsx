"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

// Section dots for floating navigation
const sectionDots = [
  { id: 'hero', label: 'Home', href: '#' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section - hero when at top
      if (window.scrollY < 100) {
        setActiveSection('hero');
        return;
      }
      
      const sections = ['about', 'experience', 'contact'];
      let found = false;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            found = true;
            break;
          }
        }
      }
      // Default to hero if no section found
      if (!found && window.scrollY < window.innerHeight) {
        setActiveSection('hero');
      }
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setIsOpen(false);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isScrolled ? 0 : -100, 
          opacity: isScrolled ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="glass-card mx-4 mt-4 rounded-full px-6 py-3 border border-border/50">
          <div className="flex items-center justify-between">
            <motion.a 
              href="#" 
              className="flex items-center gap-2 font-display text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-gradient">VM</span>
            </motion.a>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <motion.button
                    onClick={() => handleClick(item.href)}
                    className={`relative px-4 py-2 rounded-full text-sm tracking-wide transition-colors ${
                      activeSection === item.href.slice(1)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeSection === item.href.slice(1) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary/10 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </motion.button>
                </li>
              ))}
              <li>
                <motion.button
                  onClick={() => handleClick('#contact')}
                  className="ml-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(45 100% 60% / 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hire Me
                </motion.button>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground rounded-full hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-20 z-40 glass-card rounded-2xl p-6 md:hidden border border-border/50"
            >
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleClick(item.href)}
                      className={`block w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        activeSection === item.href.slice(1)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      {item.name}
                    </button>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  <button
                    onClick={() => handleClick('#contact')}
                    className="block w-full text-center px-4 py-3 mt-4 bg-primary text-primary-foreground rounded-xl font-medium"
                  >
                    Hire Me
                  </button>
                </motion.li>
              </ul>
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Floating Section Dots - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4"
      >
        {/* Connecting line */}
        <div className="absolute top-0 bottom-0 right-[5px] w-px bg-linear-to-b from-transparent via-muted-foreground/20 to-transparent" />
        
        {sectionDots.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => handleClick(section.href)}
            className="group relative flex items-center justify-end"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Tooltip */}
            <span className="absolute right-6 px-3 py-1.5 rounded-full bg-secondary/80 backdrop-blur-sm text-xs text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-border/50 shadow-lg transform group-hover:-translate-x-1">
              {section.label}
            </span>
            
            {/* Dot */}
            <motion.div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-primary shadow-[0_0_12px_hsl(45_100%_60%/0.6)]'
                  : 'bg-muted-foreground/30 group-hover:bg-primary/50'
              }`}
              animate={
                activeSection === section.id
                  ? { scale: [1, 1.3, 1] }
                  : { scale: 1 }
              }
              transition={
                activeSection === section.id
                  ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            />
            
            {/* Active ring */}
            {activeSection === section.id && (
              <motion.div
                className="absolute w-5 h-5 rounded-full border border-primary/50"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
};

export default Navigation;
