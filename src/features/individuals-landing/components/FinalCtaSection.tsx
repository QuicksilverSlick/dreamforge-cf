/**
 * Final CTA Section
 * Main conversion moment with urgency and social proof
 *
 * 2025 Optimizations:
 * - High-contrast design
 * - Clear value proposition
 * - Trust indicators
 * - Single focused CTA
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '200+', label: 'Builders earning $1K+ MRR' },
    { value: '$500K+', label: 'Total revenue generated' },
    { value: '1,247', label: 'Apps deployed this month' },
  ];

  return (
    <section
      id="cta"
      ref={ref}
      className="py-20 lg:py-32 px-4 bg-gradient-to-br from-blue-600 via-cyan-500 to-cyan-600 text-white text-center relative overflow-hidden"
      aria-labelledby="final-cta-title"
    >
      {/* Decorative Background */}
      <div
        className="absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title */}
        <motion.h2
          id="final-cta-title"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-6 leading-tight"
        >
          The AI Revolution Is Here. Which Side Are You On?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed"
        >
          You can watch AI take your job. Or you can use AI to build income streams that replace
          your salary. The window won't stay open forever.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 mb-12"
          role="region"
          aria-label="Platform success metrics"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-black mb-2">{stat.value}</div>
              <div className="text-base sm:text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <a
            href="https://build.cloudflare.dev"
            className="group inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-blue-600 text-xl font-extrabold rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            aria-label="Start building your first app for free"
          >
            <span>Start Building Your First App Free</span>
            <ArrowRight
              size={24}
              className="group-hover:translate-x-2 transition-transform"
              aria-hidden="true"
            />
          </a>

          {/* Trust Indicators */}
          <p className="text-sm opacity-90">
            No credit card required · Launch in 48 hours · 60-day guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
