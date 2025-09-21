import { useState } from "react";
import { useCiternes } from "@/hooks/useCiternes";
import { useConducteurs } from "@/hooks/useConducteurs";
import { useClients } from "@/hooks/useClients";
import TankerBoard from "@/components/gestion/TankerBoard";
import DriverList from "@/components/gestion/DriverList";
import ClientList from "@/components/gestion/ClientList";
import AddNewCiterne from "@/components/gestion/AddNewCiterne";
import AddNewConducteur from "@/components/gestion/AddNewConducteur";
import AddNewClient from "@/components/gestion/AddNewClient";
import type { Citerne, Conducteur, Client } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function GestionPage() {
  const { citernes, isLoading: loadingCiternes, createCiterne, updateCiterne, deleteCiterne } = useCiternes();
  const { conducteurs, isLoading: loadingConducteurs, createConducteur, updateConducteur } = useConducteurs();
  const { clients, isLoading: loadingClients, createClient, updateClient } = useClients();

  const [editingCiterne, setEditingCiterne] = useState<Citerne | null>(null);
  const [editingConducteur, setEditingConducteur] = useState<Conducteur | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [citerneToDelete, setCiterneToDelete] = useState<string | null>(null);

  const isLoading = loadingCiternes || loadingConducteurs || loadingClients;

  const handleEditCiterne = (citerne: Citerne) => setEditingCiterne(citerne);
  const handleEditConducteur = (conducteur: Conducteur) => setEditingConducteur(conducteur);
  const handleEditClient = (client: Client) => setEditingClient(client);

  const onFinished = () => {
    setEditingCiterne(null);
    setEditingConducteur(null);
    setEditingClient(null);
  };

  const handleDeleteCiterne = (citerneId: string) => {
    setCiterneToDelete(citerneId);
  };

  const confirmDeleteCiterne = () => {
    if (citerneToDelete) {
      deleteCiterne.mutate(citerneToDelete);
      setCiterneToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white pt-4 px-4 pb-2 rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-black">Gestion & Logistique</h1>
            <p className="text-gray-700 text-sm lg:text-base">Gérez vos citernes, conducteurs et clients en un seul endroit.</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:space-x-4">
            <AddNewClient createClient={createClient} updateClient={updateClient} clientToEdit={editingClient} onFinished={onFinished} />
            <AddNewConducteur createConducteur={createConducteur} updateConducteur={updateConducteur} conducteurToEdit={editingConducteur} onFinished={onFinished} />
            <AddNewCiterne createCiterne={createCiterne} updateCiterne={updateCiterne} citerneToEdit={editingCiterne} onFinished={onFinished} drivers={conducteurs} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <TankerBoard
            tankers={citernes}
            drivers={conducteurs}
            isLoading={isLoading}
            onEdit={handleEditCiterne}
            onDelete={handleDeleteCiterne}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          <DriverList drivers={conducteurs} isLoading={isLoading} onEdit={handleEditConducteur} />
          <ClientList clients={clients} isLoading={isLoading} onEdit={handleEditClient} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!citerneToDelete} onOpenChange={() => setCiterneToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette citerne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La citerne sera définitivement supprimée de votre base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCiterne} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}