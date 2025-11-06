/**
 * Footer Section Component
 * Navigation links and copyright
 *
 * 2025 Optimizations:
 * - Clean column layout
 * - Accessible navigation
 * - Brand consistency
 */

import { Link } from 'react-router';

export default function FooterSection() {
  const footerLinks = {
    product: [
      { label: 'Features', href: '#value' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'GitHub', href: 'https://github.com/cloudflare/vibesdk', external: true },
      { label: 'Live Demo', href: 'https://build.cloudflare.dev', external: true },
    ],
    resources: [
      { label: 'Free Guide', href: '#lead-gen' },
      { label: 'Success Stories', href: '#success' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Documentation', href: '#', external: true },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <footer
      className="bg-bg-quaternary border-t border-border py-16 px-4"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4" aria-label="Dreamforge homepage">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z"
                  fill="url(#footer-gradient)"
                />
                <defs>
                  <linearGradient id="footer-gradient" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Dreamforge
              </span>
            </Link>
            <p className="text-text-secondary leading-relaxed">
              Official Cloudflare product. Open source. Production-ready. Build apps that generate
              recurring income.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Product</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Resources</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Company</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-text-tertiary text-sm">
            © 2025 Dreamforge by Cloudflare. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
