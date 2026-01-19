/**
 * Header Navigation Component
 * Responsive header with dynamic navigation from CMS including sub-menu support
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useCMS, MenuItem } from '@/contexts/CMSContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { navigation, loading } = useCMS();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Get navigation items from CMS or use defaults
  const navItems = navigation?.main || [];
  const ctaText = navigation?.ctaText || 'Start Free Trial';
  const ctaLink = navigation?.ctaLink || 'https://www.shopify.com/';

  // Group children by category for mega menu
  const groupByCategory = (children: MenuItem[]) => {
    const groups: { [key: string]: MenuItem[] } = {};
    children.forEach(child => {
      const cat = child.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(child);
    });
    return groups;
  };

  const renderNavItem = (item: typeof navItems[0]) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      const categoryGroups = groupByCategory(item.children!);
      const categories = Object.keys(categoryGroups);
      const isMegaMenu = categories.length > 1 || categories.some(c => c !== 'Other');

      return (
        <div
          key={item.path}
          className="relative"
          onMouseEnter={() => setOpenDropdown(item.path)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 flex items-center ${isActive(item.path)
                ? 'text-primary border-primary'
                : 'text-foreground hover:text-primary border-transparent hover:border-primary/30'
              }`}
          >
            {item.title}
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>

          {openDropdown === item.path && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 z-50">
              <div className={`bg-card rounded-lg shadow-lg border border-border py-4 ${isMegaMenu ? 'min-w-[400px]' : 'min-w-[240px]'
                }`}>
                {isMegaMenu ? (
                  <div className="grid grid-cols-2 gap-6 px-6">
                    {categories.map(category => (
                      <div key={category}>
                        <h4 className="font-semibold text-foreground mb-3">{category}</h4>
                        <div className="space-y-1">
                          {categoryGroups[category].map((child: MenuItem) => (
                            <Link
                              key={child.id || child.path}
                              to={child.path}
                              target={child.openInNewTab ? '_blank' : undefined}
                              rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                              className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-2">
                    {item.children!.map((child: MenuItem) => (
                      <Link
                        key={child.id || child.path}
                        to={child.path}
                        target={child.openInNewTab ? '_blank' : undefined}
                        rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Regular navigation items
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${isActive(item.path)
            ? 'text-primary border-primary'
            : 'text-foreground hover:text-primary border-transparent hover:border-primary/30'
          }`}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          {/* Logo - positioned absolutely to the left */}
          <div className="absolute left-0 flex-shrink-0">
            <Link to="/" className="text-2xl font-bold gradient-text">
              Devnzo
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-8">
            {navItems.map(renderNavItem)}
          </nav>

          {/* CTA Button - positioned absolutely to the right */}
          <div className="absolute right-0 hidden md:flex items-center space-x-4">
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              {ctaText}
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
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className="block px-3 py-2 text-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
                {/* Render children in mobile as indented items */}
                {item.children && item.children.length > 0 && (
                  <div className="pl-4">
                    {item.children.map((child: MenuItem) => (
                      <Link
                        key={child.id || child.path}
                        to={child.path}
                        target={child.openInNewTab ? '_blank' : undefined}
                        rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 pb-2 space-y-2">
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium text-center"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
