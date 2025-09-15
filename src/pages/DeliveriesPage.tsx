
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeliveriesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Suivi des Livraisons</h1>
      <Card>
        <CardHeader>
          <CardTitle>Livraisons en cours</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune livraison en cours pour le moment.</p>
          <p className="text-muted-foreground mt-4">Cette section affichera le statut et la localisation des livraisons.</p>
        </CardContent>
      </Card>
    </div>
  );
}
