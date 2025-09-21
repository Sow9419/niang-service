
import { useState } from "react";
import DeliveriesList from "@/components/livraison/DeliveriesList";
import CreateDeliveryForm from "@/components/livraison/CreateDeliveryForm";
import { useLivraisons } from "@/hooks/useLivraisons";
import { useAllCommandes } from "@/hooks/useAllCommandes";
import { useCiternes } from "@/hooks/useCiternes";
import { Skeleton } from "@/components/ui/skeleton";
import type { Livraison } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DeliveriesPage() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Livraison | null>(null);
  const { livraisons, isLoading: loadingLivraisons, updateLivraison } = useLivraisons();
  const { data: commandes, isLoading: loadingCommandes } = useAllCommandes();
  const { citernes, isLoading: loadingCiternes } = useCiternes();


    const handleShowCreateForm = () => {
    setEditingDelivery(null);
    setFormVisible(true);
  };
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

    await updateLivraison.mutateAsync({ ...livraisonData, id: editingDelivery.id });

    handleCloseForm();
  };

  const isLoading = loadingLivraisons || loadingCommandes || loadingCiternes;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-center bg-white p-4 rounded-lg shadow space-y-4 sm:flex-row sm:space-y-0">
        <h1 className="text-3xl font-bold text-black">Gestion des Commandes</h1>
        {!isFormVisible && (
          <Button onClick={handleShowCreateForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une nouvelle commande
          </Button>
        )}
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

      <DeliveriesList
        livraisons={livraisons}
        onEdit={handleEditDelivery}
        editingDeliveryId={editingDelivery?.id || null}
        onUpdate={(data) => updateLivraison.mutateAsync(data)}
        isLoading={isLoading}
      />
    </div>
  );
}
