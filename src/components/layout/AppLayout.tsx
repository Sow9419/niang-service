
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAllCommandes } from '@/hooks/useAllCommandes';

// This component establishes the main layout for the authenticated part of the application.
// It includes the sidebar for desktop, a mobile navigation bar, and the main content area.
const AppLayout: React.FC = () => {
  const { data: commandes } = useAllCommandes();

  const deliveryCount = React.useMemo(() => {
    if (!commandes) return 0;
    return commandes.filter(c => c.status === 'Non Livré').length;
  }, [commandes]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar for larger screens (lg and up) */}
      <Sidebar deliveryCount={deliveryCount} />

      {/* Main content area */}
      <div className="lg:pl-20"> 
        {/* Mobile Navigation Bar */}
        <MobileNav deliveryCount={deliveryCount} />

        {/* The Outlet component from react-router-dom renders the matched child route's component */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
