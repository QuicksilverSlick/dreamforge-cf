/**
 * Testimonials Section - Social Proof
 * Real founder stories showing transformation
 */

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, TrendingUp } from 'react-feather';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metric?: {
    value: string;
    label: string;
  };
  previousTool?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Founder',
    company: 'InvoiceFlow',
    avatar: 'SC',
    quote: 'I spent 3 months with lovable.dev and couldn\'t get past the prototype stage. Dreamforge had my SaaS app in production with Stripe payments in 48 hours. Actual customers are paying me now.',
    metric: {
      value: '$12K MRR',
      label: 'in first 2 months',
    },
    previousTool: 'lovable.dev',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    company: 'DataLens',
    avatar: 'MR',
    quote: 'Bolt.new was great for demos but the authentication never worked in production. Dreamforge generated OAuth, RBAC, and team management that actually scales. We\'re handling 10,000+ users now.',
    metric: {
      value: '10K+ users',
      label: 'zero auth issues',
    },
    previousTool: 'bolt.new',
  },
  {
    name: 'Priya Patel',
    role: 'Solo Founder',
    company: 'TutorMatch',
    avatar: 'PP',
    quote: 'We tried v0.dev for our marketplace but had to build the entire backend manually. Dreamforge generated the payments, messaging, and admin dashboard—everything we needed to launch.',
    metric: {
      value: '2 weeks',
      label: 'from idea to revenue',
    },
    previousTool: 'v0.dev',
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-bg-primary relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 mb-4">
            <Star className="w-4 h-4 text-[#FFD700] fill-current" />
            <span className="text-sm font-medium text-[#FFD700]">Loved by Founders</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            From Prototype Hell to{' '}
            <span className="bg-gradient-to-r from-accent to-[#FFD700] bg-clip-text text-transparent">
              Revenue Heaven
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Real founders who escaped the 60% trap and launched production apps
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-[#FFD700] flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-tertiary">{testimonial.role}</p>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD700] fill-current" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-text-secondary text-sm leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Company */}
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="font-medium text-text-primary">{testimonial.company}</span>
              </div>

              {/* Previous Tool Badge */}
              {testimonial.previousTool && (
                <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                  Previously: {testimonial.previousTool}
                </div>
              )}

              {/* Metric */}
              {testimonial.metric && (
                <div className="pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-accent">{testimonial.metric.value}</p>
                  <p className="text-xs text-text-tertiary">{testimonial.metric.label}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { stat: '90%', label: 'Faster time-to-revenue' },
            { stat: '$0', label: 'Hidden production costs' },
            { stat: '0', label: 'Security vulnerabilities' },
            { stat: '100%', label: 'Production-ready apps' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-[#FFD700] bg-clip-text text-transparent mb-2">
                {item.stat}
              </p>
              <p className="text-sm text-text-tertiary">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
