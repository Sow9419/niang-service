import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Page } from '../../integrations/supabase/types';
import { LayoutGrid, Package, Truck, ClipboardList } from 'lucide-react';
import { SettingsDialog } from '../dialog/Setting';

interface SidebarProps {
  deliveryCount?: number;
}

const navItems: { icon: React.ElementType; label: string; page: Page, path: string }[] = [
  { icon: LayoutGrid, label: 'Dashboard', page: 'dashboard', path: '/dashboard' },
  { icon: Package, label: 'Commandes', page: 'orders', path: '/orders' },
  { icon: Truck, label: 'Deliveries', page: 'deliveries', path: '/deliveries' },
  { icon: ClipboardList, label: 'Gestion', page: 'gestion', path: '/gestion' },
];

const Logo = () => (
    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-2xl">ln</span>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ deliveryCount = 0 }) => {
  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-20 bg-white shadow-md z-10 p-2 items-center">
      <div className="py-4 mb-4">
        <Logo />
      </div>
      <nav className="flex flex-col items-center gap-2 flex-grow">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.page}
              to={item.path}
              className={`relative w-14 h-14 flex items-center justify-center rounded-xl transition-colors duration-200 ${
                currentPage === item.path
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              aria-label={item.label}
            >
              <IconComponent className="w-6 h-6" />
               {item.page === 'deliveries' && deliveryCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {deliveryCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="flex flex-col items-center gap-2 pb-2">
        <SettingsDialog />
      </div>
    </aside>
  );
};

export default Sidebar;
