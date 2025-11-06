/**
 * FAQ Section Component
 * Common questions and answers
 *
 * 2025 Optimizations:
 * - Expandable accordion (future enhancement)
 * - Clear, direct answers
 * - Mobile-friendly layout
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const faqs = [
    {
      question: 'Do I need coding experience?',
      answer: 'No. Dreamforge uses natural language prompts. Describe what you want to build, and AI handles the code. That said, understanding basic web concepts helps you iterate faster - but it\'s not required to launch.',
    },
    {
      question: 'How is this different from Lovable or Bolt.new?',
      answer: 'Three critical differences: (1) We\'re 100% open source - you own your code forever. (2) We support 10+ AI models with fallback chains - you\'re not locked to one vendor. (3) We deploy to Cloudflare\'s production infrastructure, not toy sandboxes. Real apps. Real scale. Real ownership.',
    },
    {
      question: 'Can I really make $1K/month from this?',
      answer: 'If you find 20 customers willing to pay $49/month, yes. That\'s $980 MRR. The hard part isn\'t building the app (Dreamforge handles that). The hard part is finding customers who need what you built. That\'s why our guide teaches micro-niche validation before you build.',
    },
    {
      question: 'What if I want to hire developers later?',
      answer: 'Perfect. Dreamforge generates clean, standard React + Cloudflare Workers code. Any developer can read it, modify it, scale it. We\'re not a black box. Start solo, hire when revenue justifies it.',
    },
    {
      question: 'How much does Cloudflare hosting cost?',
      answer: 'Cloudflare Workers starts at $5/month for 10M requests. D1 database is $5/month for 25GB. For most apps under 1,000 users, you\'re looking at $10-20/month hosting. Scales automatically as you grow.',
    },
    {
      question: 'What if AI generates broken code?',
      answer: 'Dreamforge uses 12-phase generation with automated code review cycles. We test, fix, and validate before deployment. Plus, we support 10+ AI models - if one struggles, we seamlessly switch to another. 99.9% reliability.',
    },
    {
      question: 'Can I white-label apps for clients?',
      answer: 'Yes (Pro plan). Remove all Dreamforge branding. Deploy to your client\'s domain. They never know you used AI. Many agencies use Dreamforge to 10x their output.',
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: '60 days. If you don\'t launch a profitable app using Dreamforge, email us. We\'ll refund every penny. We\'re betting on your success.',
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 lg:py-28 px-4 bg-bg-secondary"
      aria-labelledby="faq-title"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="faq-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4"
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
              className="bg-bg-quaternary border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-text-primary mb-4">{faq.question}</h3>
              <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
