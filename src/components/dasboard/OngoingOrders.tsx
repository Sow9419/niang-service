
import React from 'react';
import type { CommandeEnCours } from '@/types';
import { Truck, Hourglass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OngoingOrdersProps {
    orders: CommandeEnCours[];
    isLoading: boolean;
}

const OrderIcon: React.FC<{ statut: string | null }> = ({ statut }) => {
    const isDelivery = statut === 'en_livraison';
    const IconComponent = isDelivery ? Truck : Hourglass;
    const bgColor = isDelivery ? 'bg-blue-100' : 'bg-yellow-100';
    const iconColor = isDelivery ? 'text-blue-500' : 'text-yellow-500';

    return (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
        </div>
    );
}

const OngoingOrders: React.FC<OngoingOrdersProps> = ({ orders, isLoading }) => {
  if (isLoading) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Commandes en Cours</h3>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                        <div className="flex-grow">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
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
        <h3 className="font-semibold text-lg text-gray-800">Commandes en Cours</h3>
        <Link to="/orders" className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600">
          Voir tout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                <OrderIcon statut={order.statut} />
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">Commande #{order.id.toString().slice(-4)}</p>
                  <p className="text-xs text-gray-500">
                    {order.clients?.nom} - {order.quantite_commandee} L
                  </p>
                </div>
                <p className="font-bold text-gray-800">{order.prix_total?.toLocaleString('fr-FR')} CFA</p>
              </div>
            ))
        ) : (
            <div className="text-center py-8 text-gray-500">
                <p>Aucune commande en cours.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default OngoingOrders;
