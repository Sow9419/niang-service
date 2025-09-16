import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Commande, CommandeStatus } from '../../types';

const ITEMS_PER_PAGE = 5;

const OrderCard: React.FC<{ commande: Commande; onEdit: (commande: Commande) => void; onDelete: (id: number) => void; }> = ({ commande, onEdit, onDelete }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-3">
            <div>
                <p className="font-semibold text-gray-900">{commande.order_number}</p>
                <p className="text-sm text-gray-600">{commande.clients.name}</p>
            </div>
            <StatusBadge status={commande.status} />
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-left border-t border-b py-3 my-3">
            <div>
                <p className="text-gray-500">Produit</p>
                <p className="font-medium text-gray-800">{commande.product_type}</p>
            </div>
            <div>
                <p className="text-gray-500">Quantité</p>
                <p className="font-medium text-gray-800">{commande.quantity.toLocaleString('fr-FR')} L</p>
            </div>
            <div>
                <p className="text-gray-500">P.U. (FCFA)</p>
                <p className="font-medium text-gray-800">{commande.unit_price.toLocaleString('fr-FR')}</p>
            </div>
            <div>
                <p className="text-gray-500">Montant</p>
                <p className="font-medium text-gray-800">{commande.estimated_amount.toLocaleString('fr-FR')}</p>
            </div>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Date: <span className="font-medium text-gray-700">{new Date(commande.created_at).toLocaleDateString('fr-FR')}</span></span>
             <div className="flex items-center gap-3">
                <button onClick={() => onEdit(commande)} className="text-orange-500 hover:text-orange-700"><Edit className="w-5 h-5"/></button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. La commande sera définitivement supprimée.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(commande.id)}>Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    </div>
);

interface OrdersListProps {
  commandes: Commande[];
  onEdit: (commande: Commande) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const OrdersList: React.FC<OrdersListProps> = ({ commandes, onEdit, onDelete, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<CommandeStatus | 'Tous'>('Tous');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredCommandes = useMemo(() => {
        return commandes.filter(c => {
            const searchMatch = c.clients.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.order_number.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'Tous' || c.status === statusFilter;
            return searchMatch && statusMatch;
        });
    }, [commandes, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredCommandes.length / ITEMS_PER_PAGE);
    const paginatedCommandes = filteredCommandes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredCommandes.length);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )
    }

    if (commandes.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold">Aucune commande pour le moment</h3>
                <p className="text-muted-foreground mt-2">Commencez par créer une nouvelle commande pour la voir apparaître ici.</p>
            </div>
        )
    }

    return (
        <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Liste des commandes</h2>
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
                        onChange={(e) => { setStatusFilter(e.target.value as CommandeStatus | 'Tous'); setCurrentPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="Tous">Tous</option>
                        <option value="Livré">Livré</option>
                        <option value="Non Livré">Non Livré</option>
                        <option value="Annulée">Annulée</option>
                    </select>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                {paginatedCommandes.map(commande => <OrderCard key={commande.id} commande={commande} onEdit={onEdit} onDelete={onDelete} />)}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 font-semibold">
                        <tr>
                            <th scope="col" className="px-4 py-3">N° COMMANDE</th>
                            <th scope="col" className="px-4 py-3">CLIENT</th>
                            <th scope="col" className="px-4 py-3">PRODUIT</th>
                            <th scope="col" className="px-4 py-3">QUANTITÉ (L)</th>
                            <th scope="col" className="px-4 py-3">P.U. (FCFA)</th>
                            <th scope="col" className="px-4 py-3">MONTANT ESTIMÉ</th>
                            <th scope="col" className="px-4 py-3">DATE COMMANDE</th>
                            <th scope="col" className="px-4 py-3">STATUT</th>
                            <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCommandes.map((commande) => (
                            <tr key={commande.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{commande.order_number}</td>
                                <td className="px-4 py-4">{commande.clients.name}</td>
                                <td className="px-4 py-4">{commande.product_type}</td>
                                <td className="px-4 py-4">{commande.quantity.toLocaleString('fr-FR')}</td>
                                <td className="px-4 py-4">{commande.unit_price.toLocaleString('fr-FR')}</td>
                                <td className="px-4 py-4">{commande.estimated_amount.toLocaleString('fr-FR')}</td>
                                <td className="px-4 py-4">{new Date(commande.created_at).toLocaleDateString('fr-FR')}</td>
                                <td className="px-4 py-4"><StatusBadge status={commande.status} /></td>
                                <td className="px-4 py-4 flex items-center gap-3">
                                    <button onClick={() => onEdit(commande)} className="text-orange-500 hover:text-orange-700"><Edit className="w-5 h-5"/></button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Cette action est irréversible. La commande sera définitivement supprimée.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => onDelete(commande.id)}>Supprimer</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 mt-4 border-t">
                 <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                   Affichage de <span className="font-semibold">{paginatedCommandes.length > 0 ? startItem : 0}-{endItem}</span> sur <span className="font-semibold">{filteredCommandes.length}</span>
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

export default OrdersList;
