"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Fuel } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Features } from "@/components/ui/features";

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
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-white">
              <DialogHeader className="relative bg-white p-0 flex items-baseline justify-center">
                <DialogTitle className="text-2xl mb-0 text-black pl-8 pt-4">Fonctionnalités Complètes</DialogTitle>
              </DialogHeader>
              <Features />
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