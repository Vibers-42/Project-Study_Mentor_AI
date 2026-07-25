import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

/**
 * Reusable Sidebar navigation component for Dashboard and portal layouts.
 * Supports collapse mode, badge indicators, user footer, and mobile drawer.
 */
const Sidebar = ({
  brand = 'Study Mentor AI',
  links = [],
  user,
  footerActions,
  collapsed: controlledCollapsed,
  onToggleCollapse,
  className = '',
  ...props
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!isCollapsed);
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 h-screen sticky top-0 shrink-0 z-30',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
      {...props}
    >
      {/* Header / Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <Link
          to="/dashboard"
          className={cn(
            'flex items-center gap-3 font-bold text-indigo-600 dark:text-indigo-400 overflow-hidden',
            isCollapsed && 'justify-center w-full'
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm">
            AI
          </div>
          {!isCollapsed && (
            <span className="text-lg bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent truncate">
              {brand}
            </span>
          )}
        </Link>
      </div>

      {/* Collapse button floating on the dividing border (desktop only) */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute top-4 -right-3 z-40 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-xs hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all hidden md:flex items-center justify-center cursor-pointer"
      >
        <svg
          className={cn(
            "w-3.5 h-3.5 stroke-current stroke-2 fill-none transition-transform duration-200",
            isCollapsed ? "rotate-180" : ""
          )}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>


      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              title={isCollapsed ? link.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100',
                isCollapsed && 'justify-center px-0'
              )}
            >
              {link.icon && (
                <span className={cn('w-5 h-5 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300')}>
                  {link.icon}
                </span>
              )}

              {!isCollapsed && (
                <span className="flex-1 truncate">{link.label}</span>
              )}

              {!isCollapsed && link.badge && (
                <Badge variant={link.badgeVariant || 'primary'} size="sm">
                  {link.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Student User'}
              size={isCollapsed ? 'sm' : 'md'}
              status="online"
            />
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {user?.name || 'Student User'}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {user?.email || 'student@mentor.ai'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && footerActions && (
            <div>{footerActions}</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
