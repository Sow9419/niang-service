
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text">
          Bienvenue dans FuelManager
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Tableau de bord de gestion des livraisons
        </p>
      </div>

      {/* Coming Soon Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-effect border-primary/20">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <CardTitle className="text-lg">Gestion des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Créer et suivre les commandes de carburant de vos clients
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-primary/20">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <CardTitle className="text-lg">Suivi des citernes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Suivre l'état et la position de votre flotte de citernes
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-primary/20">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <CardTitle className="text-lg">Tableau de bord</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Analyses et KPIs de vos opérations de livraison
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Card className="glass-effect border-primary/20 inline-block">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2 gradient-text">
              Application en développement
            </h3>
            <p className="text-muted-foreground">
              Les fonctionnalités principales seront bientôt disponibles
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
