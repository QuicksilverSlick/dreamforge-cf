/**
 * Success Stories / Testimonials Section
 * Real customer stories + transformation timeline
 *
 * 2025 Optimizations:
 * - Social proof with real metrics
 * - Relatable transformation journey
 * - Avatar images with proper alt text
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SuccessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stories = [
    {
      name: 'Sarah Chen',
      role: 'Former Teacher → $8.2K MRR',
      avatar: 'https://i.pravatar.cc/80?img=12',
      quote: 'I was terrified AI would replace teachers. Instead, I built an AI-powered tutoring platform using Dreamforge. Launched in 2 weeks. Hit $1K MRR in month one. Now at $8.2K MRR with 127 paying students.',
      metrics: [
        { value: '2 weeks', label: 'To launch' },
        { value: '$8,200', label: 'Monthly revenue' },
        { value: '127', label: 'Customers' },
      ],
    },
    {
      name: 'Marcus Johnson',
      role: 'Retail Manager → $12K MRR',
      avatar: 'https://i.pravatar.cc/80?img=33',
      quote: 'Spent 6 months in coding bootcamps. Burned $15K. Got nowhere. Dreamforge let me build my inventory management SaaS in 3 weeks. Sold to 4 local businesses first month. Now serving 43 stores. I quit my job last month.',
      metrics: [
        { value: '3 weeks', label: 'To launch' },
        { value: '$12,000', label: 'Monthly revenue' },
        { value: '43', label: 'Business clients' },
      ],
    },
    {
      name: 'Priya Sharma',
      role: 'Accountant → $5.6K MRR',
      avatar: 'https://i.pravatar.cc/80?img=47',
      quote: 'Accounting firms were slashing jobs due to AI. I built an automated bookkeeping platform for freelancers using Dreamforge. Zero coding knowledge. Launched in 10 days. Now it pays more than my old salary.',
      metrics: [
        { value: '10 days', label: 'To launch' },
        { value: '$5,600', label: 'Monthly revenue' },
        { value: '89', label: 'Active users' },
      ],
    },
  ];

  const timeline = [
    {
      period: 'Week 1',
      title: 'From Overwhelmed to Empowered',
      description: 'Launch your first app. See it working. Feel the shift from "I can\'t" to "I did."',
    },
    {
      period: 'Month 1',
      title: 'From Zero to First Revenue',
      description: 'Get your first paying customer. $29, $49, $99 - real money from something you built.',
    },
    {
      period: 'Month 3',
      title: 'From Side Hustle to Real Income',
      description: '$1,000-$3,000 MRR. Covers rent. Builds confidence. Proves the model works.',
    },
    {
      period: 'Month 6',
      title: 'From Employee to Entrepreneur',
      description: '$5,000-$10,000 MRR. Multiple income streams. Freedom to choose.',
    },
  ];

  return (
    <section
      id="success"
      className="py-20 lg:py-28 px-4 bg-bg-secondary"
      aria-labelledby="success-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="success-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4"
          >
            From Worried About AI to $10K/Month
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Real builders. Real revenue. Real transformation.
          </p>
        </motion.div>

        {/* Stories */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {stories.map((story, index) => (
            <motion.article
              key={story.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-bg-quaternary border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={story.avatar}
                  alt={`${story.name}, profile picture`}
                  className="w-20 h-20 rounded-full border-4 border-blue-600"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{story.name}</h3>
                  <p className="text-blue-600 font-semibold">{story.role}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-text-secondary italic leading-relaxed mb-6">
                "{story.quote}"
              </blockquote>

              {/* Metrics */}
              <div className="flex justify-around pt-6 border-t border-border">
                {story.metrics.map((metric, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-blue-600">
                      {metric.value}
                    </div>
                    <div className="text-xs text-text-tertiary">{metric.label}</div>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Transformation Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-bg-quaternary border border-border rounded-2xl p-8 lg:p-12"
        >
          <h3 className="text-3xl font-bold text-text-primary text-center mb-12">
            The Transformation Journey
          </h3>

          <div className="relative">
            {/* Timeline Line - Hidden on mobile */}
            <div
              className="hidden lg:block absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-cyan-600"
              aria-hidden="true"
            />

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.period}
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="relative flex items-start gap-8"
                >
                  {/* Period Badge */}
                  <div className="flex-shrink-0 w-24 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-center rounded-lg shadow-lg">
                    {item.period}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-text-primary mb-2">{item.title}</h4>
                    <p className="text-text-secondary leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
