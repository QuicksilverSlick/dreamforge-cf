/**
 * Pricing Section Component
 * 3 tiers with monthly/annual toggle
 *
 * 2025 Optimizations:
 * - Clear value hierarchy
 * - Featured tier emphasis
 * - Mobile-responsive cards
 * - Accessible pricing toggle
 */

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Shield } from 'lucide-react';

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: 'Starter',
      badge: 'Free Forever',
      badgeColor: 'bg-gray-800',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for testing ideas and learning',
      features: [
        '1 app deployment',
        '100K AI tokens/month',
        'Cloudflare Workers deployment',
        'D1 Database (1GB)',
        'Community support',
        'Open source - fork anytime',
        'Shared AI pool',
      ],
      cta: 'Start Building Free',
      highlighted: false,
    },
    {
      name: 'Builder',
      badge: 'Most Popular',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      price: { monthly: 49, annual: 39 },
      description: 'For serious builders earning their first $1K MRR',
      features: [
        '5 app deployments',
        '1M AI tokens/month',
        'Custom domains',
        'D1 Database (10GB)',
        'R2 Storage (10GB)',
        'Durable Objects',
        'Priority AI models',
        'Email support',
        'Multi-LLM fallback chains',
        'Advanced analytics',
      ],
      cta: 'Start 14-Day Trial',
      highlighted: true,
    },
    {
      name: 'Pro',
      badge: 'Scale to $10K MRR',
      badgeColor: 'bg-gray-800',
      price: { monthly: 149, annual: 119 },
      description: 'For entrepreneurs scaling multiple revenue streams',
      features: [
        'Unlimited apps',
        '5M AI tokens/month',
        'Custom domains unlimited',
        'D1 Database (100GB)',
        'R2 Storage (100GB)',
        'Durable Objects unlimited',
        'Priority support (4hr response)',
        'White-label options',
        'GPT-4, Claude, Gemini Pro',
        'Custom model endpoints',
        'API access',
        'Advanced security',
      ],
      cta: 'Start 14-Day Trial',
      highlighted: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 lg:py-28 px-4 bg-bg-primary"
      aria-labelledby="pricing-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            id="pricing-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4"
          >
            Pricing That Scales With Your Success
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Start free. Pay only when you earn. No hidden fees. No vendor lock-in.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-center gap-4 mb-12"
          role="radiogroup"
          aria-label="Billing period"
        >
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !isAnnual
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-quaternary'
            }`}
            role="radio"
            aria-checked={!isAnnual}
            aria-label="Monthly billing"
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              isAnnual
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-quaternary'
            }`}
            role="radio"
            aria-checked={isAnnual}
            aria-label="Annual billing, save 20%"
          >
            <span>Annual</span>
            <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
              Save 20%
            </span>
          </button>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className={`relative bg-bg-quaternary border-2 rounded-2xl p-8 transition-all ${
                tier.highlighted
                  ? 'border-blue-600 shadow-2xl lg:scale-105 lg:-my-4'
                  : 'border-border hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {/* Badge */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 ${tier.badgeColor} text-white text-xs font-bold uppercase tracking-wide rounded-full`}
              >
                {tier.badge}
              </div>

              {/* Tier Name */}
              <h3 className="text-2xl font-bold text-text-primary mt-4 mb-2">{tier.name}</h3>

              {/* Price */}
              <div className="flex items-baseline mb-2">
                <span className="text-2xl font-bold text-text-secondary">$</span>
                <span className="text-5xl font-extrabold text-text-primary">
                  {isAnnual ? tier.price.annual : tier.price.monthly}
                </span>
                <span className="text-lg text-text-secondary ml-2">/month</span>
              </div>

              {/* Description */}
              <p className="text-text-secondary mb-6 min-h-[48px]">{tier.description}</p>

              {/* Features */}
              <ul
                className="space-y-3 mb-8"
                aria-label={`${tier.name} plan features`}
              >
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#cta"
                className={`block w-full py-3 text-center font-bold rounded-lg transition-all ${
                  tier.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-bg-tertiary border-2 border-border text-text-primary hover:bg-bg-secondary hover:border-blue-500/50'
                }`}
                aria-label={`${tier.cta} for ${tier.name} plan`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-bg-secondary border border-border rounded-2xl max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center p-4 bg-blue-600/10 rounded-full" aria-hidden="true">
            <Shield size={32} className="text-blue-600" />
          </div>
          <div className="text-center sm:text-left">
            <div className="font-bold text-text-primary mb-1">60-Day Money-Back Guarantee</div>
            <div className="text-sm text-text-secondary">
              If you don't launch a profitable app in 60 days, we'll refund every penny. No
              questions asked.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
