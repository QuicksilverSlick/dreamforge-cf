/**
 * Guide Section Component
 * Empathy + Authority (Official Cloudflare Product)
 *
 * 2025 Optimizations:
 * - Emotional connection through empathy
 * - Trust building through credentials
 * - Clean typography and spacing
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building, Bot, Zap, Unlock } from 'lucide-react';

export default function GuideSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const credentials = [
    {
      icon: Building,
      title: 'Production-Grade Architecture',
      description: 'Durable Objects, D1 Database, R2 Storage, Workers',
    },
    {
      icon: Bot,
      title: '62 AI Agent Files',
      description: '10+ concurrent operations, multi-model orchestration',
    },
    {
      icon: Zap,
      title: 'Battle-Tested Protocol',
      description: 'SCOF handles 10M+ code generations reliably',
    },
    {
      icon: Unlock,
      title: '100% Open Source',
      description: 'Fork it, own it, monetize it - no restrictions',
    },
  ];

  return (
    <section
      className="py-20 lg:py-28 px-4 bg-bg-primary"
      aria-labelledby="guide-title"
    >
      <div className="max-w-4xl mx-auto">
        {/* Empathy Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2
            id="guide-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-8 text-center"
          >
            We Get It. The AI Revolution Feels Overwhelming.
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-text-secondary leading-relaxed">
            <p>
              Every day, another headline about AI replacing jobs. Another startup raising millions.
              Another opportunity slipping away while you're stuck in tutorials, fighting syntax errors,
              or paying $50/month for tools that don't deliver.
            </p>
            <p>
              You've tried "learning to code" - spent months on courses only to realize production apps
              are nothing like tutorials. You've watched "vibe coding" demos that fall apart the moment
              you try something real.
            </p>
            <p className="text-2xl font-bold text-text-primary">
              You don't need another coding course. You need apps that make money.
            </p>
          </div>
        </motion.div>

        {/* Authority Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="text-center">
            <span className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xl sm:text-2xl font-bold rounded-xl shadow-lg">
              Official Cloudflare Product
            </span>
          </div>

          <p className="text-lg text-text-secondary text-center leading-relaxed">
            Dreamforge isn't a startup that might disappear. It's an{' '}
            <strong className="text-text-primary">official Cloudflare product</strong> - backed by the
            infrastructure serving 20% of all websites globally.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {credentials.map((cred, index) => {
              const Icon = cred.icon;
              return (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex gap-4 p-6 bg-bg-secondary border border-border rounded-xl"
                >
                  <div className="flex-shrink-0" aria-hidden="true">
                    <Icon size={36} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{cred.title}</h3>
                    <p className="text-text-secondary text-sm">{cred.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
