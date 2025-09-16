
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

// This component establishes the main layout for the authenticated part of the application.
// It includes the sidebar for desktop, a mobile navigation bar, and the main content area.
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar for larger screens (lg and up) */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-20"> 
        {/* Mobile Navigation Bar */}
        <MobileNav />

        {/* The Outlet component from react-router-dom renders the matched child route's component */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
