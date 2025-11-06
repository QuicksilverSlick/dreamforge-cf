/**
 * Pricing Section - BETA Offer
 * Conversion-optimized pricing with lifetime early adopter discount
 */

import { Check, ArrowRight, Zap, Star, Shield } from 'react-feather';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  icon: typeof Zap;
  originalPrice: number;
  betaPrice: number;
  discount: string;
  lifetimeGuarantee: boolean;
  features: string[];
  limits: {
    projects: string;
    deployments: string;
    storage: string;
    support: string;
  };
  cta: string;
  popular?: boolean;
  priceId?: string; // Stripe Price ID
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'indie',
    name: 'Indie Maker',
    tagline: 'For solo founders building their first SaaS',
    icon: Zap,
    originalPrice: 49,
    betaPrice: 29,
    discount: '41% OFF',
    lifetimeGuarantee: true,
    features: [
      'Production-ready code generation',
      'Stripe payments integration',
      'OAuth + Email authentication',
      'Cloudflare Workers deployment',
      'D1 database (unlimited)',
      'Automated security scanning',
      'Email support (24h response)',
      'Export to GitHub',
    ],
    limits: {
      projects: '5 active projects',
      deployments: 'Unlimited deploys',
      storage: '10GB R2 storage',
      support: '24h email support',
    },
    cta: 'Start Building',
  },
  {
    id: 'startup',
    name: 'Startup',
    tagline: 'For small teams shipping fast',
    icon: Star,
    originalPrice: 99,
    betaPrice: 59,
    discount: '40% OFF',
    lifetimeGuarantee: true,
    popular: true,
    features: [
      'Everything in Indie Maker',
      'Team collaboration (5 members)',
      'Advanced RBAC & permissions',
      'Multi-tenancy architecture',
      'Priority deployment queue',
      'Advanced monitoring & analytics',
      'Priority support (4h response)',
      'Custom domain SSL',
      'SOC2-ready infrastructure',
    ],
    limits: {
      projects: '20 active projects',
      deployments: 'Unlimited deploys',
      storage: '100GB R2 storage',
      support: '4h priority support',
    },
    cta: 'Start Free Trial',
  },
  {
    id: 'agency',
    name: 'Agency',
    tagline: 'For agencies & enterprises',
    icon: Shield,
    originalPrice: 299,
    betaPrice: 199,
    discount: '33% OFF',
    lifetimeGuarantee: true,
    features: [
      'Everything in Startup',
      'Unlimited team members',
      'White-label deployments',
      'Custom AI model fine-tuning',
      'Dedicated support engineer',
      'SLA guarantees (99.9%)',
      'Custom compliance (HIPAA, PCI-DSS)',
      'Advanced security features',
      'On-premise deployment option',
    ],
    limits: {
      projects: 'Unlimited projects',
      deployments: 'Unlimited deploys',
      storage: '1TB R2 storage',
      support: '1h dedicated support',
    },
    cta: 'Contact Sales',
  },
];

interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="pricing" ref={ref} className="py-24 bg-bg-secondary relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-sm font-medium text-accent">BETA Launch Pricing · Limited Time</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            Early Adopter Pricing
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Lock in up to <span className="font-bold text-accent">41% lifetime discount</span> as a founding member.
            Price increases to regular rates when we exit BETA.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <Check className="w-4 h-4 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <Check className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <Check className="w-4 h-4 text-green-500" />
              <span>No setup fees</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PRICING_TIERS.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-bg-tertiary border rounded-2xl p-8 space-y-6 hover:shadow-2xl transition-all duration-300 ${
                  tier.popular
                    ? 'border-accent shadow-lg scale-105 ring-2 ring-accent/50'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent to-[#FFD700] text-white text-xs font-semibold shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                {/* Tier Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${tier.popular ? 'bg-accent/20' : 'bg-bg-quaternary'} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${tier.popular ? 'text-accent' : 'text-text-tertiary'}`} />
                    </div>
                    {tier.lifetimeGuarantee && (
                      <div className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                        {tier.discount}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">{tier.name}</h3>
                    <p className="text-sm text-text-tertiary mt-1">{tier.tagline}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-end gap-3">
                      <div>
                        <span className="text-5xl font-bold text-text-primary">${tier.betaPrice}</span>
                        <span className="text-text-tertiary ml-2">/month</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-tertiary line-through">${tier.originalPrice}/mo</span>
                      {tier.lifetimeGuarantee && (
                        <span className="text-xs text-accent font-medium">· Locked forever</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  size="lg"
                  onClick={() => onSelectPlan(tier.id)}
                  className={`w-full ${
                    tier.popular
                      ? 'bg-gradient-to-r from-accent to-[#FFD700] hover:shadow-lg hover:shadow-accent/50 text-white'
                      : 'bg-bg-quaternary hover:bg-bg-quaternary/80 text-text-primary border border-border'
                  } font-semibold transition-all duration-300 rounded-xl`}
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                {/* Features List */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limits */}
                  <div className="pt-4 space-y-2 border-t border-border/50">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">Limits</p>
                    <div className="space-y-1 text-xs text-text-tertiary">
                      <p>• {tier.limits.projects}</p>
                      <p>• {tier.limits.deployments}</p>
                      <p>• {tier.limits.storage}</p>
                      <p>• {tier.limits.support}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lifetime Lock Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-accent/10 via-[#FFD700]/10 to-accent/10 border border-accent/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Lifetime Price Lock Guarantee</h3>
                <p className="text-sm text-text-tertiary">For BETA early adopters only</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Sign up during BETA and your pricing is <span className="font-semibold text-text-primary">locked forever</span>.
              When we increase prices after launch (estimated $49/$99/$299), you keep your founding member rate.
              This is our way of thanking early believers who help us build the future of AI coding.
            </p>
            <div className="flex items-center gap-2 text-sm text-accent">
              <Check className="w-4 h-4" />
              <span className="font-medium">Valid for life of your subscription · No hidden price increases</span>
            </div>
          </div>
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-text-tertiary text-sm">
            Questions about pricing?{' '}
            <button className="text-accent hover:underline font-medium">View FAQ</button>
            {' '}or{' '}
            <button className="text-accent hover:underline font-medium">Contact Sales</button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
