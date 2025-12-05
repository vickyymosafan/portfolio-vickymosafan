"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Send, Github, Linkedin, MapPin, ArrowUpRight, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from '@/hooks/use-toast';

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:bg-[#333]/20 hover:border-[#333]' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-[#0077b5]/20 hover:border-[#0077b5]' },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSuccess(true);
    toast({
      title: '✨ Message sent!',
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSuccess(false);
    }, 2000);
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  return (
    <section id="contact" className="section-padding bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

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
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm text-primary bg-primary/10 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
            Let&apos;s Connect
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">Get In Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a project in mind? Let&apos;s work together to bring your ideas to life.
          </p>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto mt-6"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -3 }}
              className="glass-card p-6 rounded-2xl group cursor-default"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Mail className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-muted-foreground">hello@vickymosafan.dev</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -3 }}
              className="glass-card p-6 rounded-2xl group cursor-default"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <MapPin className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Location</h4>
                  <p className="text-muted-foreground">Indonesia</p>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Follow Me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 glass-card rounded-xl border border-transparent transition-all ${social.color}`}
                  >
                    <social.icon className="w-6 h-6 text-foreground" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* CTA Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border border-primary/20"
            >
              <h4 className="font-semibold text-foreground mb-2">🚀 Ready to start?</h4>
              <p className="text-muted-foreground text-sm">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </motion.div>
          </motion.div>


          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-2xl space-y-6 relative overflow-hidden">
              {/* Success Overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isSuccess ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                className={`absolute inset-0 bg-background/95 flex flex-col items-center justify-center z-10 ${isSuccess ? '' : 'pointer-events-none'}`}
              >
                <motion.div
                  animate={isSuccess ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                </motion.div>
                <p className="text-xl font-semibold text-foreground">Message Sent!</p>
                <p className="text-muted-foreground">I&apos;ll get back to you soon.</p>
              </motion.div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <motion.div
                  animate={focusedField === 'name' ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your name"
                    required
                    className="bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </motion.div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <motion.div
                  animate={focusedField === 'email' ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    required
                    className="bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </motion.div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <motion.div
                  animate={focusedField === 'message' ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div 
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send Message
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-24 pt-8 border-t border-border/30 text-center"
      >
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Vicky Mosafan. Built with passion and code.
        </p>
      </motion.div>
    </section>
  );
};

export default ContactSection;
