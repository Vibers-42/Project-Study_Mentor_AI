import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import ThemeToggle from '../common/ThemeToggle';

/**
 * Reusable Navbar component supporting navigation links, custom brand logo, action controls, and responsive mobile menu.
 */
const Navbar = ({
  brand = 'Study Mentor AI',
  links = [],
  actions,
  className = '',
  sticky = true,
  ...props
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className={cn(
        'w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 z-40 transition-colors',
        sticky && 'sticky top-0',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold shadow-sm">
                AI
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                {brand}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {links.length > 0 && (
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isAnchor = link.href.startsWith('#');

                if (isAnchor) {
                  const isHashActive = location.hash === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2',
                        isHashActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      {link.icon && <span className="w-4 h-4">{link.icon}</span>}
                      <span>{link.label}</span>
                    </a>
                  );
                }

                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.href === '/'}
                    className={({ isActive }) =>
                      cn(
                        'px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                      )
                    }
                  >
                    {link.icon && <span className="w-4 h-4">{link.icon}</span>}
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* Actions slot & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ThemeToggle size="sm" />
              {actions}
            </div>

            {/* Mobile Hamburger Button */}
            {links.length > 0 && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && links.length > 0 && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {links.map((link) => {
            const isAnchor = link.href.startsWith('#');

            if (isAnchor) {
              const isHashActive = location.hash === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3',
                    isHashActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  {link.icon && <span className="w-5 h-5">{link.icon}</span>}
                  <span>{link.label}</span>
                </a>
              );
            }

            return (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )
                }
              >
                {link.icon && <span className="w-5 h-5">{link.icon}</span>}
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
