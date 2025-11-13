/**
 * Solution Section - Dreamforge Platform + Training as the Guide
 * Shows empathy + competency with superior platform AND business training
 */

import { CheckCircle, BookOpen, Video, Users, Target, Award, Zap, Code, Layers, Shield, Database, GitBranch, Cloud } from 'react-feather';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

const PLATFORM_FEATURES = [
  {
    icon: Layers,
    title: 'Phase-Wise Generation',
    description: '6-12 intelligent phases with 10+ review cycles each',
    stat: 'Smart',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: Cloud,
    title: 'Production Deployment',
    description: 'Deploy to Cloudflare Workers, not preview URLs',
    stat: 'Live',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
  {
    icon: GitBranch,
    title: 'Automatic Error Recovery',
    description: '6+ TypeScript-specific fixers, not manual debugging',
    stat: '6+ Fixers',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  {
    icon: Database,
    title: 'Real Database Integration',
    description: 'Integrated D1 schema, not third-party dependencies',
    stat: 'Built-in',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: Shield,
    title: 'Security-First Code',
    description: 'Automated security checks, zero vulnerabilities',
    stat: '0% Risk',
    color: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-500',
  },
  {
    icon: Code,
    title: 'Self-Hostable',
    description: 'Deploy to your Cloudflare account, no vendor lock-in',
    stat: 'Yours',
    color: 'from-accent/20 to-[#FFD700]/20',
    iconColor: 'text-accent',
  },
];

const TRAINING_FEATURES = [
  {
    icon: Video,
    title: 'Live Business Training',
    description: 'Weekly Zoom sessions on strategy, not just tech',
    stat: 'Weekly',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
  {
    icon: Target,
    title: 'Go-to-Market Strategy',
    description: 'Learn customer discovery, revenue models, scaling',
    stat: '0/10 Gap',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Founder Coaching',
    description: 'One-on-one support, not just documentation',
    stat: '1-on-1',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  {
    icon: Award,
    title: 'Progressive Curriculum',
    description: 'Beginner to Advanced, tailored to your stage',
    stat: '3 Levels',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: Zap,
    title: 'AI & Automation Mastery',
    description: 'Learn WHEN to use AI, not just HOW',
    stat: 'Smart',
    color: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-yellow-500',
  },
  {
    icon: BookOpen,
    title: 'Human-First Principles',
    description: 'Technology amplifies people, never replaces them',
    stat: '100%',
    color: 'from-accent/20 to-[#FFD700]/20',
    iconColor: 'text-accent',
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
        {/* Empathy + Authority (The Guide) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <span className="text-sm font-medium text-accent">We've Seen This Before</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            We Know Exactly{' '}
            <span className="bg-gradient-to-r from-accent to-[#FFD700] bg-clip-text text-transparent">
              Where You Are
            </span>
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">We've watched hundreds of founders hit the same wall</span>: beautiful prototypes from Lovable/v0/Bolt that crumble the moment real customers try to sign up or pay. We've seen the $68K-$132K surprise invoices to "finish" what should've worked. We've felt the paralysis of not knowing who to trust or what decision to make next.
          </p>
          <p className="text-lg text-text-primary font-semibold">
            We built Dreamforge because we believe you deserve better than bait-and-switch platforms. You deserve production-ready apps from day one AND strategic training so you never make business-ending mistakes with AI.
          </p>
        </motion.div>

        {/* Part 1: Superior Platform */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Part 1: We Finish What They Started</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary">
              From 60-70% Prototype to 100% Revenue-Generating Business
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Production deployment that actually works. Real Stripe payments. Secure authentication. Database architecture for real users. <span className="font-semibold text-text-primary">No $68K-$132K surprise invoices.</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLATFORM_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group relative bg-bg-tertiary border border-border rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
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
                      <h4 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h4>
                      <p className="text-sm text-text-secondary">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Business Training */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Part 2: We Teach You What No One Else Will</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary">
              Strategic Training: "Should I Even Use AI for This?"
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              The customized personal training that teaches you <span className="font-semibold text-text-primary">when to use AI, when to use traditional automation, and how to protect yourself from business-ending mistakes</span>. Every competitor scores 0/10 here. We built Dreamforge to fill this gap.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TRAINING_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group relative bg-bg-tertiary border border-border rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
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
                      <h4 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h4>
                      <p className="text-sm text-text-secondary">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              <p className="text-lg font-semibold text-text-primary">The Dreamforge Promise</p>
            </div>
            <p className="text-sm text-text-secondary max-w-2xl">
              We finish what other platforms started—and teach you how to build a sustainable business, not just code. If you don't see measurable progress toward revenue within 30 days, we'll provide one-on-one coaching and refund your subscription. No questions asked.
            </p>
          </div>

          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-to-r from-accent to-[#FFD700] hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 text-white font-semibold text-lg px-8 py-6 rounded-xl"
          >
            Finish What You Started
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
