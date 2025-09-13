import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Building2, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
}

export default function Home() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          setProfile(data);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Bienvenue dans FuelManager
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Tableau de bord de gestion des livraisons
            </p>
          </div>
          
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="glass-effect border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Informations du profil</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{profile?.full_name || "Non renseigné"}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{profile?.phone || "Non renseigné"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Entreprise</p>
                    <p className="font-medium">{profile?.company_name || "Non renseigné"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}