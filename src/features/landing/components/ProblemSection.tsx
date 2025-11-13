/**
 * Problem Section - The Villain (Lack of Training & Fundamentals)
 * Shows the real problem: businesses scaling without proper foundations
 */

import { AlertTriangle, X, Users, Code, Shield } from 'react-feather';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const EXTERNAL_PROBLEMS = [
  {
    title: 'Broken Authentication & Payments',
    icon: Code,
    issues: [
      'OAuth fails in production despite working in demos',
      'Stripe integration missing or incomplete',
      'No database architecture for multi-tenant SaaS',
      'Deployment infrastructure completely absent',
    ],
    stat: '$68K-$132K to fix',
  },
  {
    title: 'Security Vulnerabilities Everywhere',
    icon: Shield,
    issues: [
      '45% of AI-generated code has CVEs (Common Vulnerabilities)',
      'Lovable scores 1.8/10 for security resistance',
      'Your early customers are exposed to data breaches',
      'One audit away from investor panic or legal liability',
    ],
    stat: '45% CVE rate',
  },
  {
    title: 'Zero Strategic Guidance',
    icon: Users,
    issues: [
      'No answer to "Should I even use AI for this feature?"',
      'No training on scaling without amplifying problems',
      'No protection from AI damaging customer relationships',
      '96% of AI implementations fail to deliver ROI',
    ],
    stat: '96% fail',
  },
];

const INTERNAL_PROBLEMS = [
  {
    emotion: 'Abandoned & Betrayed',
    description: 'You trusted the promise of "finished apps in days"—now you\'re stranded 6 months in',
  },
  {
    emotion: 'Paralyzed by Fear',
    description: 'Every decision could waste another $10K+ or 3 months. You\'re frozen.',
  },
  {
    emotion: 'Imposter Syndrome',
    description: 'Other founders launched. You can\'t even deploy authentication. What\'s wrong with you?',
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
            <span className="text-sm font-medium text-red-500">The Bait-and-Switch You Didn't See Coming</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            You're Not{' '}
            <span className="text-red-500">Failing</span>
            .<br />
            You Were{' '}
            <span className="text-accent">Abandoned</span>
            .
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            3 months ago, Lovable/v0/Bolt promised you a finished app. Today, you're stuck at 60-70% with broken authentication, no payments, security holes, and $68K-$132K in hidden costs to reach production. You're not incompetent—<span className="font-semibold text-text-primary">you were sold a prototype disguised as a solution</span>.
          </p>
        </motion.div>

        {/* External Problems (What You Can See) */}
        <div className="space-y-8 mb-24">
          <h3 className="text-2xl font-bold text-text-primary text-center">The External Problem (What You Can See)</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {EXTERNAL_PROBLEMS.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-bg-tertiary border border-red-500/20 rounded-xl p-6 space-y-4 hover:border-red-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-red-500" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">{problem.title}</h4>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                      {problem.stat}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {problem.issues.map((issue, i) => (
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
        </div>

        {/* Internal Problems (How It Makes You Feel) */}
        <div className="space-y-8 mb-24">
          <h3 className="text-2xl font-bold text-text-primary text-center">The Internal Problem (How This Makes You Feel)</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {INTERNAL_PROBLEMS.map((problem, index) => (
              <motion.div
                key={problem.emotion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-bg-tertiary border border-orange-500/20 rounded-xl p-6 space-y-3 hover:border-orange-500/40 transition-colors"
              >
                <h4 className="text-lg font-bold text-orange-500">{problem.emotion}</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Philosophical Problem (Why It's Wrong) */}
        <div className="space-y-6 mb-16">
          <h3 className="text-2xl font-bold text-text-primary text-center">The Philosophical Problem (Why This Is Fundamentally Wrong)</h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border border-red-500/30 rounded-xl p-8 space-y-4 max-w-4xl mx-auto"
          >
            <p className="text-lg text-text-primary font-semibold">
              AI promised to democratize technology and empower anyone to build their dream business.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Instead, current platforms run a <span className="font-semibold text-text-primary">bait-and-switch</span>: they handle the easy 25% (generating UI code) while abandoning you with the hard 75% (infrastructure, security, payments, deployment, business strategy)—the exact opposite of what AI should do.
            </p>
            <p className="text-text-secondary leading-relaxed">
              This isn't democratization. It's <span className="font-semibold text-text-primary">exploitation disguised as innovation</span>. Platforms profit from your ignorance while celebrating "1M+ apps built"—ignoring the 900K+ that never launched because founders were abandoned halfway to success.
            </p>
            <p className="text-lg text-accent font-semibold">
              You deserve honest guidance BEFORE building, not blame AFTER failing.
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-6 py-4 rounded-xl bg-gradient-to-r from-accent/10 to-[#FFD700]/10 border border-accent/30">
            <p className="text-lg font-semibold text-text-primary">
              Dreamforge finishes what other platforms started—and teaches you how to build a sustainable business, not just code.
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Production deployment that works. Real payments. Security-first code. Strategic training on when/how to use AI. <span className="font-semibold text-text-primary">No $68K-$132K surprise costs.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
