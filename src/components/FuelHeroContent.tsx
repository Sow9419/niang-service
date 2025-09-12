import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Fuel, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export default function FuelHeroContent() {
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);

  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-2xl">
      <div className="text-left">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-effect mb-6 relative">
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
          <span className="text-foreground/90 text-sm font-light relative z-10 flex items-center">
            <Fuel className="w-4 h-4 mr-2" />
            ✨ Nouvelle interface de gestion avancée
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          <span className="fuel-gradient bg-clip-text text-transparent">Gérez</span> vos
          <br />
          <span className="font-light">citernes & livraisons</span>
        </h1>

        {/* Description */}
        <p className="text-lg font-light text-muted-foreground mb-8 leading-relaxed max-w-xl">
          Solution complète pour la gestion intelligente de vos citernes, livraisons d'essence et gasoil, 
          avec un CRM intégré pour optimiser vos opérations.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Stations équipées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-6 flex-wrap">
          <Button size="lg" className="fuel-glow smooth-transition group">
            Démarrer gratuitement
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="glass-effect smooth-transition">
                Voir les fonctionnalités
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl mb-4">Fonctionnalités Complètes</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                  <Fuel className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Monitoring Citernes</h3>
                  <p className="text-sm text-muted-foreground">Surveillance en temps réel des niveaux, température et qualité du carburant.</p>
                </div>
                <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                  <TrendingUp className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="font-semibold mb-2">Livraisons Optimisées</h3>
                  <p className="text-sm text-muted-foreground">Planification automatique et tracking GPS des livraisons d'essence et gasoil.</p>
                </div>
                <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                  <Users className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">CRM Intégré</h3>
                  <p className="text-sm text-muted-foreground">Gestion complète de votre clientèle et historique des transactions.</p>
                </div>
                <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="w-8 h-8 bg-primary/20 rounded mb-4 flex items-center justify-center">
                    <span className="text-primary font-bold">AI</span>
                  </div>
                  <h3 className="font-semibold mb-2">Prédictions IA</h3>
                  <p className="text-sm text-muted-foreground">Anticipez les besoins de ravitaillement avec notre IA prédictive.</p>
                </div>
                <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="w-8 h-8 bg-secondary/20 rounded mb-4 flex items-center justify-center">
                    <span className="text-secondary font-bold">📱</span>
                  </div>
                  <h3 className="font-semibold mb-2">App Mobile</h3>
                  <p className="text-sm text-muted-foreground">Accès complet depuis votre smartphone ou tablette.</p>
                </div>
                <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="w-8 h-8 bg-accent/20 rounded mb-4 flex items-center justify-center">
                    <span className="text-accent font-bold">🔒</span>
                  </div>
                  <h3 className="font-semibold mb-2">Sécurité Avancée</h3>
                  <p className="text-sm text-muted-foreground">Chiffrement de bout en bout et conformité aux normes industrielles.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}