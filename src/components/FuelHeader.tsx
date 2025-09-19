"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Fuel, Truck, Users, BarChart3, Shield, Smartphone } from "lucide-react";
import { Features } from "./ui/features";
import { useNavigate } from "react-router-dom";

export default function FuelHeader() {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const navigator = useNavigate();

  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-2xl font-bold text-white">MAGICUX</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-2">
        <Dialog open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
          <DialogTrigger asChild>
            <a
              href="#"
              className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              Fonctionnalités
            </a>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-white">
            <DialogHeader className="relative bg-white p-0 flex items-baseline justify-center">
                <DialogTitle className="text-2xl mb-0 text-black pl-8 pt-4">Fonctionnalités Complètes</DialogTitle>
              </DialogHeader>
            <Features/>
          </DialogContent>
        </Dialog>

        <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
          <DialogTrigger asChild>
            <a
              href="#"
              className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              Tarifs
            </a>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-500">
            <DialogHeader>
              <DialogTitle className="text-3xl mb-4">Plans d'Abonnement</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="p-6 border-2 border-primary rounded-lg relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs">Populaire</div>
                <h3 className="font-semibold text-xl mb-2">Professionnel</h3>
                <div className="text-3xl font-bold text-primary mb-4">100 000CFA<span className="text-sm font-normal text-white">/mois</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm">✓ Citernes illimitées</li>
                  <li className="text-sm">✓ Monitoring avancé</li>
                  <li className="text-sm">✓ CRM complet</li>
                  <li className="text-sm">✓ Analytics avancés</li>
                  <li className="text-sm">✓ Support prioritaire</li>
                </ul>
                <Button onClick={() => navigator("/signup")} className="w-full">Commencer</Button>
              </div>
              <div className="p-6 border border-gray-400 rounded-lg hover:border-primary/50 transition-colors shadow-lg">
                <h3 className="font-semibold text-xl mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-primary mb-4">Sur mesure</div>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm">✓ Tout inclus</li>
                  <li className="text-sm">✓ API personnalisée</li>
                  <li className="text-sm">✓ Support dédié</li>
                  <li className="text-sm">✓ Formation équipe</li>
                  <li className="text-sm">✓ SLA garanti</li>
                </ul>
                <Button onClick={() => window.open("https://wa.me/22394231914", "_blank")} variant="outline" className="w-full border border-gray-400">Nous contacter</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </nav>

      {/* Login and Signup Buttons */}
      <div className="flex items-center space-x-4">
        <LoginDialog>
          <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
            <button className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>
            <button className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10">
              Connexion
            </button>
          </div>
        </LoginDialog>
        
        <Button 
          variant="outline"
          onClick={() => window.location.href = "/signup"}
          className="border-white/20 text-white hover:bg-white/10 hover:border-white text-xs h-8 px-4"
        >
          Créer un compte
        </Button>
      </div>
    </header>
  );
}