"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Fuel, Truck, Users, BarChart3, Shield, Smartphone } from "lucide-react";

export default function FuelHeader() {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center">
        <svg
          fill="currentColor"
          viewBox="0 0 147 70"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="size-10 translate-x-[-0.5px] text-white"
        >
          <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"></path>
          <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"></path>
        </svg>
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
                <Truck className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-semibold mb-2">Livraisons Optimisées</h3>
                <p className="text-sm text-muted-foreground">Planification automatique et tracking GPS des livraisons d'essence et gasoil.</p>
              </div>
              <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                <Users className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2">CRM Intégré</h3>
                <p className="text-sm text-muted-foreground">Gestion complète de votre clientèle et historique des transactions.</p>
              </div>
              <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                <BarChart3 className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Analytics Avancés</h3>
                <p className="text-sm text-muted-foreground">Tableaux de bord détaillés et rapports d'activité en temps réel.</p>
              </div>
              <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                <Smartphone className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-semibold mb-2">App Mobile</h3>
                <p className="text-sm text-muted-foreground">Accès complet depuis votre smartphone ou tablette.</p>
              </div>
              <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                <Shield className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2">Sécurité Avancée</h3>
                <p className="text-sm text-muted-foreground">Chiffrement de bout en bout et conformité aux normes industrielles.</p>
              </div>
            </div>
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
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl mb-4">Plans d'Abonnement</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-xl mb-2">Starter</h3>
                <div className="text-3xl font-bold text-primary mb-4">29CFA<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm">✓ Jusqu'à 5 citernes</li>
                  <li className="text-sm">✓ Monitoring basique</li>
                  <li className="text-sm">✓ Support email</li>
                  <li className="text-sm">✓ App mobile</li>
                </ul>
                <Button className="w-full">Commencer</Button>
              </div>
              <div className="p-6 border-2 border-primary rounded-lg relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs">Populaire</div>
                <h3 className="font-semibold text-xl mb-2">Professionnel</h3>
                <div className="text-3xl font-bold text-primary mb-4">89CFA<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm">✓ Citernes illimitées</li>
                  <li className="text-sm">✓ Monitoring avancé</li>
                  <li className="text-sm">✓ CRM complet</li>
                  <li className="text-sm">✓ Analytics avancés</li>
                  <li className="text-sm">✓ Support prioritaire</li>
                </ul>
                <Button className="w-full">Commencer</Button>
              </div>
              <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-xl mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-primary mb-4">Sur mesure</div>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm">✓ Tout inclus</li>
                  <li className="text-sm">✓ API personnalisée</li>
                  <li className="text-sm">✓ Support dédié</li>
                  <li className="text-sm">✓ Formation équipe</li>
                  <li className="text-sm">✓ SLA garanti</li>
                </ul>
                <Button variant="outline" className="w-full">Nous contacter</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <a
          href="#"
          className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Docs
        </a>
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