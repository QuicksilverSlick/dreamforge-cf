/**
 * Plan Section - 3-Step Process
 * Shows how to get from zero to profitable app
 *
 * 2025 Optimizations:
 * - Clear step-by-step flow
 * - Visual demonstrations
 * - Mobile-responsive layout
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, ChevronRight, Rocket } from 'lucide-react';

export default function PlanSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: 1,
      title: 'Describe Your App',
      description: 'Tell Dreamforge what you want to build. "A subscription management dashboard for freelancers" or "A habit tracker with streak counting." That\'s it.',
      visual: (
        <div className="bg-bg-tertiary border border-border rounded-xl p-6">
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <div className="text-xs text-blue-600 font-semibold mb-2">You</div>
            <div className="text-text-primary leading-relaxed">
              Build a SaaS app where users can create invoices, track payments, and manage clients.
              Include Stripe for subscriptions.
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Watch AI Build & Deploy',
      description: 'Dreamforge uses 12 phases with automated reviews. Multiple AI models work together with fallback chains. Deploy to Cloudflare\'s global network. All automatic.',
      visual: (
        <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3 text-green-500 font-semibold">
            <Check size={20} aria-hidden="true" />
            <span>Blueprint Created</span>
          </div>
          <div className="flex items-center gap-3 text-green-500 font-semibold">
            <Check size={20} aria-hidden="true" />
            <span>Components Generated</span>
          </div>
          <div className="flex items-center gap-3 text-green-500 font-semibold">
            <Check size={20} aria-hidden="true" />
            <span>Backend Connected</span>
          </div>
          <div className="flex items-center gap-3 text-green-500 font-semibold">
            <Check size={20} aria-hidden="true" />
            <span>Tests Passed</span>
          </div>
          <div className="flex items-center gap-3 text-blue-600 font-bold animate-pulse">
            <ChevronRight size={20} aria-hidden="true" />
            <span>Deploying to Cloudflare...</span>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Launch & Start Earning',
      description: 'Your app is live on a custom domain. Connect Stripe. Share the link. Start collecting subscriptions. Scale from $100 to $10K MRR.',
      visual: (
        <div className="bg-bg-tertiary border border-border rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4" aria-hidden="true">
            <Rocket size={48} className="text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-600 mb-2">your-saas.com</div>
          <div className="inline-flex items-center gap-2 text-green-500 font-semibold mb-4">
            <Check size={20} aria-hidden="true" />
            <span>Live</span>
          </div>
          <div className="flex justify-around gap-4 text-sm">
            <div>
              <div className="font-bold text-text-primary">23</div>
              <div className="text-text-tertiary">signups</div>
            </div>
            <div>
              <div className="font-bold text-text-primary">$487</div>
              <div className="text-text-tertiary">MRR</div>
            </div>
            <div>
              <div className="font-bold text-text-primary">99.9%</div>
              <div className="text-text-tertiary">uptime</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      className="py-20 lg:py-28 px-4 bg-bg-secondary"
      aria-labelledby="plan-title"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="plan-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4"
          >
            From Zero to Profitable App in 3 Simple Steps
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            No coding. No DevOps. No vendor lock-in. Just results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              className="flex flex-col lg:flex-row gap-8 items-start"
            >
              {/* Step Number */}
              <div
                className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-3xl font-extrabold rounded-full flex items-center justify-center shadow-lg"
                aria-label={`Step ${step.number}`}
              >
                {step.number}
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div>{step.visual}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
