/**
 * Footer Component
 * Simple, clean footer with links and branding
 */

import { Heart } from 'react-feather';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-tertiary border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#FFD700] flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Dreamforge</span>
            </div>
            <p className="text-sm text-text-tertiary">
              The only AI code generator that ships production-ready business apps.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-text-tertiary">
              <li><a href="#pricing" className="hover:text-accent transition-colors">Pricing</a></li>
              <li><a href="/docs" className="hover:text-accent transition-colors">Documentation</a></li>
              <li><a href="/examples" className="hover:text-accent transition-colors">Examples</a></li>
              <li><a href="/changelog" className="hover:text-accent transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-text-tertiary">
              <li><a href="/about" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="/blog" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="/careers" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="/contact" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-text-tertiary">
              <li><a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="/security" className="hover:text-accent transition-colors">Security</a></li>
              <li><a href="/compliance" className="hover:text-accent transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            © {currentYear} Dreamforge. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by developers, for developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
