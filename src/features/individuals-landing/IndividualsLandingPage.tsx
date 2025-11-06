/**
 * Individuals Landing Page - Dreamforge
 * Target Audience: Aspiring entrepreneurs, developers, indie makers
 * Conversion Goal: Sign up for free account → Upgrade to paid plan
 *
 * 2025 Optimizations Applied:
 * - Dark mode ready with Gold (#FFD700) & Bronze (#5D4E37) brand colors
 * - WCAG AAA accessibility with full ARIA labels
 * - 280px mobile support (Galaxy Fold)
 * - Framer Motion 60fps animations
 * - Single CTA per section pattern
 * - Skip navigation for keyboard users
 */

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';
import StakesSection from './components/StakesSection';
import ValueSection from './components/ValueSection';
import GuideSection from './components/GuideSection';
import PlanSection from './components/PlanSection';
import PricingSection from './components/PricingSection';
import SuccessSection from './components/SuccessSection';
import LeadGenSection from './components/LeadGenSection';
import FaqSection from './components/FaqSection';
import FinalCtaSection from './components/FinalCtaSection';
import FooterSection from './components/FooterSection';

export default function IndividualsLandingPage() {
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Dreamforge - Build & Monetize Apps That Generate Recurring Income</title>
        <meta
          name="description"
          content="Stop watching AI take jobs. Start building apps that pay you monthly. Open-source, production-ready, multi-LLM AI builder for aspiring entrepreneurs."
        />
        <meta name="keywords" content="AI app builder, no-code, SaaS, passive income, Cloudflare, open source" />
        <meta property="og:title" content="Dreamforge - Build Apps That Pay You" />
        <meta property="og:description" content="Turn your ideas into profitable SaaS apps in hours, not months." />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-accent focus:text-bg-primary focus:rounded-lg focus:shadow-lg focus:font-semibold"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-bg-primary">
        <NavigationBar />

        <main id="main-content" role="main">
          <HeroSection />
          <StakesSection />
          <ValueSection />
          <GuideSection />
          <PlanSection />
          <PricingSection />
          <SuccessSection />
          <LeadGenSection />
          <FaqSection />
          <FinalCtaSection />
        </main>

        <FooterSection />
      </div>
    </>
  );
}
