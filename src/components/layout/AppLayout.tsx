
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import type { Page } from '../../integrations/supabase/types';

// This component establishes the main layout for the authenticated part of the application.
// It includes the sidebar for desktop, a mobile navigation bar, and the main content area.
const AppLayout: React.FC = () => {
  // The 'currentPage' state is used to highlight the active link in both Sidebar and MobileNav.
  // It's managed here in the parent layout component to ensure consistency.
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // The onNavigate function is passed down to navigation components.
  // When a navigation item is clicked, it updates the current page state.
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar for larger screens (lg and up) */}
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main content area */}
      <div className="lg:pl-20"> 
        {/* Mobile Navigation Bar */}
        <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />

        {/* The Outlet component from react-router-dom renders the matched child route's component */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
