import React from 'react';
import type { LivraisonStatus } from '../../types';

interface StatusBadgeProps {
  status: LivraisonStatus;
}

const statusStyles: Record<LivraisonStatus, string> = {
  'Livré': 'bg-green-100 text-green-800',
  'Non Livré': 'bg-amber-100 text-amber-800',
  'Annulée': 'bg-rose-100 text-rose-800',
};

const DeliveryStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeStyle = statusStyles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${badgeStyle}`}>
      {status}
    </span>
  );
};

export default DeliveryStatusBadge;