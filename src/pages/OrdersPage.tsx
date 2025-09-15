
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des Commandes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Commandes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune commande pour le moment.</p>
          <p className="text-muted-foreground mt-4">Cette section affichera la liste des commandes de carburant.</p>
        </CardContent>
      </Card>
    </div>
  );
}
