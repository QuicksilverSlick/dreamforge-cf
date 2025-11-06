/**
 * Signup Page - Conversion Funnel Entry Point
 * Handles: Plan Selection → Auth → Stripe Checkout → Onboarding
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowRight, Shield } from 'react-feather';
import { Loader2, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const PLAN_DETAILS = {
  indie: {
    name: 'Indie Maker',
    price: 29,
    features: [
      '5 active projects',
      'Unlimited deploys',
      'Stripe payments',
      'OAuth + Email auth',
      '10GB storage',
      'Email support',
    ],
  },
  startup: {
    name: 'Startup',
    price: 59,
    features: [
      '20 active projects',
      'Team collaboration (5 members)',
      'Advanced RBAC',
      'Multi-tenancy',
      '100GB storage',
      'Priority support',
    ],
  },
  agency: {
    name: 'Agency',
    price: 199,
    features: [
      'Unlimited projects',
      'Unlimited team members',
      'White-label deployments',
      'Custom AI models',
      '1TB storage',
      'Dedicated support',
    ],
  },
};

export default function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, register, loginWithEmail, authProviders, error, clearError } = useAuth();

  const [selectedPlan] = useState<string>(searchParams.get('plan') || 'indie');
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, go straight to checkout
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(`/checkout?plan=${selectedPlan}`);
    }
  }, [isAuthenticated, isLoading, selectedPlan, navigate]);

  const planDetails = PLAN_DETAILS[selectedPlan as keyof typeof PLAN_DETAILS];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      if (isLogin) {
        await loginWithEmail({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }
      // Auth context will redirect to checkout after successful auth
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    // Store intended redirect URL before OAuth
    const redirectUrl = `/checkout?plan=${selectedPlan}`;
    window.location.href = `/api/auth/oauth/${provider}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Plan Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-sm font-medium text-accent">BETA Early Adopter Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              You've Selected
            </h1>
            <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-accent/20 to-[#FFD700]/20 border border-accent/30">
              <p className="text-2xl font-bold text-text-primary">{planDetails.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-text-primary">${planDetails.price}</span>
              <span className="text-text-tertiary pb-2">/month</span>
            </div>
            <p className="text-sm text-accent font-medium flex items-center gap-2">
              <Lock size={14} aria-hidden="true" /> Locked forever · BETA lifetime discount
            </p>
          </div>

          <div className="space-y-3">
            {planDetails.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-text-primary">30-Day Money-Back Guarantee</span>
            </div>
            <p className="text-sm text-text-tertiary">
              If your app can't handle production traffic, we'll refund your subscription—no questions asked.
            </p>
          </div>
        </motion.div>

        {/* Right: Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-bg-tertiary border border-border rounded-2xl p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-sm text-text-tertiary">
              {isLogin ? 'Log in to continue to checkout' : 'Start your BETA journey today'}
            </p>
          </div>

          {/* OAuth Buttons */}
          {authProviders && (authProviders.google || authProviders.github) && (
            <div className="space-y-3">
              {authProviders.google && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => handleOAuthLogin('google')}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              )}
              {authProviders.github && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => handleOAuthLogin('github')}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </Button>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-bg-tertiary px-2 text-text-tertiary">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
              {!isLogin && (
                <p className="text-xs text-text-tertiary">At least 8 characters</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-accent to-[#FFD700] hover:shadow-lg hover:shadow-accent/50 transition-all text-white font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Create Account'} & Continue to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center text-sm text-text-tertiary">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                clearError();
              }}
              className="text-accent hover:underline font-medium"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t border-border text-center space-y-2">
            <p className="text-xs text-text-tertiary">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-accent hover:underline">Terms</a>
              {' '}and{' '}
              <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
              <span className="flex items-center gap-1">
                <Lock size={12} aria-hidden="true" /> Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <Check size={12} aria-hidden="true" /> Cancel Anytime
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
