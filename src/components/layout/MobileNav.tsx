import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Page } from '../../integrations/supabase/types';
import { LayoutGrid, Package, Truck, ClipboardList } from 'lucide-react';

interface MobileNavProps {
  deliveryCount?: number;
}

const navItems: { icon: React.ElementType; label: string; page: Page, path: string }[] = [
    { icon: LayoutGrid, label: 'Dashboard', page: 'dashboard', path: '/dashboard' },
    { icon: Package, label: 'Commandes', page: 'orders', path: '/orders' },
    { icon: Truck, label: 'Livraisons', page: 'deliveries', path: '/deliveries' },
    { icon: ClipboardList, label: 'Gestion', page: 'gestion', path: '/gestion' },
  ];

const MobileNav: React.FC<MobileNavProps> = ({ deliveryCount = 0 }) => {
  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] h-20 flex justify-around items-center z-10 rounded-t-2xl">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
            <Link
              key={item.page}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all duration-300 ${
                currentPage === item.path ? 'text-orange-500 -translate-y-2 bg-orange-50 shadow-md' : 'text-gray-400'
              }`}
              aria-label={item.label}
            >
              <IconComponent className="w-6 h-6" />
              {currentPage === item.path && <span className="text-xs font-bold">{item.label}</span>}

              {item.page === 'deliveries' && deliveryCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {deliveryCount}
                </span>
              )}
            </Link>
        )
      })}
    </nav>
  );
};

export default MobileNav;
