import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fuel, Menu, X } from "lucide-react";

export default function FuelHeader() {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Fuel className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">FuelManager</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-2">
        <Dialog open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Fonctionnalités
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Fonctionnalités de FuelManager</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Gestion des Citernes</h3>
                  <p className="text-sm text-muted-foreground">Surveillez les niveaux, la qualité et l'état de vos citernes en temps réel.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Livraisons Automatisées</h3>
                  <p className="text-sm text-muted-foreground">Planifiez et suivez vos livraisons d'essence et de gasoil avec précision.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">CRM Intégré</h3>
                  <p className="text-sm text-muted-foreground">Gérez votre base clients et historique des commandes efficacement.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Analyses Avancées</h3>
                  <p className="text-sm text-muted-foreground">Obtenez des rapports détaillés sur la consommation et les tendances.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Alertes Intelligentes</h3>
                  <p className="text-sm text-muted-foreground">Recevez des notifications pour les niveaux bas et la maintenance.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Interface Mobile</h3>
                  <p className="text-sm text-muted-foreground">Accédez à vos données depuis n'importe où via notre app mobile.</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Tarifs
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Plans d'Abonnement</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-6 border rounded-lg text-center">
                <h3 className="text-xl font-bold mb-4">Starter</h3>
                <div className="text-3xl font-bold mb-4">49€<span className="text-lg text-muted-foreground">/mois</span></div>
                <ul className="space-y-2 text-sm text-left">
                  <li>• Jusqu'à 3 citernes</li>
                  <li>• 100 clients max</li>
                  <li>• Support par email</li>
                  <li>• Rapports de base</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Choisir ce plan</Button>
              </div>
              <div className="p-6 border-2 border-primary rounded-lg text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                  Populaire
                </div>
                <h3 className="text-xl font-bold mb-4">Pro</h3>
                <div className="text-3xl font-bold mb-4">149€<span className="text-lg text-muted-foreground">/mois</span></div>
                <ul className="space-y-2 text-sm text-left">
                  <li>• Citernes illimitées</li>
                  <li>• 1000 clients max</li>
                  <li>• Support prioritaire</li>
                  <li>• Analyses avancées</li>
                  <li>• API access</li>
                </ul>
                <Button className="w-full mt-6">Choisir ce plan</Button>
              </div>
              <div className="p-6 border rounded-lg text-center">
                <h3 className="text-xl font-bold mb-4">Enterprise</h3>
                <div className="text-3xl font-bold mb-4">Sur mesure</div>
                <ul className="space-y-2 text-sm text-left">
                  <li>• Solution personnalisée</li>
                  <li>• Clients illimités</li>
                  <li>• Support dédié 24/7</li>
                  <li>• Intégrations custom</li>
                  <li>• Formation incluse</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Nous contacter</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          Documentation
        </Button>
      </nav>

      {/* Login Button Group with Arrow */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="hidden md:flex">
          Connexion
        </Button>
        <Button size="sm" className="fuel-glow">
          Démarrer
        </Button>
      </div>
    </header>
  );
}