
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Building2, Phone, Mail, Settings, Loader2, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";

// Interface for user profile data
interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
}

export function SettingsDialog() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile when the dialog is opened and user exists
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          setProfile(data);
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle user sign-out
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mt-2">
          <img
            src="https://picsum.photos/200"
            alt="User Avatar"
            className="w-12 h-12 rounded-full border-2 border-orange-200 hover:border-orange-400 transition-colors"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Mon Compte</DialogTitle>
          <DialogDescription className="text-gray-700">
            Gérez les informations de votre profil et vos paramètres.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Profile Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-700" />
                <div>
                  <p className="text-sm text-gray-700">Email</p>
                  <p className="font-medium text-gray-700">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-700" />
                <div>
                  <p className="text-sm text-gray-700">Nom complet</p>
                  <p className="font-medium text-gray-700">{profile?.full_name || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-700" />
                <div>
                  <p className="text-sm text-gray-700">Téléphone</p>
                  <p className="font-medium text-gray-700">{profile?.phone || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-gray-700" />
                <div>
                  <p className="text-sm text-gray-700">Entreprise</p>
                  <p className="font-medium text-gray-700">{profile?.company_name || "Non renseigné"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center items-center pt-4 border-t-gray-300 space-x-4">
            <Button onClick={() => window.open("https://wa.me/22394231914", "_blank")} className="bg-black text-white hover:bg-gray-900 w-full">
                <MessageCircleMore className="w-4 h-4 mr-2" />
                contacter le support
            </Button>
            <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive w-full"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
