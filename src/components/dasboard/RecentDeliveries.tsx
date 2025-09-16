import React from 'react';
import type { LivraisonRecente } from '@/types';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentDeliveriesProps {
    deliveries: LivraisonRecente[];
    isLoading: boolean;
}

const StatusBadge: React.FC<{ status: string | null }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
  switch (status) {
    case 'livree':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Livré</span>;
    case 'non_livree':
      return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>Non Livré</span>;
    case 'annulee':
      return <span className={`${baseClasses} bg-rose-100 text-rose-800`}>Annulée</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

const RecentDeliveries: React.FC<RecentDeliveriesProps> = ({ deliveries, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Livraisons Récentes</h3>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex-grow space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-2/4 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-800">Livraisons Récentes</h3>
        <Link to="/deliveries" className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600">
          Voir tout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="py-3 px-2 font-medium">Client</th>
              <th className="py-3 px-2 font-medium">Volume</th>
              <th className="py-3 px-2 font-medium hidden sm:table-cell">Date</th>
              <th className="py-3 px-2 font-medium text-right">Statut</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length > 0 ? (
                deliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-4 px-2 font-semibold text-gray-800">{delivery.commandes?.clients?.nom || 'N/A'}</td>
                    <td className="py-4 px-2 text-gray-600">{delivery.commandes?.quantite_commandee} L</td>
                    <td className="py-4 px-2 text-gray-600 hidden sm:table-cell">
                        {delivery.date_livraison ? new Date(delivery.date_livraison).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <StatusBadge status={delivery.statut} />
                    </td>
                  </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                        Aucune livraison récente.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDeliveries;
