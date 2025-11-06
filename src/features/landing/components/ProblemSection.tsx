/**
 * Problem Section - The Villain (Prototype-to-Production Gap)
 * Shows what competitors get wrong and the pain it causes
 */

import { AlertTriangle, X, DollarSign, Clock, Shield } from 'react-feather';
import { Palette, Zap, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const COMPETITOR_FAILURES = [
  {
    name: 'lovable.dev',
    icon: Palette,
    issues: [
      '60-70% solution quality',
      'Security vulnerability (CVE-2025-48757)',
      '$68K-$132K to reach production',
      'Broken auth at scale',
    ],
    cost: '$68K+',
  },
  {
    name: 'bolt.new',
    icon: Zap,
    issues: [
      'Broken authentication (Supabase/Firebase)',
      'No Git integration',
      'JavaScript-only limitation',
      'Prototypes that don\'t deploy',
    ],
    cost: 'Rebuild required',
  },
  {
    name: 'v0.dev',
    icon: Rocket,
    issues: [
      'Frontend-only (no backend)',
      'No database generation',
      'No Stripe integration',
      'Manual infrastructure setup',
    ],
    cost: 'DIY everything',
  },
];

const PAIN_POINTS = [
  {
    icon: DollarSign,
    title: 'Hidden Costs',
    description: '$68K-$132K to make AI prototypes production-ready',
    stat: '73%',
    statLabel: 'of AI-built startups fail to scale by month 6',
  },
  {
    icon: Clock,
    title: 'Wasted Time',
    description: '6-12 months of runway burned on technical debt',
    stat: '65-75%',
    statLabel: 'of development time is NOT coding',
  },
  {
    icon: Shield,
    title: 'Security Risks',
    description: 'Vulnerable code that breaks in production',
    stat: '45%',
    statLabel: 'of AI-generated code has security flaws',
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-bg-secondary relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">The Prototype-to-Production Gap</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            Other AI Tools Leave You{' '}
            <span className="text-red-500">Stranded at 60%</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            They generate beautiful prototypes, but abandon you when it's time to launch a real business.
          </p>
        </motion.div>

        {/* Competitor Comparison Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {COMPETITOR_FAILURES.map((competitor, index) => {
            const Icon = competitor.icon;
            return (
              <motion.div
                key={competitor.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-bg-tertiary border border-red-500/20 rounded-xl p-6 space-y-4 hover:border-red-500/40 transition-colors"
              >
                {/* Competitor Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-500" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{competitor.name}</h3>
                      <p className="text-sm text-text-tertiary">Prototype-only</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                    {competitor.cost}
                  </div>
                </div>

              {/* Issues List */}
              <div className="space-y-2">
                {competitor.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{issue}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {PAIN_POINTS.map((pain, index) => {
            const Icon = pain.icon;
            return (
              <motion.div
                key={pain.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">{pain.title}</h3>
                  <p className="text-text-secondary text-sm mb-4">{pain.description}</p>
                  <div className="inline-block px-4 py-2 rounded-lg bg-bg-quaternary border border-border">
                    <p className="text-3xl font-bold text-accent mb-1">{pain.stat}</p>
                    <p className="text-xs text-text-tertiary">{pain.statLabel}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-6 py-4 rounded-xl bg-gradient-to-r from-accent/10 to-[#FFD700]/10 border border-accent/30">
            <p className="text-lg font-semibold text-text-primary">
              Don't waste months and $68K+ fixing what AI should've generated correctly.
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Dreamforge delivers production-ready apps from day one.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
