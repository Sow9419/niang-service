
import { useCiternes } from "@/hooks/useCiternes";
import { useConducteurs } from "@/hooks/useConducteurs";
import TankerBoard from "@/components/gestion/TankerBoard";
import DriverList from "@/components/gestion/DriverList";
import { Skeleton } from "@/components/ui/skeleton";
import AddNewCiterne from "@/components/gestion/AddNewCiterne";
import AddNewConducteur from "@/components/gestion/AddNewConducteur";

export default function GestionPage() {
  const { citernes, loading: loadingCiternes, createCiterne, updateCiterne } = useCiternes();
  const { conducteurs, loading: loadingConducteurs, createConducteur } = useConducteurs();

  const isLoading = loadingCiternes || loadingConducteurs;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestion & Logistique</h1>
        <p className="text-muted-foreground">Gérez vos citernes et conducteurs en un seul endroit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Flotte de Citernes</h2>
            <AddNewCiterne createCiterne={createCiterne} />
          </div>
          <TankerBoard
            tankers={citernes}
            drivers={conducteurs}
            onUpdateTanker={updateCiterne}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Équipe de Conducteurs</h2>
            <AddNewConducteur createConducteur={createConducteur} />
          </div>
          <DriverList drivers={conducteurs} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
