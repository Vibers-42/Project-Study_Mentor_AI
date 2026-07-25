import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Left side: Branding / Image */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-blue-600 text-white p-12">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">AI Study Mentor</h1>
          <p className="text-lg text-blue-100">
            Unlock your learning potential with personalized, AI-driven guidance and structured progress tracking.
          </p>
        </div>
      </div>
      
      {/* Right side: Auth Form */}
      <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">AI Study Mentor</Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
