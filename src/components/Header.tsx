/**
 * Header Navigation Component
 * Responsive header with navigation menu and mobile hamburger menu
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ROUTES, RESOURCE_LINKS } from '@/types/routes';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  // Group resource links by category
  const shopifyLinks = RESOURCE_LINKS.filter(link => link.category === 'Shopify');
  const ecommerceLinks = RESOURCE_LINKS.filter(link => link.category === 'eCommerce');

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          {/* Logo - positioned absolutely to the left */}
          <div className="absolute left-0 flex-shrink-0">
            <Link to={ROUTES.HOME} className="text-2xl font-bold gradient-text">
              Devnzo
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-8">
            <Link
              to={ROUTES.PRODUCTS}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                isActive(ROUTES.PRODUCTS)
                  ? 'text-primary border-primary'
                  : 'text-foreground hover:text-primary border-transparent hover:border-primary/30'
              }`}
            >
              Products
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 flex items-center ${
                  isActive(ROUTES.RESOURCES.INDEX)
                    ? 'text-primary border-primary'
                    : 'text-foreground hover:text-primary border-transparent hover:border-primary/30'
                }`}
              >
                Resources
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>

              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-1 w-96 bg-card rounded-lg shadow-lg border border-border py-4">
                  <div className="grid grid-cols-2 gap-4 px-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Shopify</h3>
                      <ul className="space-y-2">
                        {shopifyLinks.map((link) => (
                          <li key={link.path}>
                            <Link
                              to={link.path}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setIsResourcesOpen(false)}
                            >
                              {link.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">eCommerce</h3>
                      <ul className="space-y-2">
                        {ecommerceLinks.map((link) => (
                          <li key={link.path}>
                            <Link
                              to={link.path}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setIsResourcesOpen(false)}
                            >
                              {link.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to={ROUTES.PARTNERS}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                isActive(ROUTES.PARTNERS)
                  ? 'text-primary border-primary'
                  : 'text-foreground hover:text-primary border-transparent hover:border-primary/30'
              }`}
            >
              Partners
            </Link>

            <Link
              to={ROUTES.ABOUT}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                isActive(ROUTES.ABOUT)
                  ? 'text-primary border-primary'
                  : 'text-foreground hover:text-primary border-transparent hover:border-primary/30'
              }`}
            >
              About
            </Link>

            <Link
              to={ROUTES.CONTACT}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                isActive(ROUTES.CONTACT)
                  ? 'text-primary border-primary'
                  : 'text-foreground hover:text-primary border-transparent hover:border-primary/30'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button - positioned absolutely to the right */}
          <div className="absolute right-0 hidden md:flex items-center space-x-4">
            <a
              href="https://www.shopify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="absolute right-0 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to={ROUTES.PRODUCTS}
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to={ROUTES.RESOURCES.INDEX}
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to={ROUTES.PARTNERS}
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Partners
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 pb-2 space-y-2">
              <a
                href="https://www.shopify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium text-center"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
