
import React from 'react';
import type { KpiCardProps } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType, icon: Icon }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-600' : 'text-red-600';
  const changeBgColor = isIncrease ? 'bg-green-100' : 'bg-red-100';
  const changeSymbol = isIncrease ? '▲' : '▼';

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
            <DropdownMenuItem>Exporter en CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <div className="flex items-end gap-3">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${changeBgColor} ${changeColor}`}>
                {changeSymbol} {change}%
            </span>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;