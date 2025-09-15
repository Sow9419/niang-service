
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GestionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion & Logistique</h1>
      <Card>
        <CardHeader>
          <CardTitle>Panneau de Gestion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Section de gestion en construction.</p>
          <p className="text-muted-foreground mt-4">Ici, vous pourrez gérer les clients, les véhicules et les chauffeurs.</p>
        </CardContent>
      </Card>
    </div>
  );
}
