
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import OrdersList from "@/components/commande/OrdersList";
import CreateOrderForm from "@/components/commande/CreateOrderForm";
import { useCommandes } from "@/hooks/useCommandes";
import { useClients } from "@/hooks/useClients";
import { Skeleton } from "@/components/ui/skeleton";
import type { Commande } from "@/types";

export default function OrdersPage() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Commande | null>(null);
  const { commandes, loading: loadingCommandes, createCommande, updateCommande, deleteCommande } = useCommandes();
  const { clients, loading: loadingClients } = useClients();

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
    const success = editingOrder
      ? await updateCommande({ ...orderData, id: editingOrder.id })
      : await createCommande(orderData);

    if (success) {
      handleCloseForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
        {!isFormVisible && (
          <Button onClick={handleShowCreateForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une nouvelle commande
          </Button>
        )}
      </div>

      {isFormVisible ? (
        <CreateOrderForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          clients={clients}
          commande={editingOrder}
        />
      ) : (
        <OrdersList
          commandes={commandes}
          onEdit={handleShowEditForm}
          onDelete={deleteCommande}
          isLoading={loadingCommandes || loadingClients}
        />
      )}
    </div>
  );
}
