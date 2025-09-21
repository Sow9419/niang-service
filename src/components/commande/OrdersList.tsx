import React from 'react';
import { Search, Edit, Trash2, ChevronDown } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Commande } from '@/types';
import type { CommandeStatus } from '@/types';

const OrderCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-3">
            <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-left border-t border-b py-3 my-3">
            {[...Array(4)].map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                </div>
            ))}
        </div>
        <div className="flex justify-between items-center text-sm">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-5 h-5" />
            </div>
        </div>
    </div>
);

const OrderTableRowSkeleton = () => (
    <tr className="bg-white border-b">
        <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-16" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-16" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
        <td className="px-4 py-4"><Skeleton className="h-6 w-20" /></td>
        <td className="px-4 py-4 flex items-center gap-3">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
        </td>
    </tr>
);


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
                <p className="font-medium text-gray-800">{commande.product}</p>
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

// The component is now fully controlled by its parent via props.
interface OrdersListProps {
  commandes: Commande[];
  totalCount: number;
  itemsPerPage: number;
  isLoading: boolean;
  onEdit: (commande: Commande) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: CommandeStatus | 'Tous';
  onStatusFilterChange: (value: CommandeStatus | 'Tous') => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({
    commandes,
    totalCount,
    itemsPerPage,
    isLoading,
    onEdit,
    onDelete,
    searchTerm,
    onSearchTermChange,
    statusFilter,
    onStatusFilterChange,
    currentPage,
    onPageChange
}) => {

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalCount);

    const handleStatusChange = (value: string) => {
        onStatusFilterChange(value as CommandeStatus | 'Tous');
        onPageChange(1);
    };

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
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-48 justify-between text-gray-900">
                            {statusFilter === 'Tous' ? 'Filtrer par statut' : statusFilter}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full sm:w-48">
                        <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleStatusChange}>
                            <DropdownMenuRadioItem value="Tous">Tous</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Livré">Livré</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Non Livré">Non Livré</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Annulée">Annulée</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                {isLoading ? (
                    [...Array(itemsPerPage)].map((_, i) => <OrderCardSkeleton key={i} />)
                ) : (
                    commandes.map(commande => <OrderCard key={commande.id} commande={commande} onEdit={onEdit} onDelete={onDelete} />)
                )}
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
                         {isLoading ? (
                            [...Array(itemsPerPage)].map((_, i) => <OrderTableRowSkeleton key={i} />)
                        ) : (
                            commandes.map((commande) => (
                                <tr key={commande.id} className="bg-white border-b border-gray-300 hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{commande.order_number}</td>
                                    <td className="px-4 py-4">{commande.clients.name}</td>
                                    <td className="px-4 py-4">{commande.product}</td>
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading && commandes.length === 0 && (
                 <div className="text-center py-12 col-span-full">
                    <h3 className="text-xl font-semibold">Aucune commande trouvée</h3>
                    <p className="text-muted-foreground mt-2">Essayez d'ajuster vos filtres ou votre recherche.</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 mt-4 border-t border-gray-200 gap-2">
                 <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                   Affichage de <span className="font-semibold">{commandes.length > 0 ? startItem : 0}-{endItem}</span> sur <span className="font-semibold">{totalCount}</span>
                </p>
                {totalPages > 1 && (
                    <nav className="flex items-center gap-2 flex-wrap justify-center">
                        <button 
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm"
                        >
                            Précédent
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-colors text-sm font-medium ${currentPage === page ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button 
                            onClick={() => onPageChange(currentPage + 1)}
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
