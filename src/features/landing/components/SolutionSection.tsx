/**
 * Solution Section - Dreamforge as the Guide
 * Shows empathy + competency with 3-step plan
 */

import { CheckCircle, Shield, Zap, Database, CreditCard, Users, TrendingUp } from 'react-feather';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: Shield,
    title: 'Production-Grade Security',
    description: '0 vulnerabilities with automated OWASP scanning',
    stat: '0%',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
  {
    icon: CreditCard,
    title: 'Stripe Integration',
    description: 'Subscriptions, metering, and invoicing built-in',
    stat: '100%',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Authentication & RBAC',
    description: 'OAuth, SSO, MFA, and role-based access control',
    stat: 'Built-in',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  {
    icon: Database,
    title: 'Multi-Tenancy Ready',
    description: 'Scalable database architecture for SaaS apps',
    stat: 'Enterprise',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: Zap,
    title: 'Edge Computing',
    description: 'Cloudflare Workers for global performance',
    stat: '<50ms',
    color: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-yellow-500',
  },
  {
    icon: TrendingUp,
    title: 'Auto-Scaling',
    description: 'From prototype to enterprise without rewrites',
    stat: '∞',
    color: 'from-accent/20 to-[#FFD700]/20',
    iconColor: 'text-accent',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Describe Your Business App',
    description: 'Tell us what you\'re building in plain English. No technical jargon needed.',
    example: '"A SaaS platform for freelancers to manage invoices with Stripe payouts"',
  },
  {
    number: '02',
    title: 'Review the Blueprint',
    description: 'We generate a complete architecture: database, auth, payments, and API design.',
    example: 'Approve or request changes before any code is written',
  },
  {
    number: '03',
    title: 'Launch to Production',
    description: 'Production-ready code with infrastructure, security, and monitoring configured.',
    example: 'Your app is live and monetizable, not a prototype',
  },
];

interface SolutionSectionProps {
  onGetStarted: () => void;
}

export function SolutionSection({ onGetStarted }: SolutionSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-bg-primary relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-24">
        {/* Empathy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <span className="text-sm font-medium text-accent">We've Been There</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            Built By Developers Who{' '}
            <span className="bg-gradient-to-r from-accent to-[#FFD700] bg-clip-text text-transparent">
              Hit the Wall
            </span>
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed">
            We know what it's like to build with lovable.dev and hit the production wall.
            To see bolt.new generate beautiful UI but fail at authentication.
            To watch v0.dev create components while you're stuck manually building the entire backend.
          </p>
          <p className="text-lg text-text-primary font-semibold">
            We built Dreamforge because we felt your pain. 73% of AI-built startups fail to scale
            by month 6 — not because of bad ideas, but because their tools abandoned them.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-bg-tertiary border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-bg-quaternary flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div className="px-2 py-1 rounded-full bg-bg-quaternary text-accent text-xs font-mono font-semibold">
                      {feature.stat}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-secondary">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Plan */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
              From Idea to Revenue in{' '}
              <span className="text-accent">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              No DevOps expertise required. No hidden complexity. Just describe your business.
            </p>
          </motion.div>

          <div className="space-y-8">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                className="flex gap-6 items-start"
              >
                {/* Step Number */}
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-[#FFD700] flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>

                {/* Step Content */}
                <div className="flex-1 bg-bg-tertiary border border-border rounded-xl p-6 space-y-3">
                  <h3 className="text-2xl font-semibold text-text-primary">{step.title}</h3>
                  <p className="text-text-secondary">{step.description}</p>
                  <div className="px-4 py-3 rounded-lg bg-bg-quaternary border-l-4 border-accent">
                    <p className="text-sm text-text-tertiary italic">{step.example}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute left-8 mt-24 w-px h-12 bg-gradient-to-b from-accent to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="inline-block px-6 py-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <div className="flex items-center gap-3 justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <p className="text-lg font-semibold text-text-primary">The Dreamforge Guarantee</p>
            </div>
            <p className="text-sm text-text-secondary max-w-2xl">
              If your app can't handle production traffic within 30 days, we'll debug, provide direct developer
              support, and refund your subscription—no questions asked.
            </p>
          </div>

          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-to-r from-accent to-[#FFD700] hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 text-white font-semibold text-lg px-8 py-6 rounded-xl"
          >
            Start Building Your Business App
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
