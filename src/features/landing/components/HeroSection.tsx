/**
 * Hero Section - Above the fold
 * Optimized for conversion with clear value prop and single CTA
 */

import { ArrowRight, CheckCircle } from 'react-feather';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onGetStarted: () => void;
  isAuthenticated: boolean;
}

export function HeroSection({ onGetStarted, isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary opacity-50" />

      {/* Dotted background pattern */}
      <div className="absolute inset-0 text-accent z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="hero-dots"
              viewBox="-6 -6 12 12"
              patternUnits="userSpaceOnUse"
              width="24"
              height="24"
            >
              <circle cx="0" cy="0" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Value Proposition */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* BETA Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-sm font-medium text-accent">Now in BETA · Limited Spots Available</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Build Real{' '}
              <span className="bg-gradient-to-r from-accent via-[#FFD700] to-accent bg-clip-text text-transparent animate-gradient">
                Businesses
              </span>
              ,<br />
              Not Just Prototypes
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
              The only AI code generator that ships{' '}
              <span className="font-semibold text-text-primary">production-ready business apps</span>
              {' '}with Stripe payments, authentication, and hosting included.
            </p>
          </div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {[
              'Production-ready in days, not months',
              '$0 hidden costs (vs. $68K-$132K with competitors)',
              'Stripe payments & auth built-in',
              'Enterprise-grade Cloudflare infrastructure',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-base text-text-secondary">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-accent to-[#FFD700] hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 text-white font-semibold text-lg px-8 py-6 rounded-xl"
            >
              {isAuthenticated ? 'Start Building' : 'Claim Your BETA Spot'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-accent/30 hover:border-accent hover:bg-accent/5 font-semibold text-lg px-8 py-6 rounded-xl"
            >
              View BETA Pricing
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-6 pt-6 border-t border-border"
          >
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#FFD700] fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-tertiary mt-1">Rated 5.0 by early adopters</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold text-text-primary">73%</p>
              <p className="text-sm text-text-tertiary">avoid deployment failure</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Visual Demo / Screenshot */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-accent/20">
            {/* Placeholder for demo video/screenshot */}
            <div className="aspect-[4/3] bg-gradient-to-br from-bg-tertiary to-bg-quaternary p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-accent/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-text-primary">See Dreamforge in Action</p>
                  <p className="text-sm text-text-tertiary">Watch how we build production apps in minutes</p>
                </div>
              </div>
            </div>

            {/* Floating stats/badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-bg-tertiary rounded-xl shadow-lg p-4 border border-accent/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">0 Vulnerabilities</p>
                  <p className="text-xs text-text-tertiary">vs 45% industry average</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -top-6 -left-6 bg-white dark:bg-bg-tertiary rounded-xl shadow-lg p-4 border border-accent/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Deploy in Days</p>
                  <p className="text-xs text-text-tertiary">not months or years</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
