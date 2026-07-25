import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Progress', href: '/progress' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-white dark:bg-gray-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl text-blue-600 dark:text-blue-400">
          <Link to="/dashboard">AI Mentor</Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t">
          {/* Placeholder for User Profile / Logout */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
              U
            </div>
            <div className="text-sm font-medium">User Profile</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar for Mobile & Header Actions */}
        <header className="h-16 border-b bg-white dark:bg-gray-950 flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
          <div className="md:hidden font-bold text-lg text-blue-600">
            AI Mentor
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {/* Top right actions (e.g., Theme Toggle, Notifications) */}
            <span className="text-sm text-gray-500">Notifications</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
