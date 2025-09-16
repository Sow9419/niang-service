import React, { useState, useMemo } from 'react';
import { Search, Edit, Eye } from 'lucide-react';
import type { Livraison, LivraisonStatus, LivraisonPaymentStatus } from '../../types';

type EnrichedLivraison = Livraison & { commande_quantity: number };

const mockLivraisons: EnrichedLivraison[] = [
  { id: 1, commande_id: 3, commande_order_number: '#1254', client: 'Client B', citerne: 'Citerne 2', commande_quantity: 5500, volume_livre: 5450, volume_manquant: 50, date_livraison: '24/05/2024', status: 'Non Livré', payment_status: 'NON PAYÉ' },
  { id: 2, commande_id: 4, commande_order_number: '#1253', client: 'Client A', citerne: 'Citerne 1', commande_quantity: 10000, volume_livre: 10000, volume_manquant: 0, date_livraison: '23/05/2024', status: 'Livré', payment_status: 'PAYÉ' },
  { id: 3, commande_id: 7, commande_order_number: '#1252', client: 'Client C', citerne: 'Citerne 1', commande_quantity: 8000, volume_livre: 7800, volume_manquant: 200, date_livraison: '22/05/2024', status: 'Livré', payment_status: 'NON PAYÉ' },
  { id: 4, commande_id: 5, commande_order_number: '#1251', client: 'Client F', citerne: 'Citerne 3', commande_quantity: 3000, volume_livre: 3000, volume_manquant: 0, date_livraison: '21/05/2024', status: 'Annulée', payment_status: 'PAYÉ' },
  { id: 5, commande_id: 8, commande_order_number: '#1250', client: 'Client G', citerne: 'Citerne 4', commande_quantity: 12000, volume_livre: 12000, volume_manquant: 0, date_livraison: '20/05/2024', status: 'Livré', payment_status: 'PAYÉ' },
];

const ITEMS_PER_PAGE = 4;

interface DeliveriesListProps {
    onEdit: (livraison: Livraison) => void;
    editingDeliveryId: number | null;
}

const deliveryStatusStyles: Record<LivraisonStatus, string> = {
  'Livré': 'bg-green-100 text-green-800',
  'Non Livré': 'bg-amber-100 text-amber-800',
  'Annulée': 'bg-rose-100 text-rose-800',
};

const paymentStatusStyles: Record<LivraisonPaymentStatus, string> = {
    'PAYÉ': 'bg-green-100 text-green-800',
    'NON PAYÉ': 'bg-amber-100 text-amber-800',
};

const baseSelectClasses = "appearance-none border-none rounded-full text-xs font-medium px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer";

const ActionButton: React.FC<{ status: LivraisonStatus; onClick: () => void; isEditing: boolean; }> = ({ status, onClick, isEditing }) => {
    const IconComponent = isEditing || status === 'Non Livré' ? Edit : Eye;
    return (
        <button onClick={onClick} className="text-orange-500 hover:text-orange-700">
            <IconComponent className="w-5 h-5"/>
        </button>
    );
};

const DeliveryCard: React.FC<{ 
    livraison: EnrichedLivraison; 
    onEdit: (livraison: Livraison) => void; 
    isEditing: boolean;
    onDeliveryStatusChange: (id: number, status: LivraisonStatus) => void;
    onPaymentStatusChange: (id: number, status: LivraisonPaymentStatus) => void;
}> = ({ livraison, onEdit, isEditing, onDeliveryStatusChange, onPaymentStatusChange }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-3">
            <div>
                <p className="font-semibold text-gray-900">Commande {livraison.commande_order_number}</p>
                <p className="text-sm text-gray-600">{livraison.client}</p>
            </div>
             <select
                value={livraison.status}
                onChange={(e) => onDeliveryStatusChange(livraison.id, e.target.value as LivraisonStatus)}
                className={`${baseSelectClasses} ${deliveryStatusStyles[livraison.status]}`}
                onClick={(e) => e.stopPropagation()}
            >
                <option value="Non Livré">Non Livré</option>
                <option value="Livré">Livré</option>
                <option value="Annulée">Annulée</option>
            </select>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-left border-t border-b py-3 my-3">
            <div>
                <p className="text-gray-500">Quantité Cmd.</p>
                <p className="font-medium text-gray-800">{livraison.commande_quantity.toLocaleString('fr-FR')} L</p>
            </div>
             <div>
                <p className="text-gray-500">Citerne</p>
                <p className="font-medium text-gray-800">{livraison.citerne}</p>
            </div>
            <div>
                <p className="text-gray-500">Volume Livré</p>
                <p className="font-medium text-gray-800">{livraison.volume_livre.toLocaleString('fr-FR')} L</p>
            </div>
            <div>
                <p className="text-gray-500">Volume Manquant</p>
                <p className={`font-medium ${livraison.volume_manquant > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                    {livraison.volume_manquant.toLocaleString('fr-FR')} L
                </p>
            </div>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Date: <span className="font-medium text-gray-700">{livraison.date_livraison}</span></span>
             <div className="flex items-center gap-4">
                 <select
                    value={livraison.payment_status}
                    onChange={(e) => onPaymentStatusChange(livraison.id, e.target.value as LivraisonPaymentStatus)}
                    className={`${baseSelectClasses} ${paymentStatusStyles[livraison.payment_status]}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <option value="NON PAYÉ">NON PAYÉ</option>
                    <option value="PAYÉ">PAYÉ</option>
                </select>
                <ActionButton status={livraison.status} onClick={() => onEdit(livraison)} isEditing={isEditing} />
            </div>
        </div>
    </div>
);


const DeliveriesList: React.FC<DeliveriesListProps> = ({ onEdit, editingDeliveryId }) => {
    const [livraisons, setLivraisons] = useState<EnrichedLivraison[]>(mockLivraisons);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LivraisonStatus | 'Tous'>('Tous');
    const [currentPage, setCurrentPage] = useState(1);

    const handleDeliveryStatusChange = (id: number, status: LivraisonStatus) => {
        setLivraisons(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    };

    const handlePaymentStatusChange = (id: number, status: LivraisonPaymentStatus) => {
        setLivraisons(prev => prev.map(l => l.id === id ? { ...l, payment_status: status } : l));
    };

    const filteredLivraisons = useMemo(() => {
        return livraisons.filter(l => {
            const searchMatch = l.client.toLowerCase().includes(searchTerm.toLowerCase()) || l.commande_order_number.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'Tous' || l.status === statusFilter;
            return searchMatch && statusMatch;
        });
    }, [searchTerm, statusFilter, livraisons]);

    const totalPages = Math.ceil(filteredLivraisons.length / ITEMS_PER_PAGE);
    const paginatedLivraisons = filteredLivraisons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredLivraisons.length);

    return (
        <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Historique des livraisons</h2>
             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Rechercher par client, com..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Statut:</label>
                    <select 
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as LivraisonStatus | 'Tous'); setCurrentPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="Tous">Tous</option>
                        <option value="Non Livré">Non Livré</option>
                        <option value="Livré">Livré</option>
                        <option value="Annulée">Annulée</option>
                    </select>
                </div>
            </div>

             {/* Mobile View */}
            <div className="lg:hidden">
                {paginatedLivraisons.map(livraison => (
                    <DeliveryCard 
                        key={livraison.id} 
                        livraison={livraison} 
                        onEdit={onEdit}
                        isEditing={livraison.id === editingDeliveryId}
                        onDeliveryStatusChange={handleDeliveryStatusChange}
                        onPaymentStatusChange={handlePaymentStatusChange}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 font-semibold">
                        <tr>
                            <th scope="col" className="px-4 py-3">COMMANDE</th>
                            <th scope="col" className="px-4 py-3">CLIENT</th>
                            <th scope="col" className="px-4 py-3">QUANTITÉ CMD.</th>
                            <th scope="col" className="px-4 py-3">VOLUME LIVRÉ</th>
                            <th scope="col" className="px-4 py-3">VOLUME MANQUANT</th>
                             <th scope="col" className="px-4 py-3">CITERNE</th>
                            <th scope="col" className="px-4 py-3">DATE DE LIVRAISON</th>
                            <th scope="col" className="px-4 py-3">STATUT LIVRAISON</th>
                            <th scope="col" className="px-4 py-3">STATUT PAIEMENT</th>
                            <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLivraisons.map((livraison) => {
                            const isEditing = livraison.id === editingDeliveryId;
                            return (
                                <tr key={livraison.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{livraison.commande_order_number}</td>
                                    <td className="px-4 py-4">{livraison.client}</td>
                                    <td className="px-4 py-4 font-medium text-gray-800">{livraison.commande_quantity.toLocaleString('fr-FR')} L</td>
                                    <td className="px-4 py-4">{livraison.volume_livre.toLocaleString('fr-FR')} L</td>
                                    <td className={`px-4 py-4 font-medium ${livraison.volume_manquant > 0 ? 'text-red-600' : ''}`}>{livraison.volume_manquant.toLocaleString('fr-FR')} L</td>
                                    <td className="px-4 py-4">{livraison.citerne}</td>
                                    <td className="px-4 py-4">{livraison.date_livraison}</td>
                                    <td className="px-4 py-4">
                                        <select
                                            value={livraison.status}
                                            onChange={(e) => handleDeliveryStatusChange(livraison.id, e.target.value as LivraisonStatus)}
                                            className={`${baseSelectClasses} ${deliveryStatusStyles[livraison.status]}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="Non Livré">Non Livré</option>
                                            <option value="Livré">Livré</option>
                                            <option value="Annulée">Annulée</option>
                                        </select>
                                    </td>
                                     <td className="px-4 py-4">
                                        <select
                                            value={livraison.payment_status}
                                            onChange={(e) => handlePaymentStatusChange(livraison.id, e.target.value as LivraisonPaymentStatus)}
                                            className={`${baseSelectClasses} ${paymentStatusStyles[livraison.payment_status]}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="NON PAYÉ">NON PAYÉ</option>
                                            <option value="PAYÉ">PAYÉ</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4">
                                        <ActionButton status={livraison.status} onClick={() => onEdit(livraison)} isEditing={isEditing} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 mt-4 border-t">
                 <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                   Affichage de <span className="font-semibold">{paginatedLivraisons.length > 0 ? startItem : 0}-{endItem}</span> sur <span className="font-semibold">{filteredLivraisons.length}</span>
                </p>
                {totalPages > 1 && (
                    <nav className="flex items-center gap-2 flex-wrap justify-center">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm"
                        >
                            Précédent
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-colors text-sm font-medium ${currentPage === page ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm"
                        >
                            Suivant
                        </button>
                    </nav>
                )}
            </div>
        </section>
    );
};

export default DeliveriesList;