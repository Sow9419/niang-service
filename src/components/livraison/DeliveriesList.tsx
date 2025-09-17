import React, { useState, useMemo } from 'react';
import { Search, Edit, Eye, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import type { Livraison, LivraisonStatus, LivraisonPaymentStatus, LivraisonUpdate } from '../../types';

const ITEMS_PER_PAGE = 4;

interface DeliveriesListProps {
    livraisons: Livraison[];
    onEdit: (livraison: Livraison) => void;
    editingDeliveryId: number | null;
    onUpdate: (livraisonData: LivraisonUpdate, commandeQuantity?: number) => void;
    isLoading: boolean;
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

const DeliveryCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-sm text-left border-t border-b py-3 my-3">
            {[...Array(6)].map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-20" />
                </div>
            ))}
        </div>
        <div className="flex justify-between items-center text-sm">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="w-5 h-5" />
            </div>
        </div>
    </div>
);

const DeliveryTableRowSkeleton = () => (
    <tr className="bg-white border-b animate-pulse">
        <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
        <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
        <td className="px-4 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
        <td className="px-4 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
        <td className="px-4 py-4"><Skeleton className="w-5 h-5" /></td>
    </tr>
);


const DeliveryCard: React.FC<{
    livraison: Livraison;
    onEdit: (livraison: Livraison) => void;
    isEditing: boolean;
    onDeliveryStatusChange: (id: number, status: LivraisonStatus) => void;
    onPaymentStatusChange: (id: number, status: LivraisonPaymentStatus) => void;
}> = ({ livraison, onEdit, isEditing, onDeliveryStatusChange, onPaymentStatusChange }) => {
    const totalAmount = (livraison.commandes?.unit_price ?? 0) * livraison.volume_livre;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="font-semibold text-gray-900">Commande {livraison.commandes?.order_number}</p>
                    <p className="text-sm text-gray-600">{livraison.commandes?.clients?.name}</p>
                </div>
                <Select value={livraison.status} onValueChange={(value) => onDeliveryStatusChange(livraison.id, value as LivraisonStatus)}>
                    <SelectTrigger className={`${baseSelectClasses} ${deliveryStatusStyles[livraison.status]}`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Non Livré">Non Livré</SelectItem>
                        <SelectItem value="Livré">Livré</SelectItem>
                        <SelectItem value="Annulée">Annulée</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-sm text-left border-t border-b py-3 my-3">
                <div>
                    <p className="text-gray-500">Q. Cmd.</p>
                    <p className="font-medium text-gray-800">{livraison.commandes?.quantity?.toLocaleString('fr-FR')} L</p>
                </div>
                <div>
                    <p className="text-gray-500">V. Livré</p>
                    <p className="font-medium text-gray-800">{livraison.volume_livre.toLocaleString('fr-FR')} L</p>
                </div>
                <div>
                    <p className="text-gray-500">V. Manquant</p>
                    <p className={`font-medium ${livraison.volume_manquant > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {livraison.volume_manquant.toLocaleString('fr-FR')} L
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">P.U.</p>
                    <p className="font-medium text-gray-800">{livraison.commandes?.unit_price?.toLocaleString('fr-FR')}</p>
                </div>
                <div>
                    <p className="text-gray-500">Montant Total</p>
                    <p className="font-medium text-gray-800">{totalAmount.toLocaleString('fr-FR')}</p>
                </div>
                <div>
                    <p className="text-gray-500">Citerne</p>
                    <p className="font-medium text-gray-800">{livraison.citernes?.registration || 'N/A'}</p>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Date: <span className="font-medium text-gray-700">{livraison.date_livraison ? new Date(livraison.date_livraison).toLocaleDateString('fr-FR') : 'N/D'}</span></span>
                 <div className="flex items-center gap-4">
                    <Select value={livraison.payment_status} onValueChange={(value) => onPaymentStatusChange(livraison.id, value as LivraisonPaymentStatus)}>
                        <SelectTrigger className={`${baseSelectClasses} ${paymentStatusStyles[livraison.payment_status]}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NON PAYÉ">NON PAYÉ</SelectItem>
                            <SelectItem value="PAYÉ">PAYÉ</SelectItem>
                        </SelectContent>
                    </Select>
                    <ActionButton status={livraison.status} onClick={() => onEdit(livraison)} isEditing={isEditing} />
                </div>
            </div>
        </div>
    );
};


const DeliveriesList: React.FC<DeliveriesListProps> = ({ livraisons, onEdit, editingDeliveryId, onUpdate, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LivraisonStatus | 'Tous'>('Tous');
    const [currentPage, setCurrentPage] = useState(1);

    const handleDeliveryStatusChange = (id: number, status: LivraisonStatus) => {
        onUpdate({ id, status });
    };

    const handlePaymentStatusChange = (id: number, status: LivraisonPaymentStatus) => {
        onUpdate({ id, payment_status: status });
    };

    const handleStatusFilterChange = (value: string) => {
        if (value === 'Tous' || value === 'Livré' || value === 'Non Livré' || value === 'Annulée') {
            setStatusFilter(value as LivraisonStatus | 'Tous');
            setCurrentPage(1);
        }
    };

    const filteredLivraisons = useMemo(() => {
        return livraisons.filter(l => {
            const clientName = l.commandes?.clients?.name ?? '';
            const orderNumber = l.commandes?.order_number ?? '';
            const searchMatch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) || orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'Tous' || l.status === statusFilter;
            return searchMatch && statusMatch;
        });
    }, [livraisons, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredLivraisons.length / ITEMS_PER_PAGE);
    const paginatedLivraisons = filteredLivraisons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredLivraisons.length);

    const showSkeleton = isLoading || (!isLoading && livraisons.length === 0);

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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-48 justify-between">
                            {statusFilter === 'Tous' ? 'Filtrer par statut' : statusFilter}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full sm:w-48">
                        <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <DropdownMenuRadioItem value="Tous">Tous</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Non Livré">Non Livré</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Livré">Livré</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Annulée">Annulée</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

             {/* Mobile View */}
            <div className="lg:hidden">
                {showSkeleton ? (
                    [...Array(ITEMS_PER_PAGE)].map((_, i) => <DeliveryCardSkeleton key={i} />)
                ) : (
                    paginatedLivraisons.map(livraison => (
                        <DeliveryCard
                            key={livraison.id}
                            livraison={livraison}
                            onEdit={onEdit}
                            isEditing={livraison.id === editingDeliveryId}
                            onDeliveryStatusChange={handleDeliveryStatusChange}
                            onPaymentStatusChange={handlePaymentStatusChange}
                        />
                    ))
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 font-semibold">
                        <tr>
                            <th scope="col" className="px-4 py-3">COMMANDE</th>
                            <th scope="col" className="px-4 py-3">CLIENT</th>
                            <th scope="col" className="px-4 py-3">Q. CMD.</th>
                            <th scope="col" className="px-4 py-3">V. LIVRÉ</th>
                            <th scope="col" className="px-4 py-3">MONTANT TOTAL</th>
                            <th scope="col" className="px-4 py-3">V. MANQUANT</th>
                            <th scope="col" className="px-4 py-3">CITERNE</th>
                            <th scope="col" className="px-4 py-3">DATE LIV.</th>
                            <th scope="col" className="px-4 py-3">STATUT LIV.</th>
                            <th scope="col" className="px-4 py-3">STATUT PAI.</th>
                            <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {showSkeleton ? (
                             [...Array(ITEMS_PER_PAGE)].map((_, i) => <DeliveryTableRowSkeleton key={i} />)
                        ) : (
                            paginatedLivraisons.map((livraison) => {
                                const isEditing = livraison.id === editingDeliveryId;
                                const totalAmount = (livraison.commandes?.unit_price ?? 0) * livraison.volume_livre;
                                return (
                                    <tr key={livraison.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{livraison.commandes?.order_number}</td>
                                        <td className="px-4 py-4">{livraison.commandes?.clients?.name}</td>
                                        <td className="px-4 py-4 font-medium text-gray-800">{livraison.commandes?.quantity?.toLocaleString('fr-FR')} L</td>
                                        <td className="px-4 py-4">{livraison.volume_livre?.toLocaleString('fr-FR')} L</td>
                                        <td className="px-4 py-4 font-semibold text-gray-900">{totalAmount.toLocaleString('fr-FR')} FCFA</td>
                                        <td className={`px-4 py-4 font-medium ${livraison.volume_manquant > 0 ? 'text-red-600' : ''}`}>{livraison.volume_manquant?.toLocaleString('fr-FR')} L</td>
                                        <td className="px-4 py-4">{livraison.citernes?.registration || 'N/A'}</td>
                                        <td className="px-4 py-4">{livraison.date_livraison ? new Date(livraison.date_livraison).toLocaleDateString('fr-FR') : 'N/D'}</td>
                                        <td className="px-4 py-4">
                                            <Select value={livraison.status} onValueChange={(value) => handleDeliveryStatusChange(livraison.id, value as LivraisonStatus)}>
                                                <SelectTrigger className={`${baseSelectClasses} ${deliveryStatusStyles[livraison.status]}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Non Livré">Non Livré</SelectItem>
                                                    <SelectItem value="Livré">Livré</SelectItem>
                                                    <SelectItem value="Annulée">Annulée</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                         <td className="px-4 py-4">
                                            <Select value={livraison.payment_status} onValueChange={(value) => handlePaymentStatusChange(livraison.id, value as LivraisonPaymentStatus)}>
                                                <SelectTrigger className={`${baseSelectClasses} ${paymentStatusStyles[livraison.payment_status]}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NON PAYÉ">NON PAYÉ</SelectItem>
                                                    <SelectItem value="PAYÉ">PAYÉ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-4 py-4">
                                            <ActionButton status={livraison.status} onClick={() => onEdit(livraison)} isEditing={isEditing} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {!showSkeleton && filteredLivraisons.length === 0 && (
                 <div className="text-center py-12 col-span-full">
                    <h3 className="text-xl font-semibold">Aucune livraison trouvée</h3>
                    <p className="text-muted-foreground mt-2">Essayez d'ajuster vos filtres ou votre recherche.</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 mt-4 border-t">
                 <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                   Affichage de <span className="font-semibold">{paginatedLivraisons.length > 0 ? startItem : 0}-{endItem}</span> sur <span className="font-semibold">{filteredLivraisons.length}</span>
                </p>
                {totalPages > 1 && !showSkeleton && (
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