/**
 * Pricing Section - Platform Subscriptions
 * Platform pricing with business training included (hybrid positioning)
 */

import { Check, ArrowRight, Code, Users, Star } from 'react-feather';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  icon: typeof Code;
  monthlyPrice: number;
  seats: string;
  additionalSeatCost: string;
  features: string[];
  trainingDetails: {
    level: string;
    duration: string;
    format: string;
    platform: string;
  };
  cta: string;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Production-ready platform access',
    icon: Code,
    monthlyPrice: 97,
    seats: '1 developer seat',
    additionalSeatCost: '+$40/seat',
    features: [
      'Phase-wise AI app generation (6-12 phases)',
      'Production deployment to Cloudflare Workers',
      'Automatic error recovery (6+ TypeScript fixers)',
      'Real D1 database integration',
      'Self-hostable on your Cloudflare account',
      'Multi-LLM support (Gemini, GPT, Claude)',
      'Community support',
      'Code export & GitHub integration',
    ],
    trainingDetails: {
      level: 'Platform Only',
      duration: 'Self-paced',
      format: 'Documentation',
      platform: 'Full platform access',
    },
    cta: 'Start Building',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Platform + Business Training',
    icon: Users,
    monthlyPrice: 297,
    seats: 'Up to 3 team seats',
    additionalSeatCost: '+$40/seat',
    popular: true,
    features: [
      'Everything in Starter',
      'Live weekly business training (1 hour/week)',
      'Go-to-market strategy & customer discovery',
      'Revenue model validation & scaling fundamentals',
      'AI vs Automation decision frameworks',
      'Founder Q&A sessions',
      'Priority support',
      'Training materials & resources',
    ],
    trainingDetails: {
      level: 'Business Foundations',
      duration: '1 hour/week live',
      format: 'Live Zoom + recordings',
      platform: 'Full platform + training',
    },
    cta: 'Get Platform + Training',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Platform + Advanced Training + Support',
    icon: Star,
    monthlyPrice: 997,
    seats: 'Up to 12 team seats',
    additionalSeatCost: '+$40/seat',
    features: [
      'Everything in Professional',
      'Advanced business strategy training',
      'One-on-one founder coaching sessions',
      'Custom curriculum for your business needs',
      'Dedicated success manager',
      'White-label deployment options',
      'Priority feature requests',
      'SLA guarantees & uptime monitoring',
      'Investor pitch preparation support',
    ],
    trainingDetails: {
      level: 'Advanced + Coaching',
      duration: '1 hour/week + 1-on-1',
      format: 'Live + private coaching',
      platform: 'Enterprise platform + concierge',
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
            <span className="text-sm font-medium text-accent">Platform + Training · Start Free Trial</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            Choose Your Plan
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Production-ready platform access starting at $97/mo. Add <span className="font-bold text-accent">business training</span> (Professional and above) to get go-to-market strategy and founder coaching—something Lovable, v0, and Bolt don't offer.
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
                    <div className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                      {tier.trainingDetails.level}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">{tier.name}</h3>
                    <p className="text-sm text-text-tertiary mt-1">{tier.tagline}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-end gap-3">
                      <div>
                        <span className="text-5xl font-bold text-text-primary">${tier.monthlyPrice}</span>
                        <span className="text-text-tertiary ml-2">/month</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-secondary">{tier.seats}</span>
                      <span className="text-xs text-text-tertiary">· {tier.additionalSeatCost} additional</span>
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

                  {/* Training Details */}
                  <div className="pt-4 space-y-2 border-t border-border/50">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">Training Details</p>
                    <div className="space-y-1 text-xs text-text-tertiary">
                      <p>• {tier.trainingDetails.duration} live sessions</p>
                      <p>• {tier.trainingDetails.format} classroom format</p>
                      <p>• {tier.seats} included</p>
                      <p>• {tier.trainingDetails.platform}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Training Success Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-accent/10 via-[#FFD700]/10 to-accent/10 border border-accent/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Production & Business Success Guarantee</h3>
                <p className="text-sm text-text-tertiary">Platform reliability + business growth support</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              All plans include production deployment guarantees. Professional and Enterprise plans include our <span className="font-semibold text-text-primary">Business Success Guarantee</span>: if you don't see measurable progress in business understanding within 30 days, we'll provide one-on-one coaching and refund the training premium.
            </p>
            <div className="flex items-center gap-2 text-sm text-accent">
              <Check className="w-4 h-4" />
              <span className="font-medium">30-day guarantee · Dedicated support · Cancel anytime · No setup fees</span>
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
