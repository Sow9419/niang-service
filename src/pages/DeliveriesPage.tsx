
import { useState } from "react";
import DeliveriesList from "@/components/livraison/DeliveriesList";
import CreateDeliveryForm from "@/components/livraison/CreateDeliveryForm";
import { useLivraisons } from "@/hooks/useLivraisons";
import { useCommandes } from "@/hooks/useCommandes";
import { useCiternes } from "@/hooks/useCiternes";
import { Skeleton } from "@/components/ui/skeleton";
import type { Livraison } from "@/types";

export default function DeliveriesPage() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Livraison | null>(null);
  const { livraisons, loading: loadingLivraisons, updateLivraison } = useLivraisons();
  const { commandes, loading: loadingCommandes } = useCommandes();
  const { citernes, loading: loadingCiternes } = useCiternes();

  const handleEditDelivery = (livraison: Livraison) => {
    setEditingDelivery(livraison);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingDelivery(null);
  };

  const handleFormSubmit = async (livraisonData) => {
    if (!editingDelivery) return;

    const relatedCommande = commandes.find(c => c.id === editingDelivery.commande_id);
    const commandeQuantity = relatedCommande?.quantity;

    const success = await updateLivraison({ ...livraisonData, id: editingDelivery.id }, commandeQuantity);

    if (success) {
      handleCloseForm();
    }
  };

  const isLoading = loadingLivraisons || loadingCommandes || loadingCiternes;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suivi des Livraisons</h1>
      </div>

      {isFormVisible && (
        <CreateDeliveryForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          deliveryData={editingDelivery}
          commandes={commandes}
          citernes={citernes}
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <DeliveriesList
          livraisons={livraisons}
          onEdit={handleEditDelivery}
          editingDeliveryId={editingDelivery?.id || null}
          onUpdate={updateLivraison}
        />
      )}
    </div>
  );
}
