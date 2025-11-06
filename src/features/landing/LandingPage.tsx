/**
 * Main Landing Page
 * Assembles all sections into a conversion-optimized page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/auth-context';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showExitIntent, setShowExitIntent] = useState(false);

  // Handle CTA clicks
  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Already logged in, go straight to app
      navigate('/');
    } else {
      // Not logged in, scroll to pricing or show auth modal
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    if (isAuthenticated) {
      // Go to checkout with selected plan
      navigate(`/checkout?plan=${planId}`);
    } else {
      // Show auth modal first, then redirect to checkout
      // For now, navigate to a signup page with plan parameter
      navigate(`/signup?plan=${planId}`);
    }
  };

  // Exit-intent popup (conversion optimization)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent && !isAuthenticated) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitIntent, isAuthenticated]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <HeroSection onGetStarted={handleGetStarted} isAuthenticated={isAuthenticated} />
      <ProblemSection />
      <SolutionSection onGetStarted={handleGetStarted} />
      <TestimonialsSection />
      <PricingSection onSelectPlan={handleSelectPlan} />
      <Footer />

      {/* Exit Intent Modal (simple version) */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-tertiary border border-accent/30 rounded-2xl p-8 max-w-md space-y-4 relative">
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-text-primary">Wait! Before You Go...</h3>
            <p className="text-text-secondary">
              73% of AI-built startups fail to scale. Don't become a statistic.
            </p>
            <p className="text-text-primary font-semibold">
              Lock in your <span className="text-accent">lifetime 41% discount</span> while BETA spots last.
            </p>
            <button
              onClick={() => {
                setShowExitIntent(false);
                handleGetStarted();
              }}
              className="w-full bg-gradient-to-r from-accent to-[#FFD700] text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Claim My BETA Spot Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
