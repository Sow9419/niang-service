"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Fuel, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FuelHeroContent() {
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-white/90 text-xs font-light relative z-10 flex items-center">
            <Fuel className="w-4 h-4 mr-2" />
            ✨ Interface de gestion avancée
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          <span className="font-medium italic instrument">Gérez</span> vos
          <br />
          <span className="font-light tracking-tight text-white">citernes & livraisons</span>
        </h1>

        {/* Description */}
        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed">
          Solution complète pour la gestion intelligente de vos citernes, livraisons d'essence et gasoil, 
          avec un CRM intégré pour optimiser vos opérations.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
                Fonctionnalités
              </button>
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
          
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer"
          >
            Démarrer
          </button>
        </div>
      </div>
    </main>
  );
}