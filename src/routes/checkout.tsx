/**
 * Checkout Page - Stripe Integration
 * Creates Stripe Checkout session and redirects to hosted page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Shield, CreditCard, Lock } from 'react-feather';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PLAN_DETAILS = {
  indie: {
    name: 'Indie Maker',
    price: 29,
    originalPrice: 49,
    interval: 'month',
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_INDIE || 'price_indie_beta',
    features: [
      '5 active projects',
      'Unlimited deploys',
      'Stripe payments integration',
      'OAuth + Email authentication',
      '10GB R2 storage',
      'Email support (24h)',
    ],
  },
  startup: {
    name: 'Startup',
    price: 59,
    originalPrice: 99,
    interval: 'month',
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_STARTUP || 'price_startup_beta',
    features: [
      '20 active projects',
      'Team collaboration (5 members)',
      'Advanced RBAC',
      'Multi-tenancy architecture',
      '100GB R2 storage',
      'Priority support (4h)',
    ],
  },
  agency: {
    name: 'Agency',
    price: 199,
    originalPrice: 299,
    interval: 'month',
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_AGENCY || 'price_agency_beta',
    features: [
      'Unlimited projects',
      'Unlimited team members',
      'White-label deployments',
      'Custom AI model fine-tuning',
      '1TB R2 storage',
      'Dedicated support (1h)',
    ],
  },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<string>(searchParams.get('plan') || 'indie');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/signup?plan=${selectedPlan}`);
    }
  }, [isAuthenticated, selectedPlan, navigate]);

  const planDetails = PLAN_DETAILS[selectedPlan as keyof typeof PLAN_DETAILS];
  const discount = Math.round(((planDetails.originalPrice - planDetails.price) / planDetails.originalPrice) * 100);

  const handleCheckout = async () => {
    setIsCreatingSession(true);
    setError(null);

    try {
      // Call API to create Stripe Checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planDetails.stripePriceId,
          plan: selectedPlan,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout?plan=${selectedPlan}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json() as { url?: string };

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to initialize checkout. Please try again.');
      setIsCreatingSession(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Plan Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">Logged in as {user?.email}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Complete Your Order</h1>
              <p className="text-text-tertiary">Review your plan and proceed to secure checkout</p>
            </div>

            {/* Plan Card */}
            <div className="bg-bg-tertiary border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{planDetails.name}</h2>
                  <p className="text-sm text-text-tertiary">BETA Early Adopter Price</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  {discount}% OFF
                </div>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-text-primary">${planDetails.price}</span>
                <span className="text-text-tertiary pb-1">/{planDetails.interval}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-tertiary line-through">${planDetails.originalPrice}/{planDetails.interval}</span>
                <span className="text-accent font-medium">· Locked forever</span>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-sm font-semibold text-text-primary">What's included:</p>
                {planDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Selector */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-text-primary">Change plan:</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(PLAN_DETAILS).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`px-4 py-3 rounded-lg border text-center transition-all ${
                      selectedPlan === key
                        ? 'border-accent bg-accent/10 text-accent font-semibold'
                        : 'border-border bg-bg-quaternary text-text-tertiary hover:border-accent/50'
                    }`}
                  >
                    <p className="text-sm font-medium">{plan.name}</p>
                    <p className="text-xs mt-1">${plan.price}/mo</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Checkout Action */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Security & Trust */}
            <div className="bg-gradient-to-br from-bg-tertiary to-bg-quaternary border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Secure Checkout</h3>
                  <p className="text-xs text-text-tertiary">Powered by Stripe</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Encrypted & Secure</p>
                    <p className="text-xs text-text-tertiary">Your payment information is never stored on our servers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">All Payment Methods</p>
                    <p className="text-xs text-text-tertiary">Cards, Apple Pay, Google Pay, and Link supported</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-4">
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={isCreatingSession}
                className="w-full bg-gradient-to-r from-accent to-[#FFD700] hover:shadow-lg hover:shadow-accent/50 transition-all text-white font-semibold text-lg py-6"
              >
                {isCreatingSession ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating secure checkout...
                  </>
                ) : (
                  <>
                    Proceed to Secure Checkout
                    <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
                  </>
                )}
              </Button>

              <p className="text-xs text-text-tertiary text-center">
                You'll be redirected to Stripe's secure checkout page
              </p>
            </div>

            {/* Guarantees */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-text-primary">What you get:</h4>
              <div className="space-y-2">
                {[
                  '30-day money-back guarantee',
                  'Cancel anytime, no questions asked',
                  'Lifetime BETA price lock',
                  'Priority support during BETA',
                  'Free updates & new features',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-text-tertiary">
                By completing this purchase, you agree to our{' '}
                <a href="/terms" className="text-accent hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
