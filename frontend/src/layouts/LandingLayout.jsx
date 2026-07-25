import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
            <Link to="/">AI Study Mentor</Link>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Sign Up</Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-8 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AI Study Mentor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
