import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Reusable Footer component supporting brand description, column links, and copyright text.
 */
const Footer = ({
  brand = 'Study Mentor AI',
  description = 'Empowering students with AI-driven personalized study guidance, interview preparation, and real-time feedback.',
  sections = [],
  copyright = `© ${new Date().getFullYear()} Study Mentor AI. All rights reserved.`,
  className = '',
  ...props
}) => {
  return (
    <footer
      className={cn(
        'w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold shadow-sm">
                AI
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                {brand}
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Links Columns */}
          {sections.map((section, idx) => (
            <div key={section.title || idx} className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</Link>
            <Link to="#" className="hover:text-slate-700 dark:hover:text-slate-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
