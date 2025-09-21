
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import OrdersList from "@/components/commande/OrdersList";
import CreateOrderForm from "@/components/commande/CreateOrderForm";
import { useCommandes } from "@/hooks/useCommandes";
import { useClients } from "@/hooks/useClients";
import type { Commande } from "@/types";
import type { CommandeStatus } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

export default function OrdersPage() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Commande | null>(null);

  // State for filters and pagination, now lifted to the page component
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommandeStatus | 'Tous'>('Tous');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    commandes,
    totalCount,
    isLoading: loadingCommandes,
    createCommande,
    updateCommande,
    deleteCommande,
    itemsPerPage
  } = useCommandes({
    searchTerm: debouncedSearchTerm,
    status: statusFilter,
    page: currentPage
  });

  const { clients, isLoading: loadingClients } = useClients();

  const handleShowCreateForm = () => {
    setEditingOrder(null);
    setFormVisible(true);
  };

  const handleShowEditForm = (order: Commande) => {
    setEditingOrder(order);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingOrder(null);
  };

  const handleFormSubmit = async (orderData) => {
    // Use the mutate function from react-query's useMutation
    if (editingOrder) {
      await updateCommande.mutateAsync({ ...orderData, id: editingOrder.id });
    } else {
      await createCommande.mutateAsync(orderData);
    }
    handleCloseForm();
  };

  const handleDeleteOrder = async (orderId: number) => {
    await deleteCommande.mutateAsync(orderId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-center bg-white p-4 rounded-lg shadow space-y-4 sm:flex-row sm:space-y-0">
        <h1 className="text-3xl font-bold text-black">Gestion des Commandes</h1>
        {!isFormVisible && (
          <Button onClick={handleShowCreateForm} disabled={createCommande.isPending}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une nouvelle commande
          </Button>
        )}
      </div>

      {isFormVisible && (
        <CreateOrderForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          clients={clients}
          commande={editingOrder}
          isSubmitting={createCommande.isPending || updateCommande.isPending}
        />
      )}

      <OrdersList
        commandes={commandes}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
        isLoading={loadingCommandes || loadingClients}
        onEdit={handleShowEditForm}
        onDelete={handleDeleteOrder}
        // Pass state and handlers for controlled components
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
