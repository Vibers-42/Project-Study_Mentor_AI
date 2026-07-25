import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Button from '../components/common/Button';

const LandingLayout = () => {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const headerActions = (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link to="/login">
        <Button variant="ghost" size="sm">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="primary" size="sm">Sign Up</Button>
      </Link>
    </div>
  );

  const footerSections = [
    {
      title: 'Product',
      items: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Try AI Doubt Solver', href: '/question' },
        { label: 'Mock Interview Practice', href: '/interview' },
      ],
    },
    {
      title: 'Resources & Links',
      items: [
        { label: 'About Us', href: '#about' },
        { label: 'Contact', href: 'mailto:support@studymentor.ai' },
        { label: 'GitHub', href: 'https://github.com' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar links={navLinks} actions={headerActions} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer sections={footerSections} />
    </div>
  );
};

export default LandingLayout;
