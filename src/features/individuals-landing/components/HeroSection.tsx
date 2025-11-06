/**
 * Hero Section Component
 * Above-the-fold conversion element
 *
 * 2025 Optimizations:
 * - Dual CTAs with clear hierarchy
 * - Social proof (1M+ apps built)
 * - Animated code generation demo
 * - Mobile-first responsive (280px+)
 * - 60fps Framer Motion animations
 * - Full ARIA labels
 */

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Check, Rocket, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary"
      aria-labelledby="hero-title"
    >
      {/* Decorative Background */}
      <div
        className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-1/2 -right-1/4 w-3/4 h-[150%] bg-gradient-radial from-blue-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 bg-bg-quaternary border border-border rounded-full text-sm font-semibold text-text-secondary shadow-sm"
                role="status"
                aria-label="Open source, production-ready, multi-LLM AI builder"
              >
                <Zap size={16} className="text-blue-500" aria-hidden="true" />
                <span>Open Source · Production-Ready · Multi-LLM</span>
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              id="hero-title"
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-text-primary"
            >
              Stop Watching AI Take Jobs.
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Start Building Apps That Pay You.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl"
            >
              Turn your ideas into profitable SaaS apps in hours, not months. No coding required.
              Deploy to production infrastructure. Generate recurring income while you sleep.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#cta"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-200 text-center"
                aria-label="Build your first app for free"
              >
                <span>Build Your First App Free</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#lead-gen"
                className="inline-flex items-center justify-center px-8 py-4 bg-bg-quaternary border-2 border-border text-text-primary font-semibold rounded-lg hover:bg-bg-tertiary hover:border-blue-500/50 transition-all duration-200 text-center"
                aria-label="Download free guide to building apps"
              >
                Download Free Guide
              </a>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-8 pt-4"
              role="region"
              aria-label="Platform statistics"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-600" aria-label="Over 1 million apps built">
                  1M+
                </div>
                <div className="text-sm text-text-tertiary mt-1">Apps Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-600" aria-label="Over 10 AI models supported">
                  10+
                </div>
                <div className="text-sm text-text-tertiary mt-1">AI Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-600" aria-label="100 percent open source">
                  100%
                </div>
                <div className="text-sm text-text-tertiary mt-1">Open Source</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            {/* App Window */}
            <div
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm relative z-20"
              role="img"
              aria-label="Dreamforge AI app builder interface showing code generation process"
            >
              {/* Window Header */}
              <div className="bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Your SaaS App
                </span>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm space-y-3 bg-gray-50 dark:bg-gray-950">
                <div className="flex gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400 font-bold" aria-hidden="true">
                    &gt;
                  </span>
                  <span>"Build a subscription management dashboard"</span>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="space-y-2 text-gray-600 dark:text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" aria-hidden="true" />
                    <span>Planning architecture...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" aria-hidden="true" />
                    <span>Generating components...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" aria-hidden="true" />
                    <span>Deploying to Cloudflare...</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-500 font-bold mt-4">
                    <Rocket size={16} aria-hidden="true" />
                    <span>
                      Live at:{' '}
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        your-app.com
                      </span>
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Revenue Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl px-6 py-4 min-w-[200px] z-30"
              role="status"
              aria-label="Monthly revenue example: $3,247, up 24% this month"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Monthly Revenue
              </div>
              <div className="text-3xl font-extrabold text-green-600 dark:text-green-500">$3,247</div>
              <div className="text-sm text-green-600 dark:text-green-500 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp size={16} className="text-green-600 dark:text-green-400" aria-hidden="true" /> +24% this month
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
