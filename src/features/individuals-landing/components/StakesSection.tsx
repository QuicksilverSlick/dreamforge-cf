/**
 * Stakes Section Component
 * Shows "Without Dreamforge" vs "With Dreamforge" comparison
 *
 * 2025 Optimizations:
 * - Clear contrast between failure and success states
 * - Urgency messaging
 * - Full ARIA labels for comparison cards
 * - Mobile-responsive grid
 */

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertTriangle, X, Rocket, Check, Clock } from 'lucide-react';

export default function StakesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 px-4 bg-bg-primary"
      aria-labelledby="stakes-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="stakes-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4"
          >
            The AI Revolution Won't Wait
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            You're at a crossroads. The next 12 months will determine if you're replaced by AI or
            empowered by it.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Without Dreamforge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-2xl p-8 shadow-lg"
            role="region"
            aria-labelledby="without-dreamforge-title"
          >
            <div className="mb-4" aria-hidden="true">
              <AlertTriangle size={48} className="text-red-600" />
            </div>
            <h3
              id="without-dreamforge-title"
              className="text-2xl font-bold text-red-900 dark:text-red-200 mb-6"
            >
              Without Dreamforge
            </h3>
            <ul
              className="space-y-4"
              aria-label="Consequences of not using Dreamforge"
            >
              {[
                'Watch AI automation eliminate your job security',
                'Miss the biggest wealth creation opportunity in decades',
                'Stay dependent on a single income source',
                'Watch others build $10K/month side hustles',
                'Remain stuck in the "learning to code" trap',
                'Pay $300+/month for closed-source AI tools that own your code',
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-red-800 dark:text-red-300 text-base sm:text-lg border-b border-red-200 dark:border-red-800 pb-4 last:border-b-0"
                >
                  <X
                    size={20}
                    className="flex-shrink-0 mt-1 text-red-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With Dreamforge */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-2xl p-8 shadow-lg"
            role="region"
            aria-labelledby="with-dreamforge-title"
          >
            <div className="mb-4" aria-hidden="true">
              <Rocket size={48} className="text-green-600" />
            </div>
            <h3
              id="with-dreamforge-title"
              className="text-2xl font-bold text-green-900 dark:text-green-200 mb-6"
            >
              With Dreamforge
            </h3>
            <ul
              className="space-y-4"
              aria-label="Benefits of using Dreamforge"
            >
              {[
                'Build and launch profitable apps in days, not months',
                'Generate recurring revenue from multiple income streams',
                'Own your code - truly yours with open source',
                'Deploy to production infrastructure (not toy sandboxes)',
                'Never get locked into a single AI provider',
                'Start free, scale as you earn',
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-green-800 dark:text-green-300 text-base sm:text-lg border-b border-green-200 dark:border-green-800 pb-4 last:border-b-0"
                >
                  <Check
                    size={20}
                    className="flex-shrink-0 mt-1 text-green-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex-shrink-0" aria-hidden="true">
            <Clock size={48} className="text-white" />
          </div>
          <div className="text-base sm:text-lg leading-relaxed">
            <strong className="font-bold">The window is closing.</strong> Every day, more people
            realize AI can be a tool, not a threat. Early builders are already capturing market
            share. Will you be one of them?
          </div>
        </motion.div>
      </div>
    </section>
  );
}
