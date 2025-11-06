/**
 * Lead Generator Section
 * Free guide email capture
 *
 * 2025 Optimizations:
 * - Clear value proposition
 * - Minimal form friction
 * - Privacy assurance
 * - Accessible form with labels
 */

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download, Check } from 'lucide-react';

export default function LeadGenSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const includes = [
    '7 SaaS ideas you can build this weekend',
    'The "Micro-Niche" strategy: $1K MRR with 20 customers',
    'Pricing psychology: Why $49/month beats $9/month',
    'The 5-email launch sequence (copy-paste templates)',
    'How to get your first 10 customers without ads',
    'Dreamforge quickstart: Launch in 48 hours',
  ];

  return (
    <section
      id="lead-gen"
      className="py-20 lg:py-28 px-4 bg-bg-primary"
      aria-labelledby="lead-gen-title"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: E-book Mockup */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40, rotateY: -15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: -15 } : {}}
            transition={{ duration: 0.8 }}
            className="relative perspective-1000"
            style={{ perspective: '1000px' }}
          >
            <div
              className="bg-gradient-to-br from-blue-600 to-cyan-600 p-12 rounded-2xl shadow-2xl text-white text-center"
              style={{ transform: 'rotateY(-15deg)' }}
              role="img"
              aria-label="Free guide: The Vibe Coder's Playbook - From Zero to $1K MRR in 30 Days"
            >
              <div className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                THE VIBE CODER'S
                <br />
                PLAYBOOK
              </div>
              <div className="text-xl sm:text-2xl mb-6 opacity-90">
                From Zero to $1K MRR
                <br />
                in 30 Days
              </div>
              <div className="inline-block px-6 py-2 bg-white text-blue-600 font-extrabold rounded-lg text-sm">
                FREE GUIDE
              </div>
            </div>
          </motion.div>

          {/* Right: Content & Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2
              id="lead-gen-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary"
            >
              Get The Free Guide: Your First $1K MRR in 30 Days
            </h2>

            <p className="text-lg text-text-secondary leading-relaxed">
              The exact playbook used by 200+ builders to launch profitable apps. No fluff. Just
              the tactics that work.
            </p>

            {/* Includes List */}
            <ul
              className="space-y-3"
              aria-label="What's included in the free guide"
            >
              {includes.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={20} className="text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-email" className="sr-only">
                  Email address
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 bg-bg-quaternary border-2 border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-50"
                    aria-label="Email address for free guide download"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label="Download free guide"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : isSubmitted ? (
                      <span className="flex items-center gap-2">
                        <Check size={20} aria-hidden="true" />
                        Check Your Email!
                      </span>
                    ) : (
                      <>
                        <Download size={20} aria-hidden="true" />
                        <span>Download Free Guide</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-text-tertiary text-center">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
