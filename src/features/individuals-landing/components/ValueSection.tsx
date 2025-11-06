/**
 * Value Proposition Section
 * Comparison table + Differentiator cards
 *
 * 2025 Optimizations:
 * - Clear competitive differentiation
 * - Mobile-responsive table (stacks on mobile)
 * - Icon-driven differentiators
 * - Full ARIA labels
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, Server, GitBranch, Box, DollarSign, Check, X, AlertTriangle } from 'lucide-react';

export default function ValueSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const competitors = [
    { name: 'Lovable', openSource: 'No', infra: 'AWS/Vercel', multiLLM: 'Claude Only', phaseWise: 'Linear', backend: 'Yes', lockIn: 'High', price: '$25/mo' },
    { name: 'Bolt.new', openSource: 'Partial', infra: 'Sandboxes', multiLLM: 'Claude Only', phaseWise: 'No', backend: 'Yes', lockIn: 'Medium', price: '$20/mo' },
    { name: 'V0', openSource: 'No', infra: 'Vercel Only', multiLLM: 'Proprietary', phaseWise: 'No', backend: 'No', lockIn: 'High', price: '$20/mo' },
  ];

  const differentiators = [
    {
      icon: GitBranch,
      title: 'True Open Source',
      description: 'Your code, your infrastructure, your revenue. Unlike Lovable and V0, you own everything. No vendor lock-in. No surprise price hikes. Fork it, modify it, scale it - it\'s yours.',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Zap,
      title: 'Multi-LLM Fallback Chains',
      description: 'Competitors lock you to Claude. We support 10+ AI models with intelligent fallback. If one fails, we seamlessly switch. 99.9% uptime. Zero vendor risk. You\'re not betting on a single AI company.',
      color: 'from-cyan-600 to-blue-700',
    },
    {
      icon: Server,
      title: 'Production-Ready from Day One',
      description: 'Bolt.new uses sandboxes. V0 locks you to Vercel. We deploy to Cloudflare\'s global network - the same infrastructure serving Fortune 500s. Real databases. Real edge computing. Real scale.',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Shield,
      title: 'Phase-Wise Generation',
      description: 'Competitors generate code in one shot and hope. We use deterministic, 12-phase generation with automated review cycles. More control. Fewer bugs. Predictable results every time.',
      color: 'from-cyan-600 to-blue-700',
    },
    {
      icon: Box,
      title: 'SCOF Protocol',
      description: 'Our Structured Code Output Format handles streaming from any AI model. Competitors break when models change. We\'re resilient. Reliable. Future-proof.',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: DollarSign,
      title: 'Pay What You Use',
      description: 'No forced $25-50/month plans. Start free. Pay only for AI usage as you grow. Earn $1K/month? Spend $20. Earn $10K? Spend $200. Costs scale with revenue.',
      color: 'from-cyan-600 to-blue-700',
    },
  ];

  return (
    <section
      id="value"
      ref={ref}
      className="py-20 lg:py-28 px-4 bg-bg-secondary"
      aria-labelledby="value-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="value-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4"
          >
            Why Dreamforge Beats The Competition
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            We analyzed Lovable, Bolt.new, and V0. Here's why serious builders choose Dreamforge.
          </p>
        </motion.div>

        {/* Comparison Table - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block bg-bg-quaternary border border-border rounded-2xl shadow-xl overflow-hidden mb-16"
          role="table"
          aria-label="Feature comparison between Dreamforge and competitors"
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-5 bg-bg-tertiary border-b border-border font-bold text-sm uppercase tracking-wide"
            role="row"
          >
            <div className="px-6 py-4" role="columnheader">Feature</div>
            {competitors.map((comp) => (
              <div key={comp.name} className="px-6 py-4 text-center" role="columnheader">{comp.name}</div>
            ))}
            <div className="px-6 py-4 text-center bg-blue-600/10 text-blue-600" role="columnheader">Dreamforge</div>
          </div>

          {/* Table Rows */}
          {[
            { label: 'Open Source', key: 'openSource', dreamforge: '100%' },
            { label: 'Production Infrastructure', key: 'infra', dreamforge: 'Cloudflare Global' },
            { label: 'Multi-LLM Support', key: 'multiLLM', dreamforge: '10+ Models' },
            { label: 'Phase-Wise Generation', key: 'phaseWise', dreamforge: '12 Phases' },
            { label: 'Backend Preview', key: 'backend', dreamforge: 'Full Stack' },
            { label: 'Vendor Lock-In', key: 'lockIn', dreamforge: 'Zero' },
            { label: 'Starting Price', key: 'price', dreamforge: 'FREE Start' },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-5 border-b border-border last:border-b-0" role="row">
              <div className="px-6 py-4 font-semibold text-text-primary" role="cell">{row.label}</div>
              {competitors.map((comp) => (
                <div key={comp.name} className="px-6 py-4 text-center text-text-secondary" role="cell">
                  {comp[row.key as keyof typeof comp]}
                </div>
              ))}
              <div className="px-6 py-4 text-center bg-blue-600/5 text-blue-600 font-bold" role="cell">
                <div className="flex items-center justify-center gap-2">
                  <Check size={16} aria-hidden="true" />
                  <span>{row.dreamforge}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Comparison Cards - Mobile */}
        <div className="lg:hidden space-y-6 mb-16">
          {competitors.map((comp, index) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-bg-quaternary border border-border rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-text-primary mb-4">{comp.name}</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Open Source:</dt>
                  <dd className="font-semibold">{comp.openSource}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Infrastructure:</dt>
                  <dd className="font-semibold">{comp.infra}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Multi-LLM:</dt>
                  <dd className="font-semibold">{comp.multiLLM}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Starting Price:</dt>
                  <dd className="font-semibold">{comp.price}</dd>
                </div>
              </dl>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-2 border-blue-600 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-blue-600 mb-4">Dreamforge</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <dt className="text-text-secondary">Open Source:</dt>
                <dd className="font-semibold text-blue-600 flex items-center gap-1">
                  <Check size={16} /> 100%
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-text-secondary">Infrastructure:</dt>
                <dd className="font-semibold text-blue-600 flex items-center gap-1">
                  <Check size={16} /> Cloudflare Global
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-text-secondary">Multi-LLM:</dt>
                <dd className="font-semibold text-blue-600 flex items-center gap-1">
                  <Check size={16} /> 10+ Models
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-text-secondary">Starting Price:</dt>
                <dd className="font-semibold text-blue-600 flex items-center gap-1">
                  <Check size={16} /> FREE Start
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Differentiator Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((diff, index) => {
            const Icon = diff.icon;
            return (
              <motion.div
                key={diff.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-bg-quaternary border border-border rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${diff.color} mb-6`}>
                  <Icon size={28} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{diff.title}</h3>
                <p className="text-text-secondary leading-relaxed">{diff.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
